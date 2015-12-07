---
layout: post
title:  PSR-6 Has Serious Problems
date:   2015-12-07 20:00:00
categories: programming
---

PSR-6 is the proposal from the [PHP-FIG (PHP Framework Interop Group)](http://www.php-fig.org/) of a set of cache interfaces that can assist programmers in writing decoupled code. The idea is that cache drivers can implement these interfaces and then code can depend on the interface and not the underlying cache driver or system.

Here are the proposed interfaces:

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

### Problem 1

**Some of most important projects in the FIG (regarding caching) have voted against it**

One of the first '-1' votes on the proposal at the moment is a resounding no from the Doctrine team. The comment on the [voting thread](https://groups.google.com/forum/#!topic/php-fig/dSw5IhpKJ1g) is:

_"Unanimous -1 from Doctrine among all core developers. List of deficiencies too big and not pertinent to this thread."_

The Doctrine team are the maintainers of ([according to packagist](https://packagist.org/search/?q=cache)) the most popular caching library in the PHP ecosystem.

Guzzle and Laravel also maintain popular caching libraries and voted '-1'. Other member projects in the FIG group should have alarm bells ringing loudly in their ears when they see these votes.

The proposal should be moved back and the concerns of Doctrine, Guzzle and Laravel should be listened to.

### Problem 2

The second problem is with the last two interfaces. They fail to make it clear that they are interfaces and **they also pretend to be exception classes**. This might provide a minor irritation to anyone implementing the interface, but to the user it should not be a problem. You can still catch it the same, right?

The exception system in PHP was **designed to be extended**. The issue here is that there is no guarantee that a class implementing the **InvalidArgumentException** interface defined by the proposal will also extend the root **InvalidArgumentException** class defined by PHP.

This leads to the ridiculous situation where the following situation is not only plausible, but completely in agreement with the specification:

{% highlight php startinline=true %}
if (
     $exception instanceof Psr\Cache\InvalidArgumentException &&
    !$exception instanceof \InvalidArgumentException
) {
    echo 'Huh?';
}
{% endhighlight %}

If you wanted to guarantee catching all invalid argument exceptions in a block of code you would need to do this:

{% highlight php startinline=true %}
try {
    // code
} catch (Psr\Cache\InvalidArgumentException $exception) {
    // invalid argument exception logic
} catch (\InvalidArgumentException $exception) {
    // invalid argument exception logic again
} // ...
{% endhighlight %}

This might not sound so significant, but I cannot for the life of me understand why the proposal decided to use interfaces in the first place. It doesn't appear to solve any problems and it actually creates one.

### Problem 3

The cache item interface lets you set an expiration time using the following methods;

{% highlight php startinline=true %}
$item->expiresAfter(300);
$item->expiresAt(new \DateTime(...));
{% endhighlight %}

However, there is no method available to retrieve this expiry information from the item. There are good reasons for this. Primarily, if you retrieve an item from memcached it is not actually possible to find out when it expires, at least not without some serious wizardry and expensive operations. This is the case for many other cache systems too.

On the surface this is not a problem. If you cannot know the expiration of an item, there shouldn't be a method promising to provide it.

The problem only becomes apparent when you think of how the cache pool handles this information; after all, it is the cache pool that actually persists the cache item. Somehow, the cache pool needs to know the expiration time that you set on the cache item.

Now there are two options here for an implementation.

The first is that the cache item could be provided a method of communication with the cache pool on construction. However, this leads to a new problem, **memory leaks**.

When the item falls out of scope the cache pool will have no way of knowing that it needs to forget all the information it was storing about the cache item. The only way to control the memory leak in a long running process would be to continuously recreate the cache pool.

The second option is that the implementation could expose a public method on the cache item that is not defined on the **CacheItemInterface**. This is a particularly unsatisfying solution for a few reasons:

1. Public methods are a pain. As soon a class in a library has a public method it cannot change that without breaking backwards compatability. The last thing any library developer wants to do is create unnecessary public methods that they then have to support until the next major version.

2. Users should not be calling such a method. If implementations do add a public **getExpiration()** method, this will ultimately not be the method that users expect it to be (for precisely the reasons that it was removed from the specification in the first place). When you create a method that users should not be using... **it should not be public**.

3. The specification should be complete for both calling code **and implementations**.

One solution to this specific problem would be to set the expiration time when saving the object. Something like this:

{% highlight php startinline=true %}
$pool->save($item, 300);
{% endhighlight %}

## Summary

Anthony Ferrara's [Open Letter To PHP-FIG](http://blog.ircmaxell.com/2014/10/an-open-letter-to-php-fig.html) describes well the core issue of over engineering in PSR-6.

A lot of work has gone into PSR-6 and I can understand everything the authors have tried to do. That said, I think it would be a huge mistake for the PHP-FIG if the proposal was to pass in its current form.
