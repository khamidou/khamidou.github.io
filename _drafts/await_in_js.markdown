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

To me, it's a net win in terms of readability because I've never really liked callback. I feel like they're an implementation detail and I'd rather have swept under the rug. They're the reason why I've been reluctant to write anything more complex than toy servers with nodejs.

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

1. First you can see sweet has a little more syntax than the C preprocessor. A macro is defined inside a `macro` block. Inside this bloc you can have several rules of the form { pattern } { replacement }.

2. The rules for matching macros are similar to regexps. The block `($name:lit)` means: match litteral between two parentheses and assign it to the variable `$name`.

3. The replacement block contains the replacement text and can optionally call javascript code.

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
 
