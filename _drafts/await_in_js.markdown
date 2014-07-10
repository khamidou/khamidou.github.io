---
layout: post
title: Implementing async/await in javascript with Sweet.js
categories: programming
---
Ever since I went back to Javascript, I've been missing C#'s async/await system.
With C# you can mark some methods `async`. Afterwards, you can call them "synchronously" using the `await` keyword. Behind the scenes, the compiler rewrites the code to use callbacks.

For example, C# lets you write something like this: 
{% highlight javascript %}
var status = await $.get("/login"); // await returns a status object.
if (status.success) {
    // whatever
}
{% endhighlight %}

And it gets compiled to this:
{% highlight javascript %}
$.get("/login").done(function(status) { 
                                if (status.success) {
                                    // whatever 
                                }
                }).fail(function(status) { 
                                if (status.success) {
                                    // whatever 
                                }
                });
{% endhighlight %}

To me, it's a net win in terms of readability because I've never really liked callbacks. They're an implementation detail and I'd rather have them swept under the rug.

Last week I heard of [sweet.js](http://sweetjs.org/), a macro compiler for Javascript, so I decided to try to implement some sort of `await` functionality with macros.

# The basics of Sweet.js

Sweet.js lets you define _syntaxic sugar_, i.e, macros which get expanded at compile time.

A sweet.js macro has two parts, a matching expression and a replacement expression.

Let's go back to C macros because sweet's macros will be easier to understand this way. In C, a macro is a statement which defines an expression and a replacement for this expression. During the compilation, the macro is expanded by the preprocessor.

Here's the simplest macro of all, a greet function.
{% highlight c %}
#define greet(name) printf("hello #name")
{% endhighlight %}
 
And here's the equivalent sweetjs macro:
{% highlight javascript %}
macro greet {
  rule {
    ($name:lit)
  } => {
    /* replace everything with this text. */ 
    console.log("hello " + $name);
  }
}

greet('Paul'); // output: 'console.log('hello ' + 'Paul');'
{% endhighlight %}

There's several important things.

1. First you can see sweet has a little more syntax than the C preprocessor. A macro is defined inside a `macro` block. Inside this block you can have several rules of the form `{ pattern } { replacement }`.

2. The rules for matching macros are similar to regexps. The block `($name:lit)` means: "match one litteral between two parentheses and assign it to the variable `$name`".

3. The replacement block contains the replacement text and can optionally call javascript code.

So, we've got a macro and it gets expanded at compile-time. However, because of the way we wrote it, it will trigger an error if we pass it more than one argument. Let's fix this.

# Handling multiple parameters

Sweetjs has a specific syntax for defining variadic macros: a `...` will match any token similar to the previous match:

{% highlight javascript %}
macro greet {
  rule {
    ($name:lit (,) ...) // "(,)" means don't capture commas.
  } => { console.log("hello ", $name (,) ...)}
}

greet('Paul', 'Ringo', 'George');
// output: console.log('hello ', 'Paul', 'Ringo', 'George');
{% endhighlight %}

Again, here are some important changes:

1. We don't want to match commas, so ask the compiler to ignore them by using `(,)`.
2. The '...' statement. It means "match one or more token of the previous matched". The tokens matched are exposed in the replacement rule as `...`.

Now, let's try to define a small macro to do simplify those messy jQuery ajax calls.

# Handling async AJAX calls 

The jQuery guys, knowing how painful it is to use callbacks, have defined a promise interface. It allows us to chain calls in a pseudo-procedural type:

{% highlight javascript %}
    $.get({"/api.json"})
        .done(function(data) { }) 
        .fail(function(error) { });
{% endhighlight %}

I still find this too annoying. Let's simplify things with this macro:

{% highlight javascript %}
let var = macro {
  rule {
    $result = await $.get($x);
    $rest
    ...
  } => {
    var $result = $.get($x).done(function($result) {
        $rest
        ...
    }).fail(function($result) {
        $rest
        ...
    });
  }
}

var result = await $.get({url: "http://google.com"});
console.log(result);
{% endhighlight %}

This compiles to the following javascript:

{% highlight javascript %}
var result$511[^hygienic] = $.get({ url: 'http://google.com' }).done(function (result$512) {
        console.log(result$512);
    }).fail(function (result$513) {
        console.log(result$513);
    });
{% endhighlight %}

There's only two major changes between the `greet` macro and this one:

1. We're using variadic parameters to capture every token after the macro.
2. We're redefining `var` as a macro. This lets us expands constructs like `var result = await $.get`. To get more specific, we're redefining `var` as an anonymous macro because we don't want sweet to try to expand every `var` inside the macro.

By the way, do you wonder where these weird `result$511` and al come from? It's because sweet macros are _hygienic_: when they get expanded, identifiers are renamed to prevent name clashes.
