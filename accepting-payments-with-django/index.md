---
layout: guide
title: The bare minimum you need to know about accepting payments with Django
---

<br>
I've implemented payments processing for a consulting client. Here are my notes in the hope it saves some time for someone.

## Table of Contents
<br>
* Toc
{:toc}

<br>


## Payment processors, gateways, Stripe and the rest

Paying on the Internet is very similar to using your credit card at a point-of-sale terminal. In both cases the seller (the **merchant**) is not the one who debits your bank account. This is the job of the **payment gateway**.

Most payment gateways (Authorize.net, PayBox, etc.) will deposit the money in a temporary account called a **merchant account**. Others (Stripe, PayPal, Gumroad) will deposit directly the money in your account[^aggregate_account].

The advantage of having a dedicated merchant account is that it's easier to negotiate a specific rate. But except if you have a high transaction volume, it's simpler to start with an easy to setup solution like Stripe or Paypal.

### What you need to know about PCI compliance

The *PCI Security Standards Council* is an organization whose goal is to define security standards for handling credit cards on the Internet. If you want to accept credit cards, you'll have to deal with them, one day or another.

Thankfully, since most of the time you're simply going to integrate with a vendor, you won't have an extremely long checklist of things to worry about.[^vendor]

I read the [official docs on the subject](https://www.pcisecuritystandards.org/documents/PCI%20SSC%20Quick%20Reference%20Guide.pdf). Here's what I think are the highlights. 

|---
|Requirement category|Translation
|-|-
|__Build and maintain a secure network__ | Use a firewall on your server network and on your dev machines.
|                                        | Change the defaults passwords (DUH)
|                                        | Always use HTTPS for administrative access
|__Protect Cardholder data__             | Don't store cardholder data. Actually you can store this data, but the security requirements and paperwork make this not worth it.
|__Encrypt ransmission of cardholder data across open, public networks__ | Use HTTPS   | 
|__Develop and maintain secure systems and applications__ | Maintain the systems up-to-date |
|                                                         | Stay informed of the latest security vulnerabilities. Subscribing to the [Django blog](https://www.djangoproject.com/weblog/) and the [Ubuntu Security notices](http://www.ubuntu.com/usn/) is a good start.
|                                                         | Develop code secure code (DUH) and do code reviews and at least one annual audit. 
|__Restrict access to cardholder data by business need-to-know__ | Self-explaining |
|__Assign a unique ID to each person with computer access__ | Have an audit-trail: specific accounts for each user, two-factor auth and VPNs if possible, hash passwords
|__Restrict physical access to cardholder data__ | You shouldn't store card-holder data
|__Track and monitor all access to network resources and cardholder data__|
|===

## Accepting payments with Django

You've probably come to this page after having seen the tons of different packages on Django packages. There's a lot, but among those, only django-payments and ... seem to provide decent support for multiple providers.


## Implementing payments using django-payments

lkmkmlk

## Implementing the payment form

There's a lot of usability concerns to be aware of when implementing payments.

# Checklist

mlkmlk

# Comments, remarks, complaints

You can contact me at karim @ this site's domain. I try to reply to every email I receive.

[^aggregate_account]: This is not entirely true. Payment processors like Stripe and PayPal still have a merchant account, but it's shared among all the merchants. Because of this, it takes a lot less paperwork to accept money using them than with something like Authorize.net.

[^vendor]: at least compared to a vendor. They have a specific set of requirements called PCI PA-DSS.
