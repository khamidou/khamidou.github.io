---
layout: post
title: Writing semantic HTML with the Zurb Foundation grid
---

### {{ page.title }}

<p class="meta">August 22, 2012</p>

I've recently started to use the excellent [Zurb
Foundation](http://foundation.zurb.com/) CSS framework, and I like it a lot. There's
one problem though: like most grid frameworks, it expects you to use non-semantic class names in your HTML to specify the placement of the elements.
    <div class="row">
        <div class="two columns" id="navbar">
        </div>
        <div class="ten columns" id="content">
        </div>
    </div>

Thankfully, if you use Sass, there's an easy way to drop those non-semantic
class names. The Sass language has a new 
