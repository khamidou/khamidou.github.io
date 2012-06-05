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

