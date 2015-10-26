---
layout: post
title:  The Command Pattern and the __invoke Magic Method
date:   2015-20-26 20:00:00
categories: programming php
---

Recently I've been working alot with PSR-7 middleware. Most libraries for working with PSR-7 middleware share a similar method signature, which is some variation of this:

```php
function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next)
{
    // do something with $request, $response and possibly $next
    return $response;
}
```

As the main purpose of the class is to perform an action on the incoming request, using the `__invoke` magic method provides a couple of benefits.

Firstly, it can be easily replaced with a callable, such as this:

```php
function (ServerRequestInterface $request, ResponseInterface $response, callable $next) {
    // do something with $request, $response and possibly $next
    return $response;
}
```

This is pretty useful for testing, and it's also pretty common to see this used in micro-frameworks.

The second benefit is that it clearly signifies the intention and usage of the class, that this class performs a single action.

The danger of creating and using command classes like this is that the ability to enforce adherence to an interface is lost. If you typehint against `callable`, you cannot easily guarantee the structure of the method or callback that you are about to call.
