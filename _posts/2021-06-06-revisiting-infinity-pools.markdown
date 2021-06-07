---
layout: post
title: "Revisiting Infinity Pools"
featured: true
---
A few years back (4 years already!) I built [Infinity Pools](/infinity-pools.html), an extension to block the constantly refreshing feeds from Facebook and Twitter. Unfortunately, after a few months, both websites changed how their refresh their feeds and the extension broke.

A couple weeks ago, I decided to take another stab at it. I've always felt it made more sense to block websites after a certain amount of time, so I decided to go with that.

After doing that, I had to decide what to put on the timeout page. I've always been a big fan of confetti and balloons animations so I started with a simple balloon animation that [I found on codepen.io](https://codepen.io/moettinger/pen/YVPzNX).

The result was pretty cool but the animation wasn't super smooth (most likely because it relies on JQuery's animation framework).

![balloons](/images/infinity_pools/css_balloons.png)

<br>

To improve that, I decided to port the example code to Canvas. I figured it'd be a fun way to practice some animation drawing, a thing I hadn't done any since using GDI+ on Windows.

Using Canvas was relatively straightforward, although the API has some interesting edge cases around using Retina screens. I also ran into some weird screen tearing issues that made me not use rotations altogether, since I really didn't want to relearn college matrix algebra 😅

Here's the final result:

![balloons](/images/infinity_pools/final_balloons.png)

Of course, you can find the source code for this extension on [Github](https://github.com/khamidou/infinity-pools/).
