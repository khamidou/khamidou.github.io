---
layout: post
title: Overriding vagrant settings
categories: tips
---
This tip courtesy of my colleague [Dwayne Litzenberger](https://www.dlitz.net/).

[Vagrant](http://www.vagrantup.com/) is a great tool. My only gripe with it is that it forces everyone to share the same vm settings, which can be painful, especially when you have a slow computer. It seems there's a `~/.vagrant.d` directory for specifying overrides but it's run _before_ `Vagrantfile`, which makes it useless to override variables defined in `Vagrantfile`.

There's a variety of methods for [doing](http://stackoverflow.com/questions/13065576/override-vagrant-configuration-settings-locally-per-dev) [this](https://github.com/reidab/citizenry/blob/master/Vagrantfile) but the cleanest way is adding the following lines of code to the end of your `Vagrantfile`:

{% highlight ruby %}
# Local Vagrantfile overrides.
Dir.glob('Vagrantfile.local.d/*').sort.each do |path|
  load path
end
Dir.glob('Vagrantfile.local').sort.each do |path|
  load path
end
{% endhighlight %}

This code loads everything under Vagrantfile.local.d/ and `Vagrantfile.local`. For instance, my `Vagrantfile.local` contains:

{% highlight ruby %}
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Use fewer memory and CPU resources
  config.vm.provider :virtualbox do |vbox, override|
    vbox.memory = 256
    vbox.cpus = 1
  end
{% endhighlight %}
