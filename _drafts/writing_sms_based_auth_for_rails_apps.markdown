---
layout: post
title: SMS-based auth for Rails applications
category: software
---

Let's add SMS-based two-factor auth to a generic Rails application. Hopefully we'll learn what makes an auth system robust along the way. We'll be using devise, because it's pretty much the standard library for adding user support to a Rails app.

## The basics: generating codes

First, we need to generate codes. What do we want from a generated code?

 A one-time code should:

- be usable only once (duh)
- have a built-in expiration date
- not allowing to guess the previous or next codes

Luckily, the smart people at the IETF have thought about this and created a standard (two actually): [HOTP](https://tools.ietf.org/html/rfc4226) and [TOTP](https://tools.ietf.org/html/rfc6238)[^readable].

HOTP is the simpler of the two algorithms. Let's talk about it first.

The basic idea behind HOTP is to use a modified HMAC function to generate one-time numbers. This function takes two arguments: a secret key and a counter. The counter is incremented between runs which actually changes the output of the function.

{% highlight javascript %}
HOTP(Key,Counter) = Truncate(HMAC(Key, Counter)) & 0x7FFFFFFF
{% endhighlight %}

If you are using an auth system like [Google Authenticator](http://en.wikipedia.org/wiki/Google_Authenticator) to auth to a server then the algorithm will run both on the server and your smartphone. This can lead to interesting sync problems when counters get askew but thankfully, we don't need to bother about this since we only want to generate a one-time code. We don't need to prove our user shares a secret with us.

The main problem with HOTP -- which is why most real-world systems use TOTP -- is that the generated code has no expiration time.[^google_authenticator]. If for some reason a hacker intercepted the SMS with the code and prevented you from entering it, they would be able to log into your account at their leisure.

TOTP elegantly solves this problem by replacing the shared counter with the current time.[^drift] This is the formula from the RFC:

{% highlight ruby %}
T = (Current Unix time / Token_Validity_Period).floor
TOTP(Key) = HOTP(Key, T)
{% endhighlight %}

How does this work? First we've got to define a validity period for our token. The RFC recommends 30 seconds because it's a good compromise between security and usability. We divide the current time by the token validity period and floor it to get a value rounded to the start of the closest validity period(FIXME.

Finally we feed the value to the token to the HOTP algorithm.

### Generating one-time tokens in Ruby

We're going to use [ROTP](https://github.com/mdp/rotp) which is a nice pure-ruby library that generates RFC6328-compatible tokens[FIXME].

You'll need to install it first:

{% highlight ruby %}
gem install rotp
{% endhighlight %}

This is how you generate a TOTP token.

{% highlight ruby %}
totp = ROTP::TOTP.new("secretsecret", interval:120)
totp.now # => "076864"
{% endhighlight %}

The `interval` parameter allows us to define a custom token validity period. We set it to 2 minutes because we're going to send the token by SMS and we'd like to compensate for any SMS transmission delay.[^real_world]

We can check the validity of a token like this:

{% highlight ruby %}
totp.verify("076864") # => true
{% endhighlight %}

## Sending SMS codes

I've heard nothing but good things about Twilio, so I'm going to use their service. Of course, having an easy to use Ruby API helped too.

## The auth flow

This is probably the hardest part of the problem. I think that the easiest way to understand this it to model an user account as a finite state machine (seriously).

Wondering about what makes an auth system great? I'm writing a short guide to explain the basics of two-factor auth. Subscribe to my mailing list to occasionally get short emails about this.

[^readable]: You should try reading them. Unlike a lot of RFCs, they're very readable, if not a little dry.
[^google_authenticator]: This is especially important when you're using an app like the Google Authenticator to auth you.
[^drift]: Of course, this approach has problems too: it's necessary to keep the two systems in more or less in sync. There is an error compensation mechanism built in the algorithm -- it's recommended that the server looks up one or two values in the before the generated time.
[^real_world]: Note that this not the best thing to do in the real world. You almost certainly want instead to compute the values of the previous one-time codes and check if the code is one of them. See [resync mechanism](https://tools.ietf.org/html/rfc6238#page-7) for more details.
