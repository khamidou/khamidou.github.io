---
layout: post
title: How to write a good engineering job post
featured: true
---
Writing a job post feels like pulling teeth, which is why most job posts end up reading like an ambitious mission statement ("We want to disrupt the pizza delivery market!") followed by laundry list of requirements (Python! Javascript! Mongo! AWS!).

Luckily, there's a better way to do this – and once you know the proper structure it will be a lot easier, too! It will also get you candidates who are interested in your culture and technical challenges.

This is a modest guide on how to do it. I've included a lot of examples because I think it's the best way to learn – feel free to click on any screenshot to get to the bigger version.

**Table of contents**

{:.no_toc}

1. This line is a placeholder to generate the table of contents
{:toc}

<br>

# The first role of a job post is selling

The most important thing to remember when writing a job post is that you're trying to get a candidate interested in your company.

Generally[^spacex], candidates are interested by three things (in this order):

1. your company culture: Does it have work-life balance? Will my colleagues be nice? Is the company diverse?
2. opportunities for growth: If I want to lead a team, will I be able to do it in a few years? Can I do public speaking?
3. your company's mission: Is it going to make the world a better place?

That means that you're going to have to put these three things front and center. I know that this sounds easier said than done – don't worry we'll be diving into specific examples you can later use as inspiration.

# How to structure a job post

Like the best classical essays, most job posts follow a three-part structure. Generally it looks like this:
1. What the role is
2. What you need to know
3. Why're we're cool

Other companies like to spend some time telling you how cool they are before describing the job – I'm not sure it's a great idea. People are looking for a *specific* job at your company. They're not looking for *any* job there.

For example, here's a great job post from Stripe that follows this structure to a tee (click to zoom):

<a href='/images/job_posts/stripe-web-engineer-annotated.png'>
    <img alt='stripe' src='/images/job_posts/stripe-web-engineer-annotated.png' />
</a>

Let's dive into each part to see what makes them tick.

## What the role is

I know it can be very tempting to say something like "well, on a day-to-day basis you'll be fixing bugs and implementing features. You might have to talk to customers.". On the contrary, you need to be as detailed as possible to give your reader a clear idea of the job.

Here's a great example of this, one of Nylas' engineering job posts, written by my colleague [Evan Morikawa](http://evanmorikawa.com/):

<a href='/images/job_posts/nylas-job-description.png'>
    <img alt='nylas job description' src='/images/job_posts/nylas-job-description.png' />
</a>

Obviously, Nylas is still a pretty small company so it's easier to give meaningful examples of work! However, this is also possible for a bigger company. Here's how Square does it for example:

<a href='/images/job_posts/square-job-description.png'>
    <img alt='square job description' src='/images/job_posts/square-job-description.png' />
</a>

This is a pretty masterful description! On the one hand you have an introduction paragraph that shows how important the team is for the success of the company ("This work has direct impact on Square’s profitability and financial success."). On the other hand you have a detailed list of what you'll work on, as well as a couple hard problems to keep you up at night.[^specific]

## What you need to know

Lots of companies have long lists of requirements. This is far from ideal, because first, how many hard requirements do you have? Most of the things that end up on a requirements list are at best nice to have.[^bash]

However, long lists of requirements have a more pernicious effect – they can intimidate some people who would otherwise apply. [Impostor syndrome](https://en.wikipedia.org/wiki/Impostor_syndrome) is a real thing.

To make sure you're not letting anybody out, it's best to keep requirements list as short as possible. Here's a good example from Clever:

{% include image-caption.html url="/images/job_posts/clever-requirements.png"
                              caption="" %}

Most engineers spend as much time dealing with people as they do dealing with technical issues, so remember to not get bogged down with technical requirements. They're important, sure, but a good rule of thumb is that roughly half of your requirements should be non-technical.

## Why we're cool

Finally, you need to explain why someone would join your startup over any other startup. This is certainly the most tricky part of writing a job post, since it's kind of hard to sum up what makes your company special.

One of the best ways to write a "Why we're cool" section is to sit down and write what makes the culture of your company great. This means writing down the big things (Do you have a mission? Do you value autonomy? What about work-life balance?) as well as the smaller ones (What's your open source policy? Does everybody eat lunch at their desks or do people go out together?)

Don't be afraid to get into as much detail as you want – there are hundreds of startups in the bay area using Python. There are thousands using Node. None have your unique company culture and that's what you need to put forward.

Here's a breakdown of the "Why we're cool" section of another Stripe job posting[^whatcani]. Pay attention to all the unique selling points they have:
![stripe cool description](/images/job_posts/stripe-cool.png)

This job posting hits all the notes – from the big things (the mission: increasing the GDP of the Internet) to the smaller ones (everybody having lunch together).

If you're looking for more inspiration, [Github](/images/job_posts/github-cool.png) and – in a more corporate style – [Splunk](/images/job_posts/splunk-cool.png) have good "why we're cool" sections.

# Watch out for biases!

Make sure that your job post isn't unconsciously biased towards certain categories. One example I can remember is an old Nylas SRE job posting that had this interesting metaphor:

(We've retired this job posting a long time ago!)

It's kind of hard to say "look for your own unconscious bias in the post you wrote", but what helps would be to ask a diverse set of your coworkers whether they'd consider applying after reading your job post.

You could also use a tool like [Kat Matfield's gender decoder](http://gender-decoder.katmatfield.com/) to "lint" your post and make sure it's gender neutral.

# Wrap-up

Hopefully, with the right structure in place writing a job post isn't going to feel like pulling teeth anymore!
Please let me know if you have questions or comments – send me an email at *hello* at khamidou.com.

{% comment %}
If you're interested in good examples of job posts, you can also download my swipe file – the job posts I always go back to when I'm writing one – by signing up to my mailing list.
{% endcomment %}

[^website]: Sometimes, even before your corporate website. For example, if they found your post through a job board.
[^spacex]: Obviously, the order is going to be a little different if you're, say, SpaceX. You'll get a lot more mission-driven people.
[^requirements]: Take a junior engineer for example. Do you have that many requirements, besides knowing how to code, being easy to work with and not needing too much supervision?
[^bash]: Does an SRE need to know Bash? Maybe – or maybe they can figure it out on the job.
[^copypasta]: The good news is that if you've figured out how to write it, you can just copy-paste it into all your job posts!
[^whatcani]: What can I say? They have great job postings!
[^specific]: In general, it's better to be very specific about what the job will entails, because it helps the reader imagine what they'll be doing.
