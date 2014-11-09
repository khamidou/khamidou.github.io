---
layout: guide
title: A dive into the Sensu source code (part 1)
date: 2014-10-01 00:00:00
---
_Last updated on {{ page.date | date_to_string }}_

I'm a developer, which means I consider ops stuff a necessary evil. One of my many nemeses is monitoring. It's a field where the dominant player, Nagios has been around for so long that's it's become the villain.

[Sensu](http://sensuapp.org) is the latest hero trying to slay the Nagios dragon. It's a monitoring system "built for the cloud" and written in Ruby. The main problem is the docs are somehow confusing.

Fortunately the code is short -- about 2400 lines for the core app -- and very readable. Let's read it, and hopefully we'll get some understanding of what makes it tick.

This is a two part series. The first part (the one you're reading right now) details the sensu client and the second part will talk about the server.

{:.yellowbox}
__A disclaimer__: I spend most of my days writing Python and my Ruby is somehow rusty. Caveat lector.

## The architecture of Sensu

Before diving in the code, let's talk about the high-level details. Sensu is based on a client-server architecture. It uses [RabbitMQ](http://www.rabbitmq.com/) to handle communication between many clients and a server.

Clients register themselves to the server so it's not necessary to reconfigure the server whenever you add a new client to a network.

They run __checks__ locally and report the results to the server (more about this later). The server can define __handlers__ to react to the results of a check. Handlers can do a lot of things, like calling pagerduty or sending an email.

Sensu is written with [EventMachine](https://github.com/eventmachine/eventmachine/wiki), an event loop similar to Python's [gevent](http://www.gevent.org/).

## The sensu client

### General set up

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

### Standalone and server checks

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
__Trivia:__ The server sends check requests with RabbitMQ, using the fanout exchange type -- which simply means the message is sent to every other client. The name sensu is the translation of umbrella in japanese, which is often used to explain the fanout exchange.

### Running checks

Let's see what's in `process_check`:

{% highlight ruby %}
def process_check(check)
  if check.has_key?(:command)
    if @settings.check_exists?(check[:name])
      check.merge!(@settings[:checks][check[:name]])
      execute_check_command(check)
    elsif @safe_mode
      check[:output] = 'Check is not locally defined (safe mode)'
      check[:status] = 3
      check[:handle] = false
      check[:executed] = Time.now.to_i
      publish_result(check)
    else
      execute_check_command(check)
    end
  else
    if @extensions.check_exists?(check[:name])
      run_check_extension(check)
    else
      @logger.warn('unknown check extension', {
        :check => check
      })
    end
  end
end
{% endhighlight %}

So what's happening with all these nested ifs? The common case is that the JSON we received from the server contains a command to execute. In this case either:

1. the check is defined in the client configuration file. In this case the config pushed by the server is merged with the one defined on the client -- with the server-side values taking precedence other the client config values.
2. the check is not defined and safe mode is activated. The client simply notifies the server that the check wasn't run.
3. the check is run anyway and its results are reported to the server.

Otherwise, sensu tries to find an extension with the same name (more about this later, but an extension is simply a check that runs inside the sensu event loop, mostly for performance reasons).

Here's the code to actually run checks. It's a little complicated because it has to handle some edge cases. Let's break it in parts.

{% highlight ruby %}
def execute_check_command(check)
  @logger.debug('attempting to execute check command', {
    :check => check
  })
  unless @checks_in_progress.include?(check[:name])
    @checks_in_progress << check[:name]
    command, unmatched_tokens = substitute_command_tokens(check)
    if unmatched_tokens.empty?
      check[:executed] = Time.now.to_i
      started = Time.now.to_f
      Spawn.process(command, :timeout => check[:timeout]) do |output, status|
        check[:duration] = ('%.3f' % (Time.now.to_f - started)).to_f
        check[:output] = output
        check[:status] = status
        publish_result(check)
        @checks_in_progress.delete(check[:name])
      end
    else
      check[:output] = 'Unmatched command tokens: ' + unmatched_tokens.join(', ')
      check[:status] = 3
      check[:handle] = false
      publish_result(check)
      @checks_in_progress.delete(check[:name])
    end
  else
    @logger.warn('previous check command execution in progress', {
      :check => check
    })
  end
end
{% endhighlight %}

