---
layout: post
title: Dealing with Needlephobia using Machine Learning
date: 2021-12-21
categories: programming
excerpt: How to create a Google Chrome extension that protects you from pictures of needles on the internet.
---

# Dealing with Needlephobia using Machine Learning

Recently, news websites have been overloaded with images of people getting vaccinated. As a needlephobe, this invasion of my [safe space](https://www.youtube.com/watch?v=sXQkXXBqj_U) has not gone unnoticed. Previously I thought that this news cycle might soon pass, but I have come to realise that we will be talking about vaccinations and boosters for a while yet.

This left me with two options:

1. Face my fears, confront my needlephobia and work on being able to rationally handle the concept of an injection
2. Find a way to hide images of needles when I'm browsing the internet so that I can continue living as before without self improvement

Naturally, the second option was far more appealing.

## The Plan

A good first step for any software project is to break the problem that you are trying to solve down into smaller problems. In this case, there are two clear problems which require solving.

The first problem is that I need some software that can look at an image and detect whether or not it is an image of a needle. This is an [image classification](https://cs231n.github.io/classification/) problem, and these problems used to be [very difficult to solve](https://xkcd.com/1425/). However, recent advances in the field of machine learning have made creating and using image classification models quite easy.

The second problem is that I need some software that can find, test and hide images of needles that I encounter on the internet. The BBC news website is _by far_ the most common source of offending images in my life, so I considered making a proxy website for my own personal use that could filter out images according to the classification model (I even came up with a name: Needle Free BBC). This would have the advantage of being easily available on all of my devices, but the disadvantage of limiting the operational to a single website. I ended up deciding that a browser plugin was a more complete solution.

## Building the Model

Image classification is a supervised machine learning problem. In the simplest terms, I need to start with a dataset and a mathematical function that accepts an image and return a prediction (a _model_).

My dataset needs to contain images of things that are needles and also things that are not needles. Then I can test my model against images my dataset and see how well it does. At the start it wont do very well, the predictions that it makes will be as good as random guesses. However, I can use calculus to work out how I need to change the model so it gives better predictions on the dataset. If I repeat this process enough times, then eventually I will end up with a model that does a lot better than random. This is called _training_. The more images I have in my dataset, the better my model will be.

<iframe width="560" height="315" src="https://www.youtube.com/embed/R9OHn5ZF4Uo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The more astute readers will have noticed my first predicament: How does someone with needlephobia gather a big dataset of images that contain needles?

![gru meme](https://i.imgflip.com/5yofow.jpg)

The call was marginal, but I decided it would be preferable to consolidate all of my needle viewing into a few hours, rather than have such images randomly pop up in my safe space for years to come. My combined dataset (training and validation) contained 966 images, of those 548 were of needles. Doing this gathering made me feel pretty sick, and I'm pretty glad that part of the project is done.

Images of needles is also a pretty broad category. The images in my dataset were primarily photos of people receiving injections as these bother me the most.

I also cheated a bit when building my model. Training a good image classification model from scratch requires a huge amount of data. You can get a head start by using a pre-trained image classification model and then adding some extra layers on the end which you train against your own dataset. A reasonable mental model of this is that the pre-trained image classification already knows how to "see", and we then teach it how to see needles.

## Building the Plugin

The classification model I built was written using Tensorflow in Python, but this isn't a language that you can use to build extensions for Google Chrome; instead you have to use Javascript. Thankfully, [Tensorflow.js](https://www.tensorflow.org/js) exists; and it was not too difficult to export my model to a format that I could use in this environment.
