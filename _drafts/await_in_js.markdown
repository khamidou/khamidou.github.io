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

And it gets compiled to that:
{% highlight javascript %}
$.get("/login", {success: function(status) { 
                                if (status.success) {
                                    // whatever 
                                }
                }, error: function(status) { 
                                if (status.success) {
                                    // whatever 
                                }
                }});
{% endhighlight %}

To me, it's a net win in terms of readability. I've always felt callbacks are an implementation detail and I'd rather have them swept under the rug. They're the reason why I've been reluctant to write anything more complex than toy servers with nodejs.

Last week I heard of [sweet.js](http://sweetjs.org/), a macro compiler for Javascript, so I decided to try to implement some sort of `await` functionality with macros.

# The basics of Sweet.js

Sweet.js lets you define _syntaxic sugar_, i.e, macros which get expanded at compile time.

A sweet.js macro is made of two parts, a matching expression and a replacement expression.
Let's begin with the simplest macro of all, a greet statement. This statement takes a string as an argument and replaces it with a `console.log`.

{% highlight javascript %}
macro greet {
  rule {
    /* this is the match part. We ask the sweetjs compiler to capture one token 
       between parentheses. */
    ($name:lit); /* name must be a literal type (i.e: a number or a string) */ 
  } => {
    /* replace everything with this text. */ 
    console.log("hello " + $name);
  }
}

greet('Paul'); // output: 'console.log('hello ' + 'Paul');'
{% endhighlight %}

So, we've got a macro and it gets expanded at compile-time. However, because of the way we wrote it, it will trigger an error if we pass it more than one argument. Let's fix this.

# Handling multiple arguments

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



# Handling async AJAX calls 

Now, let's try to define a small macro to do simplify those messy jQuery ajax calls.

{% highlight javascript %}
macro await {
  rule {
    $method($x);
    $rest
    ...
  } => {
    // just return the token that is bound to `$x`
    $method($x, function() {
        $rest
        ...
    });
  }
}

await setTimeout(64);
console.log("hey");
await setTimeout(65);
console.log("ho");
{% endhighlight %}

This compiles to the following javascript:

{% highlight javascript %}
setTimeout(64, function () {
    console.log('hey');
    setTimeout(65, function () {
        console.log('ho');
    });
});
{% endhighlight %}

[^hygienic]: Hygienic macros are
 
