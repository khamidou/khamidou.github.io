---
layout: post
title: Designing an email threading algorithm
featured: true
---
Building an email client is a lot of work. You have to wrestle with incompatible implementations of IMAP and SMTP[^incompatible], work around the horrors of MIME and also carve out some time to build something people will love.

I work on the backend for the [N1 mail client](https://nylas.com/N1) so I spend a lot of more time worrying about IMAP than about the client UI. Sometimes though I get to work on user-facing features like our email threading code.

# A primer on emails

Back in the early 90s, when the web was new, Jamie Zawinski wrote an awesome threading algorithm for Netscape Mail.

[^python]: Relatively low-level. The whole system is written in Python and uses SQLAlchemy. 
[^incompatible]: Incompatible is maybe too strong of a word. If I had to explain it this way, I'd say that Gmail is an elderly gentleman, Yahoo has seen better days and Exchange is this guy on a totally different plane.
[^scaling]: This threading algorithm was changed some time ago to drop some weight while we were in "full scaling" mode. I still think it stands on its own, though.
