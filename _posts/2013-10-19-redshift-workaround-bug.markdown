---
layout: post
title: Working around redshift's "Provider does not have a valid location available." error
date: Oct 19, 2013
---
I recently tried [redshift](http://jonls.dk/redshift/), a program to adjust the screen temperature (the proportion of red and blues) according to the hour of the day.

However, I was bitten by a small bug on the old version of Ubuntu I was using : Redshift would fail to start and complain that it couldn't find my location. 

<!-- more -->

Thankfully, it's possible to pass redshift the latitude and longitude directly :

{% highlight bash %}
   redshift -l 33:-96 
{% endhighlight %}

You can find your latitude and longitude using google maps, or [this tool](http://universimmedia.pagesperso-orange.fr/geo/loc.htm).
