---
layout: post
title: Writing semantic HTML with the Zurb Foundation grid
date: August 22, 2012
---

I've recently started to use the excellent [Zurb
Foundation](http://foundation.zurb.com/) CSS framework, and I like it a lot. There's
one problem though: like most grid frameworks, it expects you to use non-semantic class names in your HTML to specify the placement of the elements.
<!-- more -->
    <div class="row">
        <div class="two columns" id="navbar">
        </div>
        <div class="ten columns" id="content">
        </div>
    </div>

Thankfully, if you use Sass, there's an easy way to drop those non-semantic
class names. The Sass language has a new directive, @extend, which allows a block to integrate the contents of another one. 
Using extend, it's possible to rewrite the previous example as this :

    <div class="row">
        <div id="navbar">
        </div>
        <div id="content">
        </div>
    </div>

The SCSS file looks like this:
    #navbar {
        @extend .two, .columns;
    }

    #content {
        @extend .ten, .columns;
    }

The code is now slightly simpler.
