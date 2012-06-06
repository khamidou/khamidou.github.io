---
layout: post
title: Writing a django filter
---

### {{ page.title }}

p(meta). 27 May 2012

I recently had to implement a django filter. My problem was that I had an event page similar to the github feed. I wanted to format a date diferently whether the event occured in the current week or at another date. Instead of doing it in code or in the template (bad), I decided to write a filter for that. 

### Directory structure

Django expects to find the filters and template tag for an application in a specific directory, _templatetags_. 
You'll have to create this directory if it doesn't already exist and to add inside it an empty \_\_init\_\_.py file so that python treats the folder as a module.

### Code

After that, create a file named "filters.py". It will hold our new filter. Add the following code in it.


    from django import template
    from django.contrib.sites.models import Site
    from urlparse import urlparse
    import datetime

    register = template.Library()

    @register.filter(name='dayinweek', is_safe=True, expects_localtime=True)
    def dayincurrentweek(day):
        if day == datetime.date.today():
            return "Today"

        min_date = datetime.date.today() - datetime.timedelta(7)
        if day > min_date and day < datetime.date.today():
            return day.strftime("Last %A")
        else:
            return day.strftime("%B, %d")

It's quite simple: we get a handle on the django template filter registry, and we register a template named dayinweek.
This template takes a datetime.date parameter and returns a string.

### Usage

To reference the filter in your template file you need to add  `{{ "{% load filters" }} %}` at the beginning of your template file.
