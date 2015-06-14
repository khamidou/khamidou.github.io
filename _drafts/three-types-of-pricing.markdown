---
layout: post
title: How I chose a pricing scheme for my SaaS app
featured: true
---
I'm working on a tiny, tiny SaaS app, [Bugblur](https://bugblur.com). It's an app that watches and summarizes [CVEs](https://en.wikipedia.org/wiki/Common_Vulnerabilities_and_Exposures) so you don't have to. I'm building Bugblur because I need it, and also to learn about the dark arts of marketing[^plans].

I was unsure about the right plans and pricing to adopt, so I thought I'd look at how successful webapps price themselves.

The idea behind most pricing plans is that all your customers don't have the same needs, and some of them get a lot more value out of your product than the rest. A good pricing system allows you to charge those customers accordingly.

How do you go about this? There's a variety of approaches. The most common seems to be breaking your customers into different categories[^segmentation], and then mix and match this with the pricing scheme of your choice, which seem to be either feature pricing, seat pricing or volume pricing.

# Feature pricing

Feature pricing is the most popular pricing scheme, and probably the easiest for your customers to understand. The base idea is to unlock some features of your product only for certain plans. A good example of this is <a href="http://bidsketch.com">Bidsketch's</a> pricing table:

<img alt="bidsketch pricing" class="img-responsive" src="/images/saas_pricing/bidsketch.png" />

It's important to give a clear incentive for people to adopt a higher plan. The right incentive depends a lot of the type of service you're selling but the most common way seems to be capping a resource (file size, number of users, of gizmos, etc.). 

For Bidsketch, the capped resource is the number of users.

As an aside, I really like Bidsketch's pricing table because it's not very heavy on features --- the main difference betweens the plans is the maximum number of users. It's important because __you shouldn't feel compelled to add features to a plan just to make your pricing table look better[^something].__ 

# Seat pricing

Seat pricing consists in charging an app per-user. Of course, this is not for every app --- the usefulness of your app must scale with the number of users. One good example is slack[^slacks_sales_page].

<img alt="slack pricing" class="img-responsive" src="/images/saas_pricing/slack_pricing.png" />

Slack is priced per-user because the benefits a group chat system (obviously) increase with the number of people using[^contrarian]. Astute readers will have noted that slack are segmenting their customers too, with some of their enterprisey features[^compliance] only being available for the most expensive plans. 

# Volume pricing

The last type of pricing is volume pricing. It's a favorite of commodity providers like VPS vendors. Basically, you're charging your customers per number of goods sold, often while applying volume discounts.

You probably don't want to adopt this pricing model unless you're operating in a commoditized market.

# Implementing pricing

This is the pricing table I chose to go with:

<img alt="bugblur pricing" class="img-responsive" src="/images/saas_pricing/bugblur.png" />

Bugblur has two plans. The main differentiator is a cap on the number of alerts you can create. That's a not a strong proposition (yet!) because there's nothing preventing you from using the service with only a single alert (although it would be very annoying).[^annual_billing]

I'm also planning to add some features exclusively to the "Business" plan, notably integrations with Slack and HipChat, but that's only coming in the next few months.

There's two reasons I chose to go with two plans.

The first one is that I wanted to have a simple pricing structure. Bugblur is a very young product. I don't have enough feedback from customers to know in which direction to lead it. At this point, agonizing over the number of plans and features would be  premature optimization.

The second reason is that I value simplicity. I like the idea of having a basic and advanced plan. It just _feels_ better.

Anyway, I'm probably going to revisit this pricing scheme when I have better understanding of the product my customers want. We'll see how it turns out.


[^plans]: My goal it is to be able to run it on 30 minutes a day. I know it's ambitious, so we'll see how it turns out in a few months.

[^slacks_sales_page]:
    By the way, I really like the way slack's pricing page is structure. I especially like how they position themselves: <br><br> <img alt="slack pricing" class="img-responsive" src="/images/saas_pricing/slack_sales.png" />
    _A race to the bottom with clunky and cheap solutions_, _a product that just works_, _an investment in your team_.<br>
    Slack isn't another entrant in a commoditized market but a solution to change the way your company communicates.

[^segmentation]: Marketers call this segmentation. Basically, it's selling cramped airplane seats to families and slightly more spacious seats to Fortune 500 employees.

[^compliance]: like compliance.

[^something]: Something I felt the need to do, too.

[^annual_billing]: Note that I offer annual billing because it would be silly not to --- there's a lot of upsides (e.g: better cash flow) and virtually no downsides.
