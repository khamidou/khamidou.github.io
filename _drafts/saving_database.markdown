---
layout: post
title: A quick guide on how to securely backup your webapp using tarsnap
---
So, you've written a webapp. It's nothing fancy; it's simply a Rails/Django app with a PostgreSQL backend. You managed to deploy it on a VPS server (barely), and you'd like to backup its database. 

In this post I'll show you to securely backup your data to [tarsnap](http://www.tarsnap.com/), a service made for storing securely data.

* Toc
{:toc}


<!-- more -->

## Backup policy

A note about backup policies. Companies seems to have pretty complex policies about backups - including how and when to restore them, which backups should go offsite and which should be rotated. For most small webapps this is overkill. I prefier to use the three rules of thumb below (you can call this my three laws of backups):

1. Make backups everyday.
2. Rotate backups, but keep at least one backup each month.
3. If you haven't restored it at least once, it's not a backup.

In this guide I'll how you how to do this with tarsnap. Tarsnap is an excellent service, for two reasons:
- first it's extermely inexpensive
- it handles deduplication

Tarsnap presentation. setup and usage. https://www.tarsnap.com/usage.html

The only annoying thing about tarsnap is you have to compile it from source. Luckily some people have written install scripts for [debian](https://gist.github.com/mdigital/2410727) and [RHEL](https://gist.github.com/dhensby/6371274).
## Getting the data out of Postgres

## Uploading the data

## Restoring the backup
