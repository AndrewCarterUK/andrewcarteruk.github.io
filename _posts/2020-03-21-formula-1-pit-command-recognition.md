---
layout: post
title: Using Machine Learning to Recognise Formula 1 Team Radio Commands
date: 2020-03-21 17:00:00
categories: programming
excerpt: Using Keras to recognise the "box box" instruction given on a Formula 1 team radio.
draft: true
---

<div style="width: 560px; margin-left: auto; margin-right: auto;"><iframe width="560" height="315" src="https://www.youtube.com/embed/zc3JYvvmXxw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

## Introduction

The video above shows an exciting sequence from the 2019 Chinese Grand Prix held in Shanghai. Each team has two cars, but only a single pit crew and this can create restrictions on strategy. In true Formula 1 style, some of the more skilled teams have become proficient at a technique called "double stacking", where they pit the cars in quick succession one after the other. In this example, the Mercedes team manages to change 8 tyres on 2 cars in a time period of less than 10 seconds.

Now that is all very exciting, but this article is more interested with the team radio instructions that can be heard within the first 8 seconds of the video.

![team radio signal chinese gp](/images/box-box/chinese-gp-2019-box-box-signal.png)

The image above shows the signal, with the regions of the signal containing the "box box" instruction highlighted. This is the instruction that a team will issue over the radio to indicate to a driver that they must enter the pits. Discussion online suggests that the origins of this instruction might be from the German word "Boxenstopp", but it may also may refer to "pit box" which is the terminology used to describe the area where the race car must stop. A potential alternative instruction "pit pit", is probably not as clear to a driver who may be travelling over 300 km/h at the time. The instruction is repeated multiple times incase there is an interruption in the transmission.

Thanks to technical regulation 8.7 (driver radio must be open and accessible to both the FIA and broadcasters), teams can listen to each others transmissions. This article describes the process of using Machine Learning to build a proof of concept program that could detect the "box box" instruction from a live audio feed, in the hope that automated early detection of this instruction may provide an operational advantage to a Formula 1 team.

## Keyword Spotting with CNNs

