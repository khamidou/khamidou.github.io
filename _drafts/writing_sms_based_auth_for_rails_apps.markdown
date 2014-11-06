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

If you are using an auth system like [Google Authenticator](http://en.wikipedia.org/wiki/Google_Authenticator) then the counter is incremented both on the server and on your smartphone. This can lead to interesting sync problems when counters get askew. Thankfully, we don't need to bother about this since we only want to generate a one-time code, we don't need to prove our user shares a secret with us.

The main problem with HOTP -- which is why most real-world systems use TOTP -- is that the generated code has no expiration time.[^google_authenticator]. If for some reason a hacker intercepted the SMS with the code and prevented you from entering it, they would be able to log into your account at their leisure.

TOTP elegantly solves this problem by replacing the shared counter with the current time.[^drift]

## The auth flow

This is probably the hardest part of the problem. I think that the easiest way to understand this it to model an user account as a finite state machine (seriously).

Wondering about what makes an auth system great? I'm writing a short guide to explain the basics of two-factor auth. Subscribe to my mailing list to occasionally get short emails about this.

[^readable]: They're very readable, if not a little dry.
[^google_authenticator]: This is especially important when you're using an app like the Google Authenticator to auth you.
[^drift]: Of course, this approach has problems too: it's necessary to keep the two systems in sync. 
