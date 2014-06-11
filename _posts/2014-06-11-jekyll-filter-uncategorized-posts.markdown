---
layout: post
title: Filtering uncategorized posts with Jekyll
category: programming
---
I'm using [Jekyll](http://jekyllrb.com/) to generate this blog. It's pretty cool once you get the hang of it.
Yesterday I had a problem stackoverflow couldn't solve: I wanted to filter my blog posts to keep only the ones who weren't categorized.

I had to write a really simple plugin to do this. Here it is:

{% highlight ruby %}
module Jekyll
  module UncategorizedFilter
    # Returns back all categories related to a primary category
    # e.g. "blog" or "questions"
    def filter_categorized_posts(posts)
      filtered = []
      for post in posts
        if post.categories == []
          filtered.push(post)
        end
      end
      return filtered
    end
  end
end

Liquid::Template.register_filter(Jekyll::UncategorizedFilter)
{% endhighlight %}

To use this plugin, save the code in a folder called \_plugins in your jekyll directory.
Here's how to use it from a template:

{% highlight html %}
{% raw %}
{% assign uncategorized_posts = site.posts | filter_categorized_posts %}
{% for post in uncategorized_posts %}
        <li>
            <a href="{{site.baseurl}}{{ post.url }}">{{ post.title }}</a>
        </li>
{% endfor %}
{% endraw %}
{% endhighlight %} 

Hope this helps.
