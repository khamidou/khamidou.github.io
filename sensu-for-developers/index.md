---
layout: guide
title: A dive into the Sensu source code
date: 2014-10-01 00:00:00
---
_Last updated on {{ page.date | date_to_string }}_

I'm a developer, which means I consider ops stuff a necessary evil. One of my many nemeses is monitoring. It's a field where the dominant player, Nagios has been around for so long that's it's become the villain.

[Sensu](http://sensuapp.org) is the latest hero trying to slay the Nagios dragon. It's a monitoring system "built for the cloud" and written in Ruby. The main problem is the docs are somehow confusing.

It's very short -- about 2400 lines for the core app -- and very readable. Let's read its source code, and hopefully we'll get some understanding of what makes it tick.

{:.yellowbox}
__A disclaimer__: I spend most of my days writing Python and my Ruby is somehow rusty.

## The architecture of Sensu

Before diving in the code, let's talk about the high-level details. Sensu is based on a client-server architecture. It uses [RabbitMQ](http://www.rabbitmq.com/) to handle communication between many clients and a server.

Clients register themselves to the server so it's not necessary to reconfigure the server whenever you add a new client to a network.

They run __checks__ locally and report the results to the server (more about this later). The server can define __handlers__ to react to the results of a check. Handlers can do a lot of things, like calling pagerduty or sending an email.

## The sensu client

## General set up

The sensu client runs on every machine you want to monitor. Here's the entry point: (Note that I've slightly re-arranged the order of the functions in the file for readability and cut some error reporting because who needs this?)

{% highlight ruby %}
def self.run(options={})
  client = self.new(options)
  EM::run do
    client.start
    client.setup_signal_traps
  end
end

def start
  setup_transport
  setup_sockets
  bootstrap
end
{% endhighlight %}

[`setup_transport`](https://github.com/sensu/sensu/blob/e7376fbc26d17db971a8210b2c7a11e7aaf24a7f/lib/sensu/daemon.rb#L135) and [`setup_sockets`](https://github.com/sensu/sensu/blob/e7376fbc26d17db971a8210b2c7a11e7aaf24a7f/lib/sensu/client.rb#L214) are self-explanatory: the former sets up the RabbitMQ connection and the later opens a local server for TCP and UDP on port 3030 (we'll see that is this used for later).

[`setup_signal_traps`](https://github.com/sensu/sensu/blob/e7376fbc26d17db971a8210b2c7a11e7aaf24a7f/lib/sensu/daemon.rb#L117) sets up signal handling to... trap signals.

The meat of the set up code is in the [`bootstrap`](https://github.com/sensu/sensu/blob/e7376fbc26d17db971a8210b2c7a11e7aaf24a7f/lib/sensu/client.rb#L246):

{% highlight ruby %}
def bootstrap
  setup_keepalives
  setup_subscriptions
  setup_standalone
  @state = :running
end
{% endhighlight %}

Here's [`setup_keepalives`](https://github.com/sensu/sensu/blob/e7376fbc26d17db971a8210b2c7a11e7aaf24a7f/lib/sensu/client.rb#L43). As you can see, it simply registers an EventMachine periodic event that sends a keepalive to the server:

{% highlight ruby %}
def setup_keepalives
  @logger.debug('scheduling keepalives')
  publish_keepalive
  @timers[:run] << EM::PeriodicTimer.new(20) do
    publish_keepalive
  end
end

def publish_keepalive
  keepalive = @settings[:client].merge({
    :version => VERSION,
    :timestamp => Time.now.to_i
  })
  payload = redact_sensitive(keepalive, @settings[:client][:redact])
  @logger.debug('publishing keepalive', {
    :payload => payload
  })
  @transport.publish(:direct, 'keepalives', MultiJson.dump(payload)) do |info|
    if info[:error]
      @logger.error('failed to publish keepalive', {
        :payload => payload,
        :error => info[:error].to_s
      })
    end
  end
end
{% endhighlight %}

{:.yellowbox}
__Remark:__ You can see that at no point we have had to tell the server _"hey I'm a new client"_. A client may come and go without notice, and the server detects this automatically.

## Standalone and server checks

Sensu has two different types of checks: standalone and server checks (the sensu docs calls the latter "checks" which is somehow confusing). Both checks run on the client but server checks are triggered by the server.

Let's see how they're handled in the code.

{% highlight ruby %}
def setup_subscriptions
  @logger.debug('subscribing to client subscriptions')
  @settings[:client][:subscriptions].each do |subscription|
    funnel = [@settings[:client][:name], VERSION, Time.now.to_i].join('-')
    @transport.subscribe(:fanout, subscription, funnel) do |message_info, message|
      begin
        check = MultiJson.load(message)
        @logger.info('received check request', {
          :check => check
        })
        process_check(check)
    end
  end
end
{% endhighlight %}

Again, this is straightforward. The code looks at the list of server checks the client is subscribed to and adds an handler for every one of them.

The handler parses requests and passes them to `process_check`, which does all the heavy lifting.

{:.yellowbox}
__Remark:__ Now, there's probably a reason for this but I find pretty annoying that the user has to specify in the client config file the checks it has to subscribe to. It's just redudant.<br>
My guess is this is because sensu doesn't integrate with service directories like [consul](https://www.consul.io/). Still, that's annoying.


{:.greenbox}
__Trivia:__ The server sends check requests with RabbitMQ, using the fanout exchange type -- fanout simply means the message is sent to every other client. The name sensu is the translation of umbrella in japanese, which is often used to explain the fanout exchange.


