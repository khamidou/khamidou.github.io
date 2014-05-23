---
layout: post
title: Small gains compound
---
I'm working on [Kite](http://kiteapp.io), an gmail clone you can deploy on your own server. The deployment process is automated by a mixture of fabric and puppet.

Lately I've been focused on reducing a friction in my development environment. It began when I discovered that fabric lets you pass a password argument.[^fabric] Before using this option, I had to enter my password multiple times. This cut my deploy time from 2 minutes down to about 45 sec. 

I'm surprised by the change it brought. Not only do I spend less time slacking between deploys but I also get to test the code on a real server more often. 

![XKCD tasks](/images/small_gains/is_it_worth_the_time.png)

  mostly because this sort of small change didn't matter most of the time always took more time to fix than estimated[^rabbithole]. I was wrong.

I was surprised how much it changed how I develop. Development is all about feedback loops. For example, if deploying is a process which takes ten minutes of your life during which you have to babysit a server chances are you won't do it often.

Cutting the deployment time makes it easier to test things on your staging server. You get the same experience than your users.[^parallax] This means you'll do more incremental deploys on the staging server, which will make it more likely that you'll find deployment bugs just after introducing them instead of three days later.

__Key takeaway: Release engineering is important.__

[^fabric]: The option is `-p`, if you're wondering.
[^parallax]: How many sites are barely usable because their developers developed them locally on cutting-edge desktops? I'm not saying you should develop on a VT-100 sshing into a 2006 laptop stored in your cupboard but you've got to test your site using the devices your users have. It's part of the development process now.
[^rabbithole]: You should see the vim config I'm using to type this. It's a total mess. I can't be bothered to fix it because it means taking an extensive trip down the vimscript rabbit hole. 

    Very often, things are a lot more complex than they appear to be. I try to pick my fights.
