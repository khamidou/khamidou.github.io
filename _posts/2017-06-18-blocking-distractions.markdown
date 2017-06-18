---
layout: post
title: 'Blocking distractions, automatically'
featured: true
---
A couple months ago I started noticing that my habit of checking reddit in small moments of downtime -- like while waiting for a build -- was pretty disruptive. It's hard to get back to work after having been distracted by random stories of startup glory and drama.

It turns out a lot of people have this exact same problem, and there's a [small](https://www.rescuetime.com/) [cottage](https://heyfocus.com/) [industry](https://selfcontrolapp.com/) [of apps](https://freedom.to) for that. I don't like installing random apps from the Internet, so I came up with a different solution: blocking reddit from `/etc/hosts`.

That worked well but I'd often forget to block reddit after reading it, which means I'd still mindlessly end up in some Internet rabbit hole while waiting for something to complete. To work around this I decided to write a simple Python script that would automatically block distractions. You can see it [here](https://raw.githubusercontent.com/khamidou/dotfiles/master/bin/block-distractions).[^friction]

I'm running this as a cron job every 15 minutes, and it seems to work, for now. We'll see how effective it is after a couple weeks.

[^friction]: What I like the most about this approach is its friction. If I want to unblock reddit, for example, I have to login as root, open the file, comment out the entry and then quit. That's a lot of steps just for checking out reddit!

    It's also something I have to do over and over because the computer keeps resetting the file.


