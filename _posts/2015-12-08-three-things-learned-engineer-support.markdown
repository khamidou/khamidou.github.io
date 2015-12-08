---
layout: post
title: 3 Things I Learned as an Engineer Doing Customer Support
featured: true
---

I work at [Nylas](https://nylas.com/) as an engineer on the API team. We're still pretty small, so engineers in my team also have to handle customer support.

It's a very good thing because customers get to talk directly to the person who wrote the API they're using. However, engineers often aren't trained as customer success people and may be a bit gruff[^gruff].

<br />

### 1. Customer support is about people (I know, I know.)

One thing I've noticed is that many engineers come to customer support with a problem-oriented mindset. It's very easy to start thinking of your support queue as a list of problems to solve instead of as a list of *customers* having *problems*. This is also a great way to make your customer feel like another email on the way to Inbox zero (i.e: not much).

So, before jumping into troubleshooting mode, get back to your customers. Sending a simple "I'm sorry you're having this problem! We're looking into it" goes a long way.[^handling-emails]

### 2. Follow up follow up follow up

Solving problems is good --- following up when things take time is better. Is there a bug on your side that will take more than two days to solve? Send an update email. Is a release getting delayed because something unexpected came up? Update your customers. You get the gist --- it's generally better to overcommunicate than to solve problems silently.

### 3. Try to not ask too many questions

You'll often get emails like "Your API isn't working. I'm getting an error 500". Your natural inclination would be to ask back what exactly isn't working. Instead, take 5 minutes to dig through your logs. It's very possible that you'll find what's the actual problem without having to ask your customer, which will make you look like an über support engineer.

[^gruff]:  (I know I was!).
[^handling-emails]: Here's how I try to handle support request.
1. Get a support message
2. Reply ASAP with something simple like "We're looking interactto this and will keep you posted."
3. Either solve their problems or keep them in the loop.
