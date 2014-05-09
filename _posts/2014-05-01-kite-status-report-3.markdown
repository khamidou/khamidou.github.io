---
layout: post
title: Kite status report 3
---

I haven't written a status report for a long long time. I got stuck with a DNS bug which took a while to resolve and I got sidetracked by other projects. Things are getting better though: I've resolved this DNS bug and I'm halfway through adding multi-user support.

### The DNS bug

DNS is complex, and my ISP having some pretty aggressive caching made solving this bug a lesson in patience.
The problem was simple. I setup dogfood.kiteapp.io as a staging server and I wanted to receive emails addressed to it.
Naïvely, I thought adding these lines to my DNS config would work:

    dogfood.kiteapp.io. A XXX.XXX.XXX.XXX
    dogfood.kiteapp.io MX 10 dogfood.kiteapp.io.

If you're not a DNS expert, you'll probably think this setup is okay. 

You'd be wrong. 

Take a closer look. I forgot the final '.' on the line specifying the mail server destination. This means I've defined an email server for the subdomain `dogfood.kiteapp.io.kiteapp.io`, in the process making all my emails addressed to `dogfood.kiteapp.io` go fill the great bucket in the sky.

So, this was a silly bug.

### Multi-user support

I've started working on making Kite support multiple users. This involves refactoring the existing backend code to look in the right directories, handling authentification and adding multi-user support to the angular frontend.

At this point, I'm split between adding multi-user support and adding more features to the UI. I think I'm probably going to polish a little more the single-user experience before thinking of adding something else.  

As always, send your comments, features requests and general inquiries at karim @ this domain name.
