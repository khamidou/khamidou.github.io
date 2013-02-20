---
layout: post
title: Using Django lazily translated strings in JSON
---

### {{ page.title }}

<p class="meta">20 February 2013</p>

Last week I had to add support for i18n to a django application. Everything went swiftly, except for one thing : I needed to output a translated JSON structure in my HTML and doing this simple with json.dumps triggered a TypeError exception, with the message : "<django.utils.functional.\__proxy__\ object at 0x987a86c> is not JSON serializable".

The solution to this problem is to define a custom serializer to force the conversion of lazy translated strings (also known as Promise objects) to a string. To do this define the following class :

    class LazyEncoder(json.JSONEncoder):
	"""Encodes django's lazy i18n strings.
	Used to serialize translated strings to JSON, because
	simplejson chokes on it otherwise.
	"""
	def default(self, obj):
	    if isinstance(obj, Promise):
		return force_unicode(obj)
	    return obj

and call simplejson this way :
    json.dumps(object, cls=LazyEncoder)