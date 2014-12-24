---
layout: post
title: HTTP response-splitting attacks and when to worry about them
---
HTTP is a fun protocol but sometimes it makes me wonder. This week I learned about a fun flaw, response-splitting. It's probably not news for everybody, but let me try to explain it.

## What is it?

Everyone knows (or has learned the hard way) that you should never trust user input. The problem is, what kind of user input can you keep, and which part should you throw away?

Let's say you're running a custom-coded forum. It has a members-only section which requires people to authentify themselves. The usual way to go about this is to have a login page which then redirects people to the page they wanted to go to in the first place.

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
              content="0; url=http://my-web-site/my-protected-page.php"></meta>
    </head>
    <body>You should be redirected quickly?</body>
</html>
{% endhighlight %}

Let's also suppose that you're only doing basic validation of the url (i.e: checking that the URL is not pointing to an external website but not much more[^example]).

What could an attacker do?

Among other things, she could try to pass the `\r\n` character sequence in the string and see if it throws your website in a loop. Since `\r\n` is the field separator for the HTTP protocol, the browser would assume the HTML document was sent and happily accept the rest of the page as a separate HTML document. This is the splitting part of the code.

## What can it be used for?

Lots of nasty things.

[^cargo-cult]: I often see this on older sites. I suppose it's another one of those UI "best-practices" from the turn of the century.
[^example]: This is an example after all.
