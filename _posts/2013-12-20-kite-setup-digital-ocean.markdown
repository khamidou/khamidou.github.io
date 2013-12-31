---
layout: post
title: Setting up Kite on Digital Ocean
date: December 20, 2013
---

One cultural practice I really liked at Microsoft is [dogfooding](http://blogs.msdn.com/b/oldnewthing/archive/2011/08/02/10191834.aspx). It's religiously observed there.<br>Basically, it means using your own software in production to force you to fix issues you may have not seen otherwise.

I wanted to start dogfooding [Kite](http://khamidou.github.io/kite) as soon as possible, and I'm proud to say it's now possible. Here's a quick setup guide.

<!-- more -->


**Disclaimer: Obviously, don't use it in production. There's no user separation yet, so anyone can read your email, you could lose data, etc.**

#### Creating the droplet

I'm using Digital Ocean. I chose an Ubuntu 12.04 machine.

After logging in as `root` on the machine, I created a new user, `kitesetup`, and added it to the people who can `sudo`:

    adduser kitesetup
    adduser kitesetup sudo

<br>
#### Creating the domain name

Configuring the DNS is a bit more tricky:
    
Pointing the MX DNS field to the correct machine.

#### Getting the latest sources

Clone the sources:

    git clone https://github.com/khamidou/kite.git

Install fabric for the deployment

    sudo apt-get install python-fabric


<br>
#### Deployment

Simply run:
    fab setup -u kitesetup -H myhost.example.com

This script outputs a lot of text. Enter your ssh key or user password when prompted. You'll have to do it multiple times because `fabric` has a strange way to handle keys and passwords.

Note: by default, this script does sets some sensible SSH settings, like turning off password-based auth. If you want to skip this step,
run instead `fab setup_plain`.

That's all folks!

I had a number of experiments I wanted to run. For instance, I really wanted to see how well a long-lived instance would handle real world loads, so I've deployed one which I subscribed to the linux kernel mailing list.
I was really surprised to see it handling the load that well. It's pretty crazy what you can get away with on modern machines.

As always, if you've got remarks or suggestions, don't hesitate to send me an email at: kite AT this domain name (sorry about the obfuscated email, I haven't setup the antispam yet)
