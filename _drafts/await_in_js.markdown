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
$.get("/login", {success: function(data) { 
                                // whatever 
                }});
{% endhighlight %}

To me, it's a net win in terms of readability. Callbacks are the reason why I've been reluctant to try nodejs and I was stoked to see it would be possible to do something like this using macros.

# The basics of Sweet.js

Sweet.js is a mozilla project whose goal is to add hygienic macros [^hygienic] to Javascript. In short, it lets you define macros which get expanded at compile time.

{% highlight javascript %}
macro hello {

}
{% endhighlight %}

Now we've seen this, let's see how to implement a C#-like await in Javascript.

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

[^css_box_model]: I'm thinking of you, IE CSS box model.
[^hygienic]: Hygienic macros are
 
