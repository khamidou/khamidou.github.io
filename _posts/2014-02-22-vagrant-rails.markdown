---
layout: post
title: vagrant-rails
category: tips
---

I'm learning rails at the moment. Coming from python, the ruby community seems markedly different. One thing doesn't change, though: package managers suck. I was so confused by rbenv, rvm, bundler and gems that I thought it'd be safer to install it in a virtual machine. 

Since it didn't want to waste my time poking in the dark, I wrote a small tool to do this: [vagrant-rails](https://github.com/khamidou/vagrant-rails). It's a set of shell scripts to setup a vagrant box with a recent ruby and the latest stable rails version.

<!-- more -->

Also, it's always interesting to see a different way of solving problems. From my totally newbie point of view, it looks like rails is a lot more integrated than django. For instance, you've got to have a javascript runtime to run rails, because of the asset pipeline. This is disconcerting and refreshing at the same time. 

Good defaults free you to think about things that matter, but at the same time the C programmer in me worries about the "bloat". But I guess Rails tries to optimize programmer productivity, not disk space or performance.
