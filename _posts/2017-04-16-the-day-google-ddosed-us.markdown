---
layout: post
title: The one where Google DDoSed us
featured: true
---
There's an interesting post about [rate-limiting](https://medium.com/figma-design/an-alternative-approach-to-rate-limiting-f8a06cf7c94c) making the rounds on social media. Reading it reminded me of the day where we got involuntarily DDoSed by Google.

If you have a Gmail account, the [Nylas API](https://nylas.com) uses the [Google Calendar API](https://developers.google.com/google-apps/calendar/overview) to sync your calendars and events. The Google calendar API is really well thought-out, and has one awesome feature: webhooks. The API lets you programatically register an URL to be pinged whenever the calendar is updated.[^know]

Webhooks are great because they let us stop needlessly polling the Google calendar API, while at the same time getting results way faster than before. Unfortunately, we made one tiny bugs when implementing the code that would subscribe to those webhooks.

Here's the code we used to subscribe to those webhooks (you can also find it on [GitHub](https://github.com/nylas/sync-engine/blob/b91b94b9a0033be4199006eb234d270779a04443/inbox/events/remote_sync.py)).

{% highlight python %}
def _refresh_gpush_subscriptions(self):
    with session_scope(self.namespace_id) as db_session:
        account = db_session.query(Account).get(self.account_id)

        if not self.provider.push_notifications_enabled(account):
            return

        if account.needs_new_calendar_list_watch():
            expir = self.provider.watch_calendar_list(account)
            if expir is not None:
                account.new_calendar_list_watch(expir)

        cals_to_update = (cal for cal in account.namespace.calendars
                          if cal.needs_new_watch())
        for cal in cals_to_update:
            try:
                expir = self.provider.watch_calendar(account, cal)
                if expir is not None:
                    cal.new_event_watch(expir)
            except HTTPError as exc:
                ...
{% endhighlight %}

We basically look if we need to register webhooks for the calendar list (`watch_calendar_list()`) and the calendars themselves (`cal.needs_new_watch()`). If it's the case, we subscribe to the webhooks.

And here's the method we use to check that a calendar needs to be watched:

{% highlight python %}
def needs_new_watch(self):
    ...
    return (
        self.gpush_expiration is None or
        self.gpush_expiration < datetime.utcnow()
    )
{% endhighlight %}

Aaaand this is where the bug lies! When watching calendars we'd never set an expiration date on them. That means, we'd subscribe to them, again and again, *thousands of times for each calendar*.

For a while, it worked because (I assume) Google had some sort of safety measure to prevent shooting yourself in the foot. One day though, they disabled it.

We woke up to thousands of requests per second coming from Google, with no way to disable them. We had to implement a hotfix in our rate-limiting code exclusively for the Google webhooks and fix the original bug by setting an expiration date for those webhooks. To this day, we're still receiving requests from those accounts.

**What can we take away from this?**

First, your rate-limiting logic is the last line of defense between your API and an outage. It's worth it to have it spend some time making sure the code is reliable and easy to extend. You'll need it the day where you have to deploy a hotfix to prevent a long outage.

Second, it's very hard to catch such a bug. A good rule of thumb though, is to always set an expiration date to any resource you request.

Until next time!

[^know]: You kind of know where it's going, right?
