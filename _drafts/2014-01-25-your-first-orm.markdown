---
layout: post
title: Your First ORM
---
Object-Relational mappers are something we take for granted today. They're pretty easy to use and work most of the time. However, it's important to know how they work for the one time where they won't work anymore.

In this article, I'm going to show you how to implement a tiny ORM.

<!-- more -->
I'm going to do this in Javascript, but the principles are the same in Ruby or Python, except they use more metaprogramming.
At the simplest level, an ORM maps the fields of an object to elements in a database. Let's say you have a Person Javascript object that you'd like to save in a database:

{% highlight javascript %}
var person = {
    name: "Michel",
    age: 45,
};
{% endhighlight %}

However, the SQL databases we tend to use are pretty picky about the data we want to enter in it. First, it needs to know the name of the table to store the object. Since there's know way to guess it directly, we'll ask the programmer to specify it. We also need the programmer to define the types of the columns in the table, like this:

{% highlight javascript %}
var person = new TinyORM.Object("person", {
    name: TinyORM.String,
    age: TinyORM.Integer,
});
{% endhighlight %}

Let's define this constructor:
{% highlight javascript %}
TinyORM = {String: "string",       // Declaring the object like this is totally not kosher,
           Integer: "integer"};    // but this is a tutorial. It's poetic license.
                              

TinyORM.Object = function(tableName, properties) {
    // save the properties for later use.
    this.ptys = {};
    this.tableName = tableName;
    for(property in properties) {
        this.ptys[property] = properties[property];    
    }     
};
{% endhighlight %}

You'll notice that we pass the name of the table to the constructor. In most modern ORMs, like ActiveRecord or the Django ORM, the name of the table is inferred from the class name.

Now, let's think about how to generate the layout of the sql table to store our data into. 
We've got a list of the fields in our table, and we've got their type. From this it's pretty easy to create our table creation statement: 

{% highlight javascript %}
TinyORM.Object.prototype.schema = function() {
    var ret = "CREATE TABLE " + this.tableName + " ("; // once again, you should never do this
                                                       // in the real world. Strings are immutable
                                                       // in Javascript, which means that everytime
                                                       // you '+' two strings together you actually
                                                       // create a new copy.
    
    first = true;
    for(field in this.ptys) {
        if(first == true) {
            first = false;
        } else {
            ret += ", ";
        }
        
        switch(this.ptys[field]) {
            case TinyORM.String:
                ret += field + " VARCHAR(255)";
                break;
                
            case TinyORM.Integer:
                ret += field + " INTEGER";
        }
    }
    
    ret += ");"
    return ret;
};

{% endhighlight %}

If we try it on our person model, we get:

{% highlight javascript %}
>> person.schema()
"CREATE TABLE persons (name VARCHAR(255), age INTEGER);"
{% endhighlight %}

Now let's think about how to store data into the database.
