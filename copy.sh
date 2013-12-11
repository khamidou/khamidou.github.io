#!/bin/sh
jekyll
#scp -r _site/* karim@neyret.fr:public_html
rsync -avz --exclude "copy.sh" -e ssh _site/ karim@neyret.fr:public_html  
