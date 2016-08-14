---
layout: post
title: "A chatbot which replies to spammers"
featured: true
---
Before the Internet, you couldn't afford to flood every email address with billions of viagra ads. It just wasn't possible. Unfortunately, the Internet brought the cost of producing and sending a message close to zero, making it possible to run [old scams](http://query.nytimes.com/mem/archive-free/pdf?res=980CE5D71638E433A25753C2A9659C94699ED7CF) at a huge scale.

Over the years we're tried a number of things to make spam more expensive to send, for example by requiring SMTP servers to use [arcane](http://www.dkim.org/) [protocols](https://www.spamhaus.org/sbl/) to prove their identity. This is unfortunately a game of cat and mouse.

Right now, the job of a spammer is simple: send 10k emails a day and wait for the replies from a couple marks[^conversion]. What if we made this harder for them, by wasting their time?

I happen to have some expertise in the domain --- I created [Chad](http://chadbot.co), a chatbot to get excused from meetings, mostly as a joke.
Chad is a pretty simple Python program which replies automatically to incoming email. I've seeded its replies database with a replies appropriates for spammer and set it loose on my spam folder.

The results so far have been pretty interesting:

[^conversion]: According to [a 2013 study](http://www.icir.org/christian/spamalytics/), Spam emails have a conversion rate of 1 in 12,500,000.
