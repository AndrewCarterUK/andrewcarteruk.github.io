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


### Problem 1

The first problem is with the last two interfaces. Not only do they not make it clear that they are interfaces, **they pretend to be exception classes**. This might provide a minor irritation for anyone implementing the interface, but to the user it should not be a problem. You can still catch it the same, right?

**Wrong**

The extension system in PHP was **designed to be extended**. The issue here is that there is no guarantee that a class implenting the 'InvalidArgumentException' interface defined by the proposal will also extend the root 'InvalidArgumentException' class defined by PHP.

This leads to the ridiculous situation where the following situation is not only plausible, but completely in agreement with the specification:

{% highlight php %}
if ($exception instanceof Psr\Cache\InvalidArgumentException and ! $exception instanceof \InvalidArgumentException) {
    echo 'Huh?';
}
{% endhighlight %}

If you wanted to guarantee catching all invalid argument exceptions in a block of code you would need to do this:

{% highlight php %}
try {
    // code
} catch (Psr\Cache\InvalidArgumentException $exception) {
    // invalid argument exception logic
} catch (\InvalidArgumentException $exception) {
    // invalid argument exception logic again
} // ...
{% endhighlight %}

This might not sound so significant, but I cannot for the life of me understand why the proposal decided to use interfaces in the first place. It doesn't appear to solve any problems and it actually creates one.

### Problem 2

On the interfaces it is possible to set a time to live on a cache item using the following methods;

{% highlight php %}
$item->expiresAfter(300);
$item->expiresAt(new \DateTime(...));
{% endhighlight %}

However, there is no method available to retrieve this expiry information from the item. There are good reasons for this. Primarily, if you retrieve an item from memcached it is not actually possible to find out when it expires, at least not without some serious wizardry and expensive operations. This is the case for many other cache systems too.

On the surface, this is not a problem. If you cannot know the expiration of an item there shouldn't be a method promising to provide it, as long as you can still set it.

The problem only becomes apparent when you think of how the cache pool handles this information; after all, it is the cache pool that actually persists the cache item. Somehow, the cache pool needs to know the expiration time that you set on the cache item.

Now there are two options here for an implementation.

The first is that the constructor for the cache item can be passed some method of communication from the cache pool when it is instantiated. But this leads to a new problem, **memory leaks**. When the item falls out of scope this method of communication will not, the cache pool will still need to hold some reference to it. In a long running process using a cache implementation of this nature, the only way to control the memory leak would be to continuously recreate the cache pool.

The second option is that the implementation could expose a public method on the cache item that is not defined by the specification (i.e. a method not on the CacheItemInterface). This is a particularly unsatisfying solution for two reasons:

1. Public methods are a pain. As soon a class in a library contains a public method it cannot change that without breaking backwards compatability. The last thing any library developer wants to do is create unnecessary public methods that they then have to support until the next major version.

2. Users should not be calling that method. If implementations do decide to add a public 'getExpiration()' method onto their cache items this will ultimately not be the method that users expect it to be, for precisely the reasons that it was removed from the specification in the first place. When you create a method that users should not be calling it should not be public.

3. The specification should be complete. There is no reason why, with the exception of constructors, implementations should be forced to define any methods that are not in the original specification.

The solution to this problem would be to set the expiration time when saving the object. So rather than:

{% highlight php %}
$item->expiresAfter(300);
$pool->save($item);
{% endhighlight %}

We had:

{% highlight php %}
$pool->save($item, 300);
{% endhighlight %}

I read Anthony Ferrara's [Open Letter To PHP-FIG](http://blog.ircmaxell.com/2014/10/an-open-letter-to-php-fig.html) regarding PSR-6 about a year ago and didn't agree at the time. I'm now in complete agreement and I think the way the FIG group has voted so far on the proposal highlights a much deeper structural issue within the group.

One of the few '-1' votes on the proposal at the moment is a resounding no from the Doctrine team. The actual comment on the [voting thread](https://groups.google.com/forum/#!topic/php-fig/dSw5IhpKJ1g) was:

__"Unanimous -1 from Doctrine among all core developers. List of deficiencies too big and not pertinent to this thread."__

The Doctrine team maintain, [according to packagist](https://packagist.org/search/?q=cache), the most popular cache library in the PHP ecosystem. Guzzle and Laravel also maintain a popular cache libraries and also voted '-1'. In fact, many of the '+1' votes are from projects that have **nothing to do with caching**.

It is definitely the case that member projects of the FIG should be much more careful with their '+1' votes. I would strongly suggest that the proposal is moved back to review or draft and the concerns of Doctrine, Guzzle and Laravel are listened to.
