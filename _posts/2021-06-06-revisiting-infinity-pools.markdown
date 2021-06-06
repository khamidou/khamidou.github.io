---
layout: post
title: "Revisiting Infinity Pools"
featured: true
---
A few years back (4 years already!) I built [Infinity Pools](/infinity-pools.html), an extension to block the constantly refreshing feeds from Facebook and Twitter. Unfortunately, after a few months, both websites changed how their refresh their feeds and the extension broke.

A couple weeks ago, I decided to take another stab at it. I've always felt it made more sense to block websites after a certain amount of time, so I decided to go with that.

This was relatively straightforward but so the next question was to decide what to put on the timeout page.

I've always been a big fan of confetti and balloons animations so I started with a simple balloon animation that [I found on codepen.io](https://codepen.io/moettinger/pen/YVPzNX).

The result was pretty cool but the animation wasn't super smooth:

![balloons](/images/infinity_pools/css_balloons.png)

That seemed like a good reason to learn the HTML Canvas API.
