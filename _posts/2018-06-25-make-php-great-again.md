---
layout: post
title: Make PHP Great Again
date:   2018-06-25 20:00:00
categories: programming
excerpt: The PHP core functions are a complete mess. With PHP 8 on the horizon, and more competition than ever in the programming ecosystem, this might be a last chance to make PHP great again.
---

Apologies for the clickbait title, but if you are a PHP developer, I really think that this topic deserves your attention.

PHP has had a love-hate relationship with much of the programming community for a while. An almost complete introduction to the topic of PHP hate can be found in the famous blog post [PHP: a fractal of bad design](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/). In this post, the author hilariously cuts down almost every aspect of the PHP language, and sets out a rather convincing argument for consigning PHP to the archives of programming history. The article is now slightly out of date (it was published in 2012), but much of its criticism remains valid.

Personally, I simultaneously love and hate pretty much every language that I have ever been introduced to. I love C and how it taught me low level programming concepts, but I hate how it takes two hours to try and join two strings together. I love Python because of the machine learning and Raspberry Pi communities, but I hate how it is practically impossible to achieve type safety and proper object oriented design. I love JavaScript and the asynchronous programming techniques that it has encouraged, but I hate how I need about 9000 dependencies in my `node_modules` directory to serve a hello world application on port 80.

There is lots that I love about PHP too. When I was a youngster without funding for servers, shared free PHP hosting was all I had. It made object oriented programming accessible to me and I love the package manager and its ecosystem.

With all that said, I **passionaly hate** the PHP core functions.

- Want to map an array? `array_map($callback, $input)`
- Want to filter an array? `array_filter($input, $callback)`
- Want to get the type of a resource? `get_resource_type($resource)`
- Want to get the type of a variable? `gettype($variable)`
- Want to check if a variable is a string? `is_string($variable)`
- Want to check if a variable is set? `isset($variable)`

PHP has all of the scars of a language that has been added to, without proper consideration, by many different people over a long period of time. The process for making changes to the language is now much stricter, but undoing the damage that was done is something that needs more discussion.

The alternative, is accepting [these glaring inconsistencies](https://eev.ee/blog/2012/04/09/php-a-fractal-of-bad-design/#standard-library) as part of the language until it dies. The arguments for fixing or leaving these issues will not change over time, the only difference is that it might be easier to introduce backwards compatibility breaks in the future because more programmers will have gone elsewhere. Every year huge companies such as [Google](https://golang.org/) and [Microsoft](https://www.typescriptlang.org/) invest significant resources into trying to create a better programming language. If PHP wants to compete in the future with languages that have been designed with the benefit of hindsight, it has to clean out the crap every now and then.

In theory, the process for fixing the PHP core functions is simple. The first step is to introduce deprecations to functions that need to be replaced, and ensure that replacements are available and recommended for use. After a period of time, the deprecated functions that nobody is using any more can be removed.

Good replacements have been discussed before too. There was an RFC for [fixing the inconsistent function names](https://wiki.php.net/rfc/consistent_function_names) that was tabled in 2015 but never made it anywhere. My favourite suggestion, is that [introducing scalar objects](https://github.com/nikic/scalar_objects) could open the door for a new API that is inspired by common sense rather than the C POSIX library.

```php
// Rather than
$lowerCaseFruit = ['apples', 'oranges', 'grapes'];

$upperCaseFruit = array_map(function ($fruit) {
    return strtolower($fruit);
}, $lowerCaseFruit);

// We could have
$lowerCaseFruit = ['apples', 'oranges', 'grapes'];

$upperCaseFruit = $lowerCaseFruit->map(function ($fruit) {
    return $fruit->toLower();
});
```

In reality, the process for fixing the PHP core functions is more difficult. The first step is actually convincing the PHP internals group that this cause is worth the effort and the backwards compatibility break. Joining the internals community is a pretty opaque process and it takes time (and goat sacrifices) to accrue the karma and respect necessary to actually action something yourself. But, if the wider community bangs its collective drum loudly enough, there is a chance that some of the key players in the group will set their brilliant minds to this task.

The reason for this post, is that [the release of PHP 8 is current being discussed on the internals mailing list](https://externals.io/message/102415). The current suggestion is that PHP 7.3 (which is about to feature freeze) will be the last version before PHP 8 (except for a deprecations only PHP 7.4). A feature as major as this would almost certainly be rolled into a major version, and [there are a lot of significant features already tabled for PHP 8](https://externals.io/message/102415) with no mention of cleaning up the core functions.

If we want to "Make PHP Great Again", or at least "Make PHP Slightly Better Before 2025", now is probably a good time to start banging that drum!
