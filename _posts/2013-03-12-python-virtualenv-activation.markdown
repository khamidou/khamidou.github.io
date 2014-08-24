---
layout: post
title: How to activate a python virtualenv without having to go through dozen of folders
date: March, 12 2013
categories: tips
---

I'm working on a couple django apps which use separate virtualenvs and I very often have to source the virtualenv activation script.
It got so tedious that I had to write a small script to automate the finding of the activation script.

<!-- more -->

The following python script, named "findact", searches in the recursively for a file named "activate". If it is not found, it starts again from the parent directory, and so on.
{% highlight python %}
#!/usr/bin/env python
# find a file named "activate" in a subdir or parentdir of the cwd
# written by karim hamidou. 03/12/13

import sys
import os

def visit_dir(visited_dirs=[]):
    found = False
    initial_dir = os.getcwd()

    for root, dirs, files in os.walk(os.getcwd(), topdown=True):
        # exclude already visited directories
        for vdir in visited_dirs:
            if vdir in dirs:
                dirs.remove(vdir)

        if "activate" in files:
            found = True
            break
    if found:
        print "%s/activate" % root
        sys.exit(0)
    else:
        if os.getcwd() != "/":
            os.chdir("..")
            visited_dirs.append(initial_dir)
            visit_dir(visited_dirs=visited_dirs)
        else:
            sys.exit(-1)

visit_dir()
{% endhighlight %}

I added a small function to my shell to source the file, if it is found:
{% highlight bash %}
function act() {
    FILE=$(findact)
    if [ $? -eq 0 ]; then
        echo -n "Source $FILE (y/n) ? "
        read  yn
        case $yn in
        [Yy]* ) source $FILE;
        esac
    fi
}
{% endhighlight %}

This way, I can type "act" to load my virtualenv from anywhere in my project directory.
