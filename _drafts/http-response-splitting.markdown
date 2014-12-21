---
layout: post
title: HTTP response-splitting attacks and when to worry about them
category: software
---
HTTP is a fun protocol but sometimes it makes me wonder. This week I learned about a fun flaw, response-splitting. It's probably not news for everybody, but let me try to explain it.

## What is it?

I've got a theory: most security flaws occur because of [leaky abstractions](http://www.joelonsoftware.com/articles/LeakyAbstractions.html).

- __Buffer overflows:__ you are getting a string but you've got to handle its length yourself.
- __XSS attacks:__.

HTTP response splitting is one of those. 



Let's say you're running a custom-coded forum. It has a members-only section which requires people to authentify themselves. The usual way to go about this is to have a login page which then redirects people to the page they wanted to go in the first place.

{% highlight http %}
GET /login?redirect=/my-protected-page.php\r\n
Accept: text/html\r\n
Accept-Language: en-us\r\n
Accept-Encoding: gzip, deflate\r\n
Connection: keep-alive\r\n
{% endhighlight %}

This is a pretty standard request. First the verb, followed by the url and a bunch of headers, separated by `\r\n`.

Because this is a quirky, homemade php app, the server doesn't issue a 301 redirect but instead returns an HTML page which contains a `<META REFRESH>` to do the actual redirection[^cargo-cult]:

{% highlight http %}
HTTP/1.1 200 OK
Date: Sun, 21 Dec 2014 12:25:40 GMT
Content-Encoding: gzip
Content-Length: 2603
Keep-Alive: timeout=5, max=100
Connection: Keep-Alive
Content-Type: text/html
<html>
    <head>
        <meta http-equiv="refresh"
              content="0; url=http://my-web-site/my-protected-page"></meta>
    </head>
    <body>You should be redirected quickly?</body>
</html>
{% endhighlight %}

Let's also suppose that you're only doing basic validation of the url (i.e: checking that the URL is not pointing to an external website but not much more[^example]). What could an attacker do? Among other things, she could try to pass the `\r\n` character sequence in the string and see if it throws your website in a loop. As you probably know, `\r\n` is the

An attacker could pass the following string to your server:
{% highlight http %}
GET /q?=boat%20shoes\r\nAccept-
Accept: text/html\r\n
{% endhighlight %}

[^cargo-cult]: I often see this on older sites. I suppose it's another one of those UI "best-practices" from the turn of the century.
[^example]: This is an example after all.
