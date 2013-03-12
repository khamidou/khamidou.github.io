#!/bin/sh
jekyll
#scp -r _site/* karim@neyret.fr:public_html
rsync -avz -e ssh _site/ karim@neyret.fr:public_html  
