#!/bin/sh
sass --update css/screen.scss
jekyll serve  --drafts --baseurl "" --watch
