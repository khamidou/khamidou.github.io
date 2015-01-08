#!/bin/sh
jekyll build
rsync -avz --exclude "copy.sh" --exclude "*.scss" -e ssh _site/ karim@neyret.fr:public_html  
