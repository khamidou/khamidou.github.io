#!/bin/sh
jekyll build
rsync -avz --exclude "copy.sh" --exclude "*.scss" -e ssh _site/ karim@khamidou.com:public_html
