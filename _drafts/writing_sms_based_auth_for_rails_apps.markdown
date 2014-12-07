---
layout: post
title: Implementing SMS-based auth for Rails applications
category: software
---

Let's add SMS-based two-factor auth to a generic Rails application. Hopefully we'll learn what makes an auth system robust along the way. We'll be using [devise](https://github.com/plataformatec/devise), because it's pretty much the standard library for adding user support to a Rails app.

__A warning__: I haven't written serious ruby in a while --- I mostly work with Python[^inbox] --- so a pythonism or two may have slipped in.

## The basics: generating codes

First, we need to generate codes. What do we want from a one-time code?

A one-time code should:

- be usable only once
- have a built-in expiration date
- not allowing to guess the previous or next codes

Luckily, the smart people at the IETF have thought about this and created a standard algorithm (two actually): [HOTP](https://tools.ietf.org/html/rfc4226) and [TOTP](https://tools.ietf.org/html/rfc6238)[^readable].

**HOTP** is the simpler of the two algorithms. Let's talk about it first.

The basic idea behind HOTP is to use a modified HMAC function to generate one-time numbers. This function takes two arguments: a secret key and a counter. The counter is incremented between runs which actually changes the output of the function.

{% highlight javascript %}
HOTP(Key,Counter) = Truncate(HMAC(Key, Counter)) & 0x7FFFFFFF
{% endhighlight %}

If you are using an auth system like [Google Authenticator](http://en.wikipedia.org/wiki/Google_Authenticator) to auth to a server then the algorithm will run both on the server and your smartphone. This can lead to interesting sync problems when counters get askew but thankfully we don't have to prove the user shares a secret with us. We just want to generate a one-time code.

The main problem with HOTP --- which is why most real-world systems use TOTP --- is that the generated code has no expiration time.[^google_authenticator]. If for some reason a hacker intercepted the SMS with the code and prevented you from entering it, they would be able to log into your account at their leisure.[^unlikely]

**TOTP** elegantly solves this problem by replacing the shared counter with the current time.[^drift] This is the formula from the RFC:

{% highlight ruby %}
T = (Current Unix time / Token_Validity_Period).floor
TOTP(Key) = HOTP(Key, T)
{% endhighlight %}

How does this work? First we've got to define a validity period for our token. The RFC recommends 30 seconds because it's a good compromise between security and usability.

We divide the current time by the token validity period and floor it to get a value rounded to the start of the closest validity period. Finally we feed the value to the HOTP algorithm.

### Generating one-time tokens in Ruby

We're going to use [ROTP](https://github.com/mdp/rotp) which is a nice pure-ruby library that generates RFC-compatible tokens.

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

Now that we can generate tokens, let's figure out how to send them.

## Sending SMS codes

I've heard nothing but good things about [Twilio](http://twilio.com/), so I'm going to use their API. Of course, you can use one of their [many](https://www.plivo.com/) [alternatives](https://www.nexmo.com/) instead.

Twilio has an easy to use [gem](https://github.com/twilio/twilio-ruby). Grab it with:

{% highlight ruby %}
gem install twilio-ruby
{% endhighlight %}

Now, let's write a short function to send an SMS to our user:

{% highlight ruby %}
require 'twilio-ruby'

# Replace those with the values from the Twilio application dashboard
account_sid = 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
auth_token = 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy'
@twilio_phone_number = '+nnnnnnnnnnn'

# set up a client to talk to the Twilio REST API
@client = Twilio::REST::Client.new account_sid, auth_token

def send_message(number, message)
    @client.messages.create(
        from: @twilio_phone_number,
        to: number,
        body: message)
end

send_message('+336123456789', 'Hey, this is a test')
{% endhighlight %}

So, we now know how to generate relatively secure codes, and how to send them. Logically the next step should be to start integrating this with Rails. Right? Wrong![^austrian] We've got some thinking to do about how we will fit everything together.

## The perils of designing a real world system

A login system is a complex thing to design and I found the easiest way to design one is to model it as a finite state machine. Take a couple minutes and try to design a simple auth flow. You'll need to list all the possible states for an account (hint: three in the simplest case) and all the transitions that occur between them.

A real world auth system not only has to be secure but also relatively user-friendly --- you can't tell an user they're locked out of their account because they've lost their phone.[^google]

Fortunately, we're not designing a real-world system. We can take shortcuts. Here's my assumptions about the system we're designing:

1. We're striving to have the simplest possible system --- as such, we're going to have to minimize state transitions
1. It's okay to delay things. If you've lost your password, we'll send you one if you complain loudly, in a couple weeks.

I think that the simplest way to


As an exercise left for the reader, I've left three critical security flaws in the login process. Can you spot them?

## Fitting everything together

Now's the time to take everything that we learned and implement this into a Rails app. Since we're using [devise](https://github.com/plataformatec/devise) to handle auth concerns we'll have to write a plugin to send a one-time code after that an user has logged in successfully. Fear not, this is relatively easy!

### Setting up devise

If you haven't setup devise yet, I strongly recommend reading the [Getting Started with Devise guide](https://github.com/plataformatec/devise#getting-started). I'll assume you've got it set up with a basic user model.

### Extending our user model

The first thing we'll do is to extend our user model to hold the secret key used to generate the one-time code. To do this we'll add a new field, `auth_secret` to the field.

### Extending devise

What happens when an user logs in using devise?

1. His browser POSTs a form to /users/sign_in
2. The devise controller, 

Believe it or not, devise is just another Rails application and its pretty easy to modify it.

{% highlight ruby %}

{% endhighlight %}


<div class="bluebox">
<p>
    I've got a mailing list. I occasionally send to my subscribers in-depth guides on backend programming.
</p>
<form>
    <input type="text"></input>
    <input type="submit" value="Subscribe!"></input>
</form>
</div>

[^inbox]: At [Inbox](http://inboxapp.com). We're [hiring!](https://www.inboxapp.com/jobs)
[^readable]: You should try reading them. Unlike a lot of RFCs, they're very readable, if not a little dry.
[^google_authenticator]: This is especially important when you're using an app like the Google Authenticator to auth you.
[^unlikely]: I admit this is somewhat unlikely. I'm not good at making plausible, real-world scenarios. That's why I'm not a security researcher.
[^drift]: Of course, this approach has problems too: it's necessary to keep the two systems in more or less in sync. There is an error compensation mechanism built in the algorithm -- it's recommended that the server looks up one or two values in the before the generated time.
[^real_world]: Note that this not the best thing to do in the real world. You almost certainly want instead to compute the values of the previous one-time codes and check if the code is one of them. See [resync mechanism](https://tools.ietf.org/html/rfc6238#page-7) for more details.
[^austrian]: Please read this with a thick Austrian accent.
[^google]: Unless you're Google, I guess.
