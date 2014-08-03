---
layout: guide
title: The bare minimum you need to know about accepting payments with Django
---

<br>
I've implementing payments processing for a project of mine. Here are my notes in the hope it saves some time to someone else.

# Table of Contents

* Toc
{:toc}

<br>


# Payment processors, gateways, Stripe and the rest

Paying on the Internet is very similar to using your credit card at a point-of-sale terminal. In both cases the seller (the **merchant**) is not the one who debits your bank account. This is the job of the **payment gateway**.

The payment gateways takes the money from your account and deposits it in a *merchant account*. Most payment gateways (Authorize.net, PayBox, etc.) will deposit the money in a temporary account called a **merchant account**. Others (Stripe, PayPal, Gumroad) will deposit directly the money in your account[^aggregate_account].

The advantage of having a dedicated merchant account is that it's easier to negotiate a specific rate. But except if you have a high volume, it's simpler to start with an easy to setup solution like Stripe or Paypal.

### What you need to know about PCI compliance

PCI 

# How it works

lkjlkj


# Implementing payments using django-payments

lkmkmlk


# Checklist

mlkmlk

# Comments, remarks, complaints

You can contact me at karim @ this site's address. I try to reply to every email I receive.

[^aggregate_account]: This is not entirely true. Payment processors like Stripe and PayPal still have a merchant account, but it's shared among all the merchants. Because of this, it takes a lot less paperwork to accept money using them than with something like Authorize.net.
