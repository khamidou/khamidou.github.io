---
layout: post
title: Kite status report 1
---
### Kite status report 1

<p class="meta">December 07, 2013</p>

I get a lot of emails asking about my progress on [kite](http://khamidou.github.io/kite), so from now on I'll regularly share a quick status report.

I spent the last four weeks working on backend stuff, in particular:

- Adding dovecot to the puppet recipe
- Rewriting the postfix config
- Setting up supervisor to monitor kite's various daemons
- Creating a thread indexing daemon

<br>

#### Adding dovecot to the puppet recipe

I've had a lot of requests for this one. Obviously, this is very alpha-ish, but it's possible to read your email using an IMAP client. I've still got to figure out how to make filters play along with dovecot, though.

### Rewriting the postfix config

I had a pretty insane postfix config where all the emails would be forwarded to an user using the `always_bcc` rule. Thankfully, I've set up a config which makes a lot more sense, using postfix virtual maildirs. 

### Setting up supervisor to monitor kite's various daemons

[Supervisor](http://supervisord.org/) is a daemon written in Python used to monitor processes. I mostly use it to restart my daemons when they die.

I spent a lot of time on this one because initially I was using the stock supervisor version from debian. Unfortunately, it's been 
heavily modified to suit the debian standards so it's outdated and somehow broken. I also had to write an rc.d script because supervisor doesn't ship with one.

### Creating a thread indexing daemon

From now on, Kite will display emails grouped by threads. To do this, I've written a small program called [filterdaemon.py](https://github.com/khamidou/kite/blob/master/src/back/kite/filterdaemon.py). It uses inotify to find new emails and write them to an index file called threads_index.json. It's a simple JSON list with metadata about threads.

For those wondering, I didn't use a database because the emails are text files, so it makes sense to store metadata about the files in text files, too.

### What's next ?

The two big things on my list are:

- refactoring the server to handle email threads. It should probably be ready by 2014.
- easy vagrant setup. Trying kite in vagrant will be as easy as running "vagrant up" and connecting to 192.168.50.4.

<br>
### Contact, questions, remarks

Send me an email at kite at this domain name (sorry for the obfuscated email, I haven't setup the antispam yet).

Regards,

Karim
