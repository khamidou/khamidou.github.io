---
layout: post
title: 3 Things I Learned the hard way about distributed systems
featured: true
---

There's a cottage industry of weblogs and blog posts about systems to thousands of RPS, but surprisingly, not many are about the basics of building a distributed system. In this post, I'll share three things I wish I didn't have to learn the hard way 😁.

## 1. Limits are everything

This lesson I learned pretty quickly: you can not expect an external service to always work. Even big companies like Google and Amazon have outages, and you have to build this into your service.

Sometimes your requests to an external API will hang (set a timeout!). Other times an external webhook will DDoS you (set up throttling!). Always make sure your system can handle unexpected failures.

## 2. Forget about this fancy algorithm[^database]

Some engineers like fancy algorithms --- I know I used to, too. I have a rule of thumb --- I write code to make sure that I'll be able to understand it even if I get paged at 3AM. It's not always possible but it makes things easier.

## 3. Sometimes you won't have a definite answer (and it's okay)

Maybe you're running a Rails app on Linux, or a Python app on FreeBSD. You're relying on hundreds of thousands of lines of code you haven't written. You will run into performance edge-cases, but most of the time you won't notice. Sometimes you'll run into weird interactions which you won't be able to debug.

Sometimes, a simple service restart will solve the problem. You'll have to accept it and move on, as hard as it may be.

[^database]: (or database, language, library)
