---
layout: post
title: Make PHP Great Again
date:   2018-06-25 20:00:00
categories: programming
excerpt: With PHP 7.3 looming, this might be a last chance to make PHP great again.
---

Apologies for the clickbait title, but I really think this topic deserves your attention.

PHP has a love-hate relationship with much of the programming community. An almost complete introduction to the topic of hating PHP can be achieved by reading the famous blog post [PHP: a fractal of bad design](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/). In this post, the author hilariously explains many of the flaws of PHP, and sets out a convincing argument for consigning PHP to the archives of programming history.

Personally, I simultaneously love and hate pretty much every language that has ever been invented. I love C and how it taught me so many low level programming concepts, I hate how it takes two hours to try and join two strings together. I love Python because of the machine learning and Raspberry Pi communities, but I hate how it is practically impossible to achieve type safety and proper object oriented design. I love JavaScript and the asynchronous programming techniques that it has encouraged, but I hate how I need about 9000 dependencies in my `node_modules` directory to serve a hello world application on port 80.

There is lots that love about PHP too. When I was a young teenager without funding for servers shared free PHP hosting was all I had. It made object oriented programming accessible to me and I love the package manager and ecosystem that make up for so many of the language flaws.

With all that said, I **passionaly hate** the standard library. Want to map an array? `array_map($callback, $input)`. Want to filter an array? `array_filter($input, $callback)`! Want to get the type of a resource? `get_resource_type($resource)`. Want to get the type of a variable? `gettype($variable)`. Want to check if a variable is a string? `is_string($variable)`. Want to check if a variable is set? `isset($variable)`!

PHP has all of the scars of a language that has been added to, without proper consideration, by many different heads over a long period of time. The process for making changes to the language is now much stricter, but undoing the damage that was done is something that will take a long time.

In theory, the process for fixing the standard library is simple. The first step is to introduce deprecations to functions that need to be replaced, and ensure that replacements are available and recommended for use. After a period of time, the deprecated functions that nobody is using any more can be removed.

Good replacements have been discussed before too. There was an RFC for [fixing the inconsistent function names](https://wiki.php.net/rfc/consistent_function_names). My favourite, is the suggestion that [introducing scalar objects](https://github.com/nikic/scalar_objects) could open the door for a new API that was inspired by common sense rather than the C POSIX library.

In reality, the process for fixing the standard library is much more complicated. The first step is actually convincing the PHP internals group that it is a good idea and important to the community. Joining the internals community is a pretty opaque process, and it takes time (and goat sacrifices) to accrue the karma and respect necessary to actionally action something. But, if the community bangs its collective drum loudly enough, there is a chance that some of the key players in the group will set their brilliant minds to this task. If they did, we might see eveyone on `/r/programming` adding PHP as a skill back onto their LinkedIn profiles.
