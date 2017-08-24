---
layout: post
title: "Beware of proxy metrics!"
featured: true
---
Palantir is well known for its grueling interview process. It’s pretty common for new applicants to go through a dozen(!) interviews.[^itw]

I don’t think anyone made a conscious decision to have things this way – nobody called a Monday morning meeting to make their hiring process horrible.

Instead, they probably started with a sensible interview process[^otherwise], which slowly evolved over time.

I have an armchair theory about this. When you’re a big, successful company like Palantir, you get a lot of people interested in working with you. Most of them aren’t good fits, so your goal is to zero in on the ones who are.

In this case, it can be very tempting to define a single proxy metric to track the process. After all, if you can get all the stakeholders to agree on a single metric, they could just optimize the damn thing and make everybody happy.

But, here’s the issue. Unlike regular metrics (e.g: monthly revenue, 90th percentile API latency), proxy metrics only measure what you think the problem is, so whatever you end up optimizing will end up landing you inside a local maximum.

Voilà, you have a recipe for ending up with a broken process! So, next time you think about optimizing a process, take and step back and make sure you’re not looking at a proxy metric.

[^itw]: (Note: I’m not singling out Palantir here - they just happened to be at the top of [/r/cscareerquestions](https://www.reddit.com/r/cscareerquestions) today. Other tech companies are also well known for their drawn-out, or sometimes plain ridiculous hiring processes.)

[^otherwise]: otherwise they wouldn’t be where they are today
