---
layout: post
title: Kite status report 4 - Om nom cookies!
---

I spent most of last week working on implementing auth. I knew it'd be painful, but I didn't thought it'd be that painful. There's so much implementation details to know about, I'm not even sure I've designed something secure even after spending hours on it.

This post is a way to clarify my thoughts on authentication. Sorry if it's a little dense and hard to follow!

### Traditional auth

Do you remember when most code ran on the server and Javascript was used to pepper some interactivity on the page? I miss these times. Back then, this is how things worked:
 
![How things used to work](/images/cookies/oldflow.png)

In this scenario, you had three things to care about:

1. Cookie theft. To prevent an attacker to impersonate an existing user, you would have to make all requests over HTTPS and set all your cookies as "Secure" (the browser sends secures cookies only when it's connecting over SSL).
2. [Cross Site Request Forgery](http://blog.codinghorror.com/cross-site-request-forgeries-and-you/). This means checking on all non-GET requests that it originated from one of your pages.
3. [Session fixation](https://www.owasp.org/index.php/Session_fixation). This was solved mostly by using cookies instead of passing a session ID parameter to every page.

Traditional auth is mostly a solved problem.

### Client-side apps

We've moved on to making apps on the client. For most people this means your app is mostly javascript communicating using JSON with a REST-like backend. Sadly, the protocol haven't changed, which means there's an increased attack surface. Additionally to the flaws above, here's what it's necessary to look for:

- [Json vulnerability](http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/). This one is pretty complex. In a few words, an attacker could insert a call to your JSON api in a page and steal data from authentified users. What most apps do in this case is adding nonsensical string at the beginning of the JSON to trigger a syntax error.
- API Cross Site Request Forgery. Really, it's the same problem as form-based CSRF except it occurs over AJAX calls. Thankfully, AngularJS (the client framework I use) has a solution for this. If you set a cookie named XSRF-TOKEN, Angular will add to each AJAX request a custom header "X-XSRF-TOKEN" which contains the same value as your cookie. 

    The reasoning is that if the call originated from a malicious website it would not have the custom header because of the same-origin policy.

### How Kite does authentication

Because I wanted something simple, I just adapted the traditional auth flow.

![Kite auth flow](/images/cookies/kiteflow.png)

There's one thing I'm unsure about:

The auth cookie is simply a base64-encoded random number. It's only an identifier for a server-side session. As such, is it necessary to sign it to prevent tampering? [It seems it's okay to go without using a MAC, if the token is large enough](http://cookies.lcs.mit.edu/pubs/webauth:sec10.pdf) (see section 4.4). Anyway, using a MAC isn't expensive, so I'll probably add it sometimes later.

__Key takeaway:__ Use HTTPS. Sign your cookies. 


