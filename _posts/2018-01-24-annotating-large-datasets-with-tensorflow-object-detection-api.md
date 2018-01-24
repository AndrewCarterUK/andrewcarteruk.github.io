---
layout: post
title:  Annotating Large Datasets with the TensorFlow Object Detection API
date:   2018-01-24 22:00:00
categories: programming
excerpt: Using the TensorFlow Object Detection API to predict annotations for large datasets.
---

![Inferences made by a primitive model looking for race cars](http://res.cloudinary.com/andrewcarteruk/image/upload/v1516747767/TensorFlow%20-%20Race%20Cars/3-boxes.jpg)
_Detections of race cars, after training on a small dataset containing only 60 images_

When building datasets for machine learning object detection and recognition models, generating annotations for all of the images in the dataset can be very time consuming. These annotations are required to train and test a model, and they must be accurate. For this reason, human oversight is required for all of the images in a dataset. However, that does not mean that machine learning models cannot be of assistance.

Checking and correcting a set of mostly correct annotations is generally a less time consuming task than creating a complete set of new annotations. When working on a dataset containing thousands of images, saving a few seconds per image could save several hours of work.

Using the example of detecting race cars in an image, this article will guide through the following steps.

1. Annotating images in a small dataset.
2. Training a primitive model from this dataset.
3. Use this primitive model to predict the annotations on images from a new dataset.

This article has a [repository on GitHub](https://github.com/AndrewCarterUK/tf-example-object-detection-api-race-cars) that contains some example code and data. It will be assumed that the [TensorFlow Object Detection API](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/installation.md) has been installed.

## Annotating Images

An easy format to use for image annotations is the PASCAL VOC file format. This is an XML file format used by [Image Net](http://www.image-net.org/). The [LabelImg](https://github.com/tzutalin/labelImg) program is an excellent tool that can be used to generate and modify annotations of this format.

![Screenshot of LabelImg annotation process](http://res.cloudinary.com/andrewcarteruk/image/upload/v1516749498/TensorFlow%20-%20Race%20Cars/labelImg.png)

The [data directory in the example repository](https://github.com/AndrewCarterUK/tf-example-object-detection-api-race-cars/tree/master/data) shows annotations generated using this method. The [label map file](https://github.com/AndrewCarterUK/tf-example-object-detection-api-race-cars/blob/master/data/map.pbtxt) will need to be created manually, as this is not produced by LabelImg.

## Training the Primitive Model

The [TensorFlow Object Detection API](https://github.com/tensorflow/models/tree/master/research/object_detection) provides detailed documentation on adapting and using existing models with custom datasets.

The basic process for training a model is:

1. Convert the PASCAL VOC primitive dataset to a TFRecord file. The example repository provides a [python script](https://github.com/AndrewCarterUK/tf-example-object-detection-api-race-cars/blob/master/create_pascal_tf_record.py) that can be used to do this.
2. Create an object detection pipeline. The project hosts [official documentation](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/configuring_jobs.md) on how to do this and there is an [example in the repository](https://github.com/AndrewCarterUK/tf-example-object-detection-api-race-cars/blob/master/ssd_mobilenet_v1_coco.config). The example in the repository is based upon the `ssd_mobilenet_v1_coco` checkpoint, there are a number of [provided checkpoints](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/detection_model_zoo.md) that can be downloaded from the official documentation.
3. Train the primitive model. This can be done [locally](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/running_locally.md) or on the [Google Cloud Platform](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/running_on_cloud.md). The results obtained in this article were from around 10,000 steps.
4. [Export the last checkpoint to an inference graph](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/exporting_models.md).

The end result of this process will be a file named `frozen_inference_graph.pb`. This is the model that can be used to predict annotations.

## Predicting Annotations

The [pascal-voc-writer](https://github.com/AndrewCarterUK/pascal-voc-writer) library can be used to generate annotations in the PASCAL VOC file format.

The [`annotate.py` file in the example repository](https://github.com/AndrewCarterUK/tf-example-object-detection-api-race-cars/blob/master/annotate.py) adapts the [inference example from the official documentation](https://github.com/tensorflow/models/blob/master/research/object_detection/object_detection_tutorial.ipynb) to create annotations rather than image visualisations.

The threshold score for an annotation to be produced can be optimised to suit the dataset and the needs of the operator. The threshold score should balance the frequency of unhelpful annotations against the miss rate. If removing unhelpful annotations is easier for the operator than generating missed ones, a lower threshold score should be used to reflect this.

Below are three more predictions from the primitive model. Despite having a very small dataset and only a few training steps, the model has made useful predictions that would save time annotating these images.

![Example 1](https://res.cloudinary.com/andrewcarteruk/image/upload/v1516747767/TensorFlow%20-%20Race%20Cars/2-boxes.jpg)
_In this example two annotations are correctly suggested and one is missed. The suggested annotations on the furthest car could be shrunk slightly._

![Example 2](https://res.cloudinary.com/andrewcarteruk/image/upload/v1516747768/TensorFlow%20-%20Race%20Cars/1-boxes.jpg)
_These images take a long time to annotate manually. The primitive model has done a reasonable job at cutting out the bulk of the workload. It has struggled in the case of some of the obsecured cars, but some of the obscured cars would be difficult for humans to spot._

![Example 3](https://res.cloudinary.com/andrewcarteruk/image/upload/v1516747767/TensorFlow%20-%20Race%20Cars/4-boxes.jpg)
_Both cars are identified, however the bounding box is far too wide for the closest car._
