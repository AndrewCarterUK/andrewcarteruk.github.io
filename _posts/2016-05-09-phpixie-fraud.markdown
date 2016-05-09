---
layout: post
title:  Every second at least 400 planets are scorched into oblivion
date:   2016-05-09 18:00:00
categories: programming
---

# 95% of PHPixie Installs on Packagist are Fraudulent

## Background

To be transparent, I have already a run-in with Roman Tsjupa (the author of PHPixie, aka dracony) after I outed him for using [sock-puppet accounts on reddit](https://gist.github.com/AndrewCarterUK/96bf6fae02ef8b93f93b) to manipulate votes and opinion. 

The other day he posted [this tweet](https://twitter.com/dracony_gimp/status/727790568420585472) claiming that PHPixie had just received 40 GitHub stars in 24 hours. Knowing his character, I checked and found that, sure enough, all of the accounts were obvious bots that had been registered on that very day and starred only PHPixie projects ([proof 1](http://web.archive.org/web/20160505151735/https://github.com/PHPixie/Project/stargazers), [proof 2](http://web.archive.org/web/20160505151948/https://github.com/khalilschimmel)). These accounts have since been deleted as I reported them to GitHub.

This got me thinking, how far does PHPixie take the deception and fraud? I had always been suspicious of the number of installs that the project claimed, given that the community is pretty inactive and there is only really one project contributor.

## Packagist Fraud

As I am writing this, the project comes second on Packagist searches for 'framework' (behind Laravel) and 'orm' (behind Doctrine) - with close to 100,000 downloads on many of its active repositories.

Suspecting the obvious, I set up a [small script](https://gist.github.com/AndrewCarterUK/038c84082a4d5ab6fd8c129786827ac7) to collect some data that I could use to compare the install pattern to those of well known frameworks. The graph below shows the results of this analysis. The downloads figure has been normalised so that the frameworks can be easily compared.

![PHPixie downloads versus other frameworks](https://res.cloudinary.com/andrewcarteruk/image/upload/v1462803037/phpixie_rr1cso.png)

As you can see, every day at around 2AM the number of downloads jumps significantly then flat lines. Packagist does implement some protection against this type of fraud. I am not going to go into detail about what this protection is, but let it suffice to say that this install pattern can only be explained by _someone_ actively attempting to bypass this proection. In other words, 2000 fully functional tests on a cron job **would not** affect the install statistics.

## Doing the Math

Packagist has a helpful API for extracting daily installs and the [PHPixie data can be found here](http://web.archive.org/web/20160509134416/https://packagist.org/packages/phpixie/framework/stats/all.json?average=daily) in JSON format.

As you can see, there have been some days where the scripts have not been run. On these days, there are 2-10 installs rather than 1000-2000. This could just be because a laptop or computer was turned off rather than left on over night. For whatever reason, it gives us an indication of how many actual downloads the PHPixie project should have.

By doing a back of the notepad calculation, using the number 5 to replace the install count on days when the scripts have run, I estimate that over 95% of PHPixie installs have been faked.
