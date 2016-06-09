---
layout: post
title: 3 Things I Learned the hard way about distributed systems
featured: true
---

There's a lot of blog posts about scaling distributed systems to hundreds of thousands users, but not many are about the basics mistakes you'll make when trying to build one.

In this post, I'll share three things I wish I had learned in college (instead of the hard way 😁!).

## 1. Limits are everything

I learned this pretty quickly: you can not expect an external service to always work. Even big companies like Google and Amazon have outages, and you need to prepare for it. This means, setting timeouts when querying an API.

This also works the other way around --- if you have an external API, limit the maximum number of requests per customers. Accidental DDoSes are a thing.

## 2. Forget about this fancy algorithm[^database]

Some engineers like fancy algorithms --- I know I used to, too. I've changed my mind after getting regular on-call time. The complicated algorithm you wrote at 11AM will not make any sense when you'll get paged 2 months later at 3AM.

I now try to write the dumbest, most obvious code possible. My 3AM self appreciates it.

## 3. Pick your fights

Nowadays programming mean relying on hundreds of thousands of lines of code you haven't written.[^rails] You are going to run into weird interactions between different libraries. You may waste a lot of time trying to debug them.[^funstory]

A lot of engineers love debugging complex problems, especially if it involves low-level bits and pieces (I know I do!). Unfortunately, not every problem is worth solving, and a simple service restart may be the solution to this problem. You'll have to accept it and move on, as hard as it may be.

Thanks for reading!


[^DDoS]: If you're building a public API get prepared to get unvoluntarily DDoSed pretty often, which is why it's a good idea to have throttling set-up from the get-go.
[^database]: (or database, language, library)
[^rails]: Just think about all the lines of code an HTTP request goes through before hitting your Rails controller.
[^funstory]: Fun story: I once spent several days chasing a weird OpenSSL memory leak in the [Nylas Sync Engine](https://github.com/nylas/sync-engine). I gave up after reading way too many core dumps.

    Eventually, we solved the problem by restarting our service once a day (which isn't a bad idea either!)
