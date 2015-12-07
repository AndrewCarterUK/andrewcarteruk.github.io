---
layout: post
title:  PSR-6 Has Serious Problems
date:   2015-12-07 20:00:00
categories: programming
---

PSR-6 is the proposal from the [PHP-FIG (PHP Framework Interop Group)](http://www.php-fig.org/) of a set of cache interfaces that can assist programmers in writing decoupled code. The idea is that cache drivers can implement these interfaces and then code can depend on the interface rather than the underlying cache driver or system.

Here are the basic interfaces that have been proposed:

{% highlight php %}
<?php

namespace Psr\Cache;

interface CacheItemPoolInterface
{
    public function getItem($key);
    public function getItems(array $keys = array());
    public function hasItem($key);
    public function clear();
    public function deleteItem($key);
    public function deleteItems(array $keys);
    public function save(CacheItemInterface $item);
    public function saveDeferred(CacheItemInterface $item);
    public function commit();
}

interface CacheItemInterface
{
    public function getKey();
    public function get();
    public function isHit();
    public function set($value);
    public function expiresAt($expiration);
    public function expiresAfter($time);
}

interface CacheException {}

interface InvalidArgumentException extends CacheException {}
{% endhighlight %}
