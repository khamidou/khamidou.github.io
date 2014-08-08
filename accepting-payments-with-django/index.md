---
layout: guide
title: The bare minimum you need to know about accepting payments with Django
---

<br>
I'm implementing payments processing for a project of mine. Here are my notes in the hope it saves some time for someone else.

# Table of Contents

* Toc
{:toc}

<br>


# Payment processors, gateways, Stripe and the rest

Paying on the Internet is very similar to using your credit card at a point-of-sale terminal. In both cases the seller (the **merchant**) is not the one who debits your bank account. This is the job of the **payment gateway**.

Most payment gateways (Authorize.net, PayBox, etc.) will deposit the money in a temporary account called a **merchant account**. Others (Stripe, PayPal, Gumroad) will deposit directly the money in your account[^aggregate_account].

The advantage of having a dedicated merchant account is that it's easier to negotiate a specific rate. But except if you have a high volume, it's simpler to start with an easy to setup solution like Stripe or Paypal.

## What you need to know about PCI compliance

The *PCI Security Standards Council* is an organization whose goal is to define security standards for handling credit cards on the Internet. If you want to accept credit cards, you'll have to deal with them, one day or another.

Thankfully, since most of the time you're simply going to integrate with a vendor, you won't have an extremely long checklist of things to worry about.[^vendor]

Here's some of the things you need to check for:

|---
|Category|Requirements
|-|-
|Network security|Using a firewall
|                |Having an auditing process
|                |Having a security policy
|Hey|Lol
|===

1. Do you use SSL?
2. Do you store the credit card numbers?

# Accepting payments with Django

You've probably come to this page after having seen the tons of different packages on Django packages. There's a lot, but among those, only django-payments and ... seem to provide decent support for multiple providers.


# Implementing payments using django-payments

lkmkmlk

# Things to be aware of


# Checklist

mlkmlk

# Comments, remarks, complaints

You can contact me at karim @ this site's address. I try to reply to every email I receive.

[^aggregate_account]: This is not entirely true. Payment processors like Stripe and PayPal still have a merchant account, but it's shared among all the merchants. Because of this, it takes a lot less paperwork to accept money using them than with something like Authorize.net.

[^vendor]: at least compared to a vendor. They have a specific set of requirements called PCI PA-DSS.