The architecture used in this program has been taken from the primary source paper [Convolutional Neural Networks for Small-footprint Keyword Spotting](https://www.isca-speech.org/archive/interspeech_2015/papers/i15_1478.pdf). A brief description of the approach is to create a spectrogram of the input signal and turn a speech recognition task into an image classification one.

A spectrogram is a two dimensional representation of a signal, where the dimensions are time and frequency. As the representation of the signal is two dimensional, the best network will be one that exploits this geometry. Convolutional Network Networks (CNNs) have been used for this purpose in image classification tasks for some time now.

The representation in the frequency domain is more complex then the output from a fast fourier transform (FFT). The reason for this is that the human ear does not perceive sound in a linear manner. If the chosen representation in the frequency domain presents the difference between a 1 kHz signal and a 2 kHz signal in the same way that it presents the difference between a 11 kHz signal and a 12 kHz signal, then it is not a suitable representation. The human ear would hear a large difference between the first signal pair and a smaller difference between the second, however an FFT would not emphasise the difference between these cases.

For speech recognition tasks it is common to use either log mel-filterbank energies or Mel Frequency Ceptral Coefficients (MFCCs) as a representation in the frequency domain. [This article](https://haythamfayek.com/2016/04/21/speech-processing-for-machine-learning.html) goes into more depth about these processing techniques and their differences.

An example spectrogram for the "box box" command is shown below. 

![team radio spectrogram chinese gp](/images/box-box/chinese-gp-2019-box-box-spectrogram.png)

## Building the Network

[Keras](https://keras.io/) has a simple and expressive API for building powerful networks. The network described in the [primary source paper](https://www.isca-speech.org/archive/interspeech_2015/papers/i15_1478.pdf) can be easily transcribed to a few lines of python code:

{% highlight python %}
model = Sequential()
model.add(Conv2D(64, (20, 8), activation='relu', input_shape=input_shape))
model.add(MaxPooling2D(pool_size=(1, 3)))
model.add(Dropout(dropout))
model.add(Conv2D(64, (10, 4), activation='relu'))
model.add(Dropout(dropout))
model.add(Flatten())
model.add(Dense(32, activation='relu'))
model.add(Dropout(dropout))
model.add(Dense(128, activation='relu'))
model.add(Dropout(dropout))
model.add(Dense(num_classes, activation='softmax'))

sgd = SGD(learning_rate=0.001)

model.compile(loss='categorical_crossentropy', optimizer=sgd)
{% endhighlight %}

Creating the model as it is shown above does not make the tuning of hyperparameters easy, and I prefer to use configuration files to maintain flexibility.

The class method shown below has been taken from the [System](https://github.com/AndrewCarterUK/box-box/blob/master/boxbox/system.py) class of the project, and it builds the model in a more flexible manner. It also allows for [dropout layers](https://machinelearningmastery.com/dropout-for-regularizing-deep-neural-networks/) to be inserted during training. 

{% highlight python %}
class System:
    # ...

    def init_model(self, model_config, training_params=None):
        """Initialise the keras model"""

        self.model = Sequential()

        # Dropout may be specified in the training parameters
        dropout = 0 if training_params is None else training_params['dropout']

        # Add the convolution layers using the model config
        for layer in model_config['convolution_layers']:
            if len(self.model.layers) == 0:
                self.model.add(Conv2D(layer['filter']['n'], (layer['filter']['m'], layer['filter']['r']), activation='relu', input_shape=self.input_shape))
            else:
                self.model.add(Conv2D(layer['filter']['n'], (layer['filter']['m'], layer['filter']['r']), activation='relu'))

            # Optional pooling layer
            if 'pool' in layer:
                self.model.add(MaxPooling2D(pool_size=(layer['pool']['p'], layer['pool']['q'])))

            if dropout > 0:
                self.model.add(Dropout(dropout))

        self.model.add(Flatten())

        # Add in the DNN layers
        for hidden_layer in model_config['hidden_layers']:
            self.model.add(Dense(hidden_layer, activation='relu'))

            if dropout > 0:
                self.model.add(Dropout(dropout))

        # Softmax activation for output layer
        self.model.add(Dense(len(self.model_labels), activation='softmax'))

        # If training params are specified, compile the model with an optimizer
        if training_params is not None:
            sgd = SGD(learning_rate=training_params['learning_rate'], momentum=training_params['momentum'], nesterov=training_params['nesterov'])

            self.model.compile(loss='categorical_crossentropy', optimizer=sgd)
{% endhighlight %}

The JSON configuration files shown below can now be used to tweak the hyperparameters of the network. As the [primary source paper](https://www.isca-speech.org/archive/interspeech_2015/papers/i15_1478.pdf) describes a number of possible network configurations, this setup allows them all to be easily tested without changing the code. The variables `m`, `r`, `n`, `p` and `q` are defined in the [primary source paper](https://www.isca-speech.org/archive/interspeech_2015/papers/i15_1478.pdf). The architecture used in this project is referred to within as `cnn-trad-fpool3`, and shown in the configuration below.

{% highlight C %}
{
  // Extract from system.json
  "model": {
    "convolution_layers": [
      {
        "filter": {
          "m": 20,
          "r": 8,
          "n": 64
        },
          "pool": {
          "p": 1,
          "q": 3
        }
      },
      {
        "filter": {
          "m": 10,
          "r": 4,
          "n": 64
        }
      }
    ],
    "hidden_layers": [32, 128]
  }
}
{% endhighlight %}

{% highlight C %}
{
  // Extract from dataset.json
  "training": {
    "settings": {
      "dropout": 0.3,
      "learning_rate": 0.01,
      "momentum": 0,
      "nesterov": false
    }
  }
}
{% endhighlight %}

Given the length of time required for a human to say "box box", a clip duration of 1 second was selected. The spectrogram configuration used was 40 bins in 30ms windows with 10ms strides. This results in a spectrogram image size of 98x40 pixels.

{% highlight C %}
{
  // Extract from system.json
  "clip": {
    "duration": 1,
    "sample_rate": 16000
  },
  "spectrogram": {
    "window_size": 0.03,
    "window_stride": 0.01,
    "bins": 40
  }
}
{% endhighlight %}

## Training Data

The network can be trained to recognise "known words", but for the task of keyword spotting we must also teach it how to recognise words that it does not know ("unknown words") and background noise.

I explained this to my partner by having her imagine teaching a young child to recognise a picture of a Ferarri. If the child had only ever seen pictures of Ferarris before, and none of other cars, then when shown a picture of a Toyota they might mistakenly identify this as a Ferarri (as both have a windscreen, four wheels, doors and the ability to move). Similarly, if the child had never seen pictures of things that were not cars at all, they might classify a picture of a horse, or even a blank picture, as a car - simply because they never learned what something that was not a car looked like.

A further extension to this train of thought, is to imagine that you have successfully taught the child to differentiate between Ferarris, other cars (e.g. Toyotas, Hondas, Fords) and things that are not cars (e.g. horses or background scenes). How likely would the child be to incorrectly classify a picture of a Lamborghini as a Ferarri? In our example, this would be analogous to words such as "top", "fox", "rocks" and "socks".

Thus, a good keyword spotting dataset will contain samples of:

1. Background noise
2. Words that are not the command words
3. Words that sound similar to the command words
4. The actual command words that you are hoping to eventually identify.

{% highlight C %}
{
  // Extract from system.json
  "labels": {
    "known": ["box", "box-box"],
    "unknown": ["and", "easy", "lap", "lewis", "max", "nico", "the", "fox", "rocks", "top"]
  }
}
{% endhighlight %}

The program lets you configure the ratios at which these other samples are used in the dataset. Too few examples, and the model will overpredict command words. Too many examples, and the model may be reluctant to predict command words.

{% highlight C %}
{
  // Extract from dataset.json
  "training": {
    "batch_size": 100,
    "ratios": {
      "silence": 0.2,
      "unknown": 0.2
    }
  }
}
{% endhighlight %}

To prevent overfitting, the program has a number of tricks for augmenting the dataset and artificially expanding the size of it. The first of these tricks is mixing in background noise and randomising the volume of the foreground sample and background noise during this process.

The second trick is to modify the offset of the clip, by either moving the signal forwards (padding the front and clipping the rear) or backwards (clipping the front and padding the rear).

The third and final trick is to modify the pitch of the clip. This is done rather crudely by performing a FFT, translating the spectrum slightly in either direction and then performing an inverse FFT.

The behaviour of this preprocessing is modifiable within the dataset configuration file. The [AudioPreprocessor](https://github.com/AndrewCarterUK/box-box/blob/master/boxbox/audio_preprocessor.py) class uses the [numpy library](https://numpy.org/) to perform these operations.

{% highlight C %}
{
  // Extact from dataset.json
  "training": {
    "preprocess": {
      "foreground": {
        "volume": {
          "mean": 1,
          "stddev": 0.2
        }
      },
      "background": {
        "pattern": "background/*.wav",
        "volume": {
          "mean": 0.5,
          "stddev": 0.2
        }
      },
      "resample": {
        "offset": {
          "mean": 0,
          "stddev": 0.05
        },
        "pitch": {
          "mean": 1,
          "stddev": 0.01
        }
      }
    }
  }
}
{% endhighlight %}

## Making Predictions

For this demonstration, the program has been split into two parts. The first, referred to as the Audio Server, connects to a local audio input device (such as a microphone) using [PyAudio](https://people.csail.mit.edu/hubert/pyaudio/docs/#) and broadcasts audio samples to a connected client. The code for this is contained within [audio_server.py](https://github.com/AndrewCarterUK/box-box/blob/master/boxbox/command/audio_server.py).

![server](/images/box-box/server.png)

The second part of the program, the Detector, performs a rolling log-mel filterbank translation on the samples as they are received. These spectrograms are then continuously fed into a trained network to make predictions. If the known words are spotted, then a callback is triggered. Currently, the callback only triggers a message being output to the console.

The [Detector](https://github.com/AndrewCarterUK/box-box/blob/master/boxbox/command/detector.py) class contains the code for this part of the process, and the methods of interest are shown below.

{% highlight python %}
class Detector:
    # ...

    def process(self, signal):
        """Process data received from the audio server"""

        # Convert the signal to a spectrogram that can be used with the model
        frames = self.system.convert_signal(signal)

        # Add the frames from the spectrogram to a queue
        self.frame_queue = np.concatenate((self.frame_queue, frames))

        # Process the frame queue
        self.make_predictions()

    def make_predictions(self):
        """Process the frame queue and calculate the model predictions"""

        # Create an empty X tensor
        X = np.empty((0, self.system.spectrogram_length, self.system.bins, 1))

        # If we haven't got enough frames for a full spectrogram, no point going further
        if len(self.frame_queue) < self.system.spectrogram_length:
            return

        # Build X by running a window through the available spectrogram frames, dequeing a frame with each pass
        while len(self.frame_queue) >= self.system.spectrogram_length:
            X = np.append(X, [self.frame_queue[:self.system.spectrogram_length]], 0)
            self.frame_queue = self.frame_queue[1:]

        # Run X through the model
        Y = self.system.model.predict(X)

        for probabilities in Y:
            predictions = self.system.map_probability_vector(probabilities)

            # Run through all the known labels checking the probabilities
            for known_label in self.system.known_labels:
                last_detection = self.last_detections[known_label]

                # Skip the label if we have recently triggered the detection callback for it
                if time() - last_detection < self.detection_standoff_time:
                    continue

                if predictions[known_label] > self.trigger_probability:
                    # Invoke the callback on trigger
                    self.detection_callback(known_label, predictions[known_label])

                    # Record the time of the detectino
                    self.last_detections[known_label] = time()

    # ...
{% endhighlight %}

## Summary

The [source code for this project can be found on GitHub](https://github.com/AndrewCarterUK/box-box). The (very limited) dataset that I have created is available [via a Google Drive download link](TODO). As the dataset only contains samples captured using a single microphone and spoken by a single person (me), it is unlikely others will achieve the same results that I have without retraining on a larger dataset. The checkpoint a model trained on the dataset is also available [via a Google Drive download link](TODO). If you just wish to run the detector, you only need to download the checkpoint and not the whole dataset.

If you found this article interesting, you may also be interested in a previous article on this blog titled [Annotating Large Datasets with the TensorFlow Object Detection API](/programming/2018/01/24/annotating-large-datasets-with-tensorflow-object-detection-api.html). In this article, I use images of Formula 1 cars to demonstrate how primitive machine learning models can be helpful when approaching the task of annotating large datasets.
