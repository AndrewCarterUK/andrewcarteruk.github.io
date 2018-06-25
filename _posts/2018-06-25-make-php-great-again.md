---
layout: post
title: Make PHP Great Again
date:   2018-06-25 20:00:00
categories: programming
excerpt: With PHP 7.3 looming, this might be a last chance to make PHP great again.
---

Apologies for the clickbait title, but I really think this topic deserves your attention.

PHP has a love-hate relationship with much of the programming community. An almost complete introduction to the topic of hating PHP can be achieved by reading the famous blog post [PHP: a fractal of bad design](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/). In this post, the author hilariously explains many of the flaws of PHP, and sets out a convincing argument for consigning PHP to the archives of programming history.

Personally, I simultaneously love and hate pretty much every language that has ever been invented. I love C and how it taught me so many low level programming concepts, I hate how it takes two hours to try and join two strings together. I love Python because of the machine learning and Raspberry Pi communities it harbors, but I hate how it's practically impossible to achieve type safety and proper object oriented design. I love JavaScript and the asynchronous programming techniques that have emerged, but I hate how to even begin a basic application I need to introduce about 9000 dependencies into my `node_modules` directory.

There is lots I love about PHP too, but I **hate** with a passion the standard library. It would be difficult to introducing a naming convention more random if you tried. It has all of the scars of a language that has been added to, without proper consideration, by many different heads over a long period of time. The process for making changes to the language is now much stricter, but undoing the damage that was done is something that will take a long time.

The process for fixing the standard library, if the PHP community decides this is something they want to happen, is simple. Introduce deprecations to functions that we want to replace, and ensure that there are alternatives available that you recommend to use instead. After a period of time, remove the deprecated functions that nobody is using any more and then add PHP as a skill back onto your LinkedIn profile and strut around like a proud puffin.
