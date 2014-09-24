---
layout: post
title: Overriding vagrant settings
categories: tips
---
This tip courtesy of my colleague [Dwayne Litzenberger](https://www.dlitz.net/blog/).

[Vagrant](http://www.vagrantup.com/) is a great tool. My only gripe with it is that it forces everyone to share the same vm settings, which can be painful, especially when you have a slow computer. There's a ~/.vagrant.d directory for specifying overrides but it's run _before_ `Vagrantfile`, which makes it useless to variables defined in `Vagrantfile`.

The cleanest way to do this is to add the following lines of code to the end of your `Vagrantfile`:

{% highlight ruby %}
# Local Vagrantfile overrides.
Dir.glob('Vagrantfile.local.d/*').sort.each do |path|
  load path
end
Dir.glob('Vagrantfile.local').sort.each do |path|
  load path
end
{% endhighlight %}

This code loads everything under Vagrantfile.local.d/ and `Vagrantfile.local`. My `Vagrantfile.local` contains for instance:

{% highlight ruby %}
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Use fewer memory and CPU resources
  config.vm.provider :virtualbox do |vbox, override|
    vbox.memory = 256
    vbox.cpus = 1
  end
{% endhighlight %}
