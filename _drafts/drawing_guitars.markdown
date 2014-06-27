---
layout: post
title: Drawing guitars
categories: guitars, programming
---
I'm working on a [guitar-related venture](http://octaveguitars.com) with a friend. We wanted to help our potential clients get a better feel of how their guitar will look like. To do this we decided to create a step by step wizard. You can try it [here](http://octaveguitars.com/designer). 

We're using Django to develop the site, with some Javascript sprinkled here and there. It's a great framework for this type of website and it provided everything we needed out of the box, except for one thing: drawing guitars. 

We had interesting problems trying to draw semi-realistic guitars. This is what this article is about.
<br>
<br>


<img src="/images/drawing_guitars/guitar.jpg" width="512" />

<sup>The (almost) final product. Some things don't fit yet, like the pickguard.</sup>

## The joy of PHP

You've got two options if you want to generate an image programatically. We either could do it client-side, like all the cool kids, or server-side, which is boring but works everywhere. We chose server side. [Another guitar maker does it client-side](https://monikerguitars.com/guitar-configurator/). 

To generate images on the server, I wanted to use PIL - the Python Imaging Library - which is notorious for being hard to install. At some point I just threw my hands in the air and said "I'll just write some quick script in PHP. How hard could it be?". Quite hard indeed.

The problem with PHP is the language tries very hard to not get in your way. You can get away with almost anything, which is nice at the beginning of a project, but get tedious when things need to have structure. It's very easy to paint yourself into a corner.

## Playing Dr Frankenstein with images

So, we wanted to have people progressively customize their guitar. It maps nicely to a script: 
We asked an illustrator to draw for us individual guitar elements:


![lp pickup selector](/images/drawing_guitars/lp_selector.png)

<sup>The pickup selector for a Gibson Les Paul. </sup>

After this I wrote a script to take these elements and build a guitar image beginning with the body and progressively adding the neck, the pickups, painting, etc. 

One interesting problem I met is with positioning elements.

![geometry manager](/images/drawing_guitars/geometry_manager.png)
