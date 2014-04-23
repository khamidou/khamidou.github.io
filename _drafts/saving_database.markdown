---
layout: post
title: How to backup your webapp using tarsnap
---
So, you've written a webapp. Nothing fancy; simply a Rails/Django app with a PostgreSQL backend. You've managed to deploy it on a VPS server (barely), and you'd like to backup its database. 

Here's how to do it securely with [tarsnap](http://www.tarsnap.com/). Tarsnap is a backup solution developed by Colin Percival[^colin]. It's used by companies like Stripe, so it's probably good enough for most people.

* Toc
{:toc}


<!-- more -->

## What's in a good backup?

A lot of companies have pretty complex backup policies: how and when to restore them, which backups should go offsite and which should be rotated. For most small webapps this is overkill. I prefier to use the three rules of thumb below (you can call this my three laws of backups):

1. Make backups everyday.
2. Rotate backups, but keep at least one backup each month.
3. If you haven't restored it at least once, it's not a backup.

## Setting up tarsnap

The only annoying thing about tarsnap is you have to compile it from source. Luckily some people have written install scripts for [debian](https://gist.github.com/mdigital/2410727) and [RHEL](https://gist.github.com/dhensby/6371274).

## Getting the data out of Postgres

## Uploading the data

## Restoring the data

[^colin]: Colin was, among other things, ex-Chief Security Officer for FreeBSD and is the inventor of scrypt.
