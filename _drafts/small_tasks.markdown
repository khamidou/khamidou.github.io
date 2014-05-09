---
layout: post
title: Small gains compound
---
Lately I've been focused on reducing a friction in my development environment. 

It began when I discovered that fabric lets you pass a password argument. Before using this option, I had to enter my password multiple times. This cut my deploy time from 2 minutes down to 30 sec. 

![Xkcd chart](/images/small_gains/is_it_worth_the_time.png)

<small>(image courtesy of [XKCD](http://xkcd.com))</small>

This sounds like a small change, but it's not. Development is all about feedback loops. For example, if deploying is a process which takes ten minutes of your life[^maven] during which you have to babysit a server chances are you won't do it often.

Cutting the deployment time makes it easier to test things on your staging server. You get the same experience than your users.[^parallax] This means you'll do more incremental deploys on the staging server, which will make it more likely that you'll find deployment bugs just after introducing them instead of three days later.


So, one-click deploys let me deploy more often, ok. There's something else they bring you: it's no

[^parallax]: How many sites are barely usable because their developers developed them locally on cutting-edge desktops? I'm not saying you should develop on a VT-100 sshing into a 2006 laptop stored in your cupboard but you've got to test your site using the devices your users have. It's part of the development process now.

[^maven]: How many hours were wasted trying to get Maven or MSBUILD to work? The thought is staggering.
