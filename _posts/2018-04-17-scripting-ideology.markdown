---
layout: post
title: "The scripting ideology"
featured: true
---
The other day I randomly came across one of Larry Wall's keynotes, [Perl, the first postmodern language](http://www.wall.org/~larry/pm.html). It's a fascinating read and really articulates what makes scripting languages different from other languages.

I remember when I started using Python, after years of using C. It felt like I finally found a tool that fit my hand. Why that?

Besides convenience reasons[^gc], I think the main reason is ideological. C and Python (and scripting languages in general) have opposite worldviews.

C programmers are supposed to know what they're doing, and the compiler stays mostly out of your way. This leads to a culture of inscrutable programs[^ken-thompson] and manual memory management. You don't stumble into writing a C program; you have to carefully plan the structure of the program ahead of time.

Scripting languages have the opposite view. They're interactive; they're playful; they let you figure things out as you go. That's why most of them have a [repl](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop), late-binding, and are kind of multiparadigm.

You don't have to be an exceptional programmer to use them – you can just make it up as you go, and it's going to be mostly alright. As a life philosophy, it kinds of beats C's "everything must be perfect or your program crashes".

[^ken-thompson]: Which reminds me of this joke from the [Unix haters handbook](http://web.mit.edu/~simsong/www/ugh.pdf): Ken Thompson has an automobile which he helped design. Unlike most automobiles, it has neither speedometer, nor gas gauge, nor any of the other numerous idiot lights which plague the modern driver. Rather, if the driver makes a mistake, a giant “?” lights up in the center of the dashboard. “The experienced driver,” says Thompson, “will usually know what’s wrong.”

[^gc]: I'm not going to lie, garbage collection and a huge built-in standard library were big, though.
