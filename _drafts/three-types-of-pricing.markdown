---
layout: post
title: How I chose a pricing scheme for my SaaS app
featured: true
---
I'm working on tiny, tiny SaaS app, as a side project, [Bugblur](https://cveblur.com). It's an app that watches and summarizes [CVEs](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) so you don't have to. I was unsure about the right plans and pricing to adopt, so I thought I'd look at how successful webapps price themselves.

The idea at the heart of most pricing plans is that your customers don't all have the same needs, and some of them get a lot more value out of your product than the rest. A good pricing system allows you to charge those customers accordingly.

How do you go about this? There's a variety of approaches. The most common seems to be breaking your customers into different categories[^segmentation], and then mix and match this with the pricing scheme of your choice, which seem to be either seat pricing, feature pricing or volume pricing.

# 1. Seat pricing

Seat pricing consists in charging an app per-user. Of course, this is not for every app --- the usefulness of your app must scale with the number of users. One good example is slack[^slacks_sales_page].

<img alt="slack pricing" class="img-responsive" src="/images/saas_pricing/slack_pricing.png" />

Slack is priced per-user because the benefits a group chat system (obviously) increase with the number of people using[^contrarian]. Astute readers will have noted that slack are segmenting their customers too, with some of their enterprisey features[^compliance] only being available for the most expensive plans. 

# 2. Feature pricing

The base idea is to unlock some features of your product only for certain plans. It's probably the most popular pricing scheme. A good example of this is Basecamp's pricing table: 

<img alt="basecamp pricing" class="img-responsive" src="/images/saas_pricing/basecamp.png" />

This is probably the easiest type of plan to understand for your customers --- and the simplest to implement too. However, it's important to think a lot about your plans. You need to give a clear incentive for people to adopt a higher plan.

The right incentive depends a lot of the type of service you're selling but the most common way seems to be capping a resource (file size, number of users, etc.). One pricing scheme I really like is the one from <a href="http://bidsketch.com">Bidsketch</a>:

<img alt="bidsketch pricing" class="img-responsive" src="/images/saas_pricing/bidsketch.png" />

Here the capped resource is the number of users. I like this pricing scheme because it's not very heavy on features --- the main difference betweens the plans is the number of users. 

# 3. Volume pricing

The last type of pricing is volume pricing. It's a favorite of commodity providers like VPS vendors. 

It's probably a bad idea to adopt this pricing model unless you're operating in a commoditized market, for two reasons.
First, you're giving away the margin you are making on the service.  


[^plans]: My goal it is to be able to run it on 30 minutes a day. I know it's ambitious, so we'll see how it turns out in a few months.

[^slacks_sales_page]:
    By the way, I really like the way slack's pricing page is structure. I especially like how they position themselves: <br><br> <img alt="slack pricing" class="img-responsive" src="/images/saas_pricing/slack_sales.png" />

[^segmentation]: Marketers call this segmentation. Basically, it's selling cramped airplane seats to families and slightly more spacious seats to Fortune 500 employees.

[^contrarian]: However I wonder if there's not an upper limit to this. I guess we'll learn a few months down the hype cycle. I know I look forward to the flurry of startup blog posts explaining why "Slack doesn't scale".

[^compliance]: like compliance.

[^AMZ]: except (maybe) if you're amazon.
