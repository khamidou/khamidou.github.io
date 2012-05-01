#!/bin/sh
jekyll
scp -r _site/* karim@neyret.fr:public_html
