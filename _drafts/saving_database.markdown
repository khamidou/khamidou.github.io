---
layout: post
title: A simple backup framework.
---

Yes, framework, you read that correctly. The problem of backup systems is they're systems. They're rigid, closed, uptight. They don't understand my complex domain logic like "Drop movies except the Game Of Thrones ones" or "Don't save wav files except if those are band rehearsals". 

## The system

My requirements for this are simple:

1. it must be totally hands-off
2. it must be happen everyday
3. it must be secure

Based on good reviews, I chose tarsnap, a backup system developed by Colin Percival[^colin].

## Usage


[^colin]: Colin was, among other things, ex-Chief Security Officer for FreeBSD and is the inventor of scrypt.
