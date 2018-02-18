---
layout: post
title:  A Beginners Guide to Beating the Bookmakers with TensorFlow
date:   2018-01-24 22:00:00
categories: programming
excerpt: Using the TensorFlow Estimator API to make match predictions that beat the bookmakers.
---

<table>
  <tr>
    <td>
      <img src="https://res.cloudinary.com/andrewcarteruk/image/upload/v1518978956/TensorFlow%20-%20Bookmakers/alan.png" alt="Alan" />
    </td>
    <td>
      <blockquote>
        It says here we should use TensorFlow. Apparently we can use a Deep Neural Network to predict the outcome of football (soccer) matches. Who wants to help me collect training data?
      </blockquote>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://res.cloudinary.com/andrewcarteruk/image/upload/v1518978956/TensorFlow%20-%20Bookmakers/doug.png" alt="Doug" />
    </td>
    <td>
      <blockquote>
        I don't think you should be doing so much gambling tonight Alan.
      </blockquote>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://res.cloudinary.com/andrewcarteruk/image/upload/v1518978956/TensorFlow%20-%20Bookmakers/alan.png" alt="Alan" />
    </td>
    <td>
      <blockquote>
        Gambling? Who said anything about gambling? It's not gambling if you know you're going to win? Deep Neural Networks are a foolproof system.  
      </blockquote>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://res.cloudinary.com/andrewcarteruk/image/upload/v1518978956/TensorFlow%20-%20Bookmakers/stu.png" alt="Stu" />
    </td>
    <td>
      <blockquote>
        It's also illegal.
      </blockquote>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://res.cloudinary.com/andrewcarteruk/image/upload/v1518978956/TensorFlow%20-%20Bookmakers/alan.png" alt="Alan" />
    </td>
    <td>
      <blockquote>
        It's not illegal, it's frowned upon. Like mining bitcoin on visitors web browsers.
      </blockquote>
    </td>
  </tr>
</table>

My pitch for a remake of The Hangover didn't go down very well, but hopefully the research I did for the script will still be useful to someone.

This article explains how to use the [TensorFlow Estimator API](https://www.tensorflow.org/api_docs/python/tf/estimator) to create a simple Deep Neural Network (DNN) that makes predictions about football (soccer) matches. It will assume that you have [installed TensorFlow](https://www.tensorflow.org/install/) and are familiar with the Python language.

There is a corresponding [GitHub repository](https://github.com/AndrewCarterUK/football-predictor) containing the complete code that will be referenced throughout.

## What is a Deep Neural Network (DNN)?

The critical thing for a beginner to understand about a DNN model, is that it is a function. Its purpose is to map a series of input variables to an output. When we train our model, we provide a large number of examples where we know all of the input variables **and** the desired output. By analysing how bad our model is at predicting the desired output, we can use some crazy calculus to modify its neurons and make it less bad at making predictions.

Now that you're a cool kid reading articles about machine learning on the internet, you'll need to catch up with all the lingo:
- The input variables to our model are called **features**.
- The desired output in our training data are **labels**.
- This type of problem, where our training data is labelled, is a **supervised learning problem**.

## Our Test Data

A quick google search for "football data" returns a link to [football-data.co.uk](http://www.football-data.co.uk/englandm.php) - who would have thought?

Looking only at the English Premier League results, I squished about 9 and a half seasons of data into a [single CSV file](https://github.com/AndrewCarterUK/football-predictor/blob/master/data/book.csv). The file contains loads of useful fields, including goals, shots, shots on target, bookmaker odds and more. Football Data also provide a [column key for the data](http://www.football-data.co.uk/notes.txt).

The [dataset.py](https://github.com/AndrewCarterUK/football-predictor/blob/master/dataset.py) script shows how this file is loaded.

The `get_dataset(file_path)` function converts the CSV data to an array of dictionaries containing the following keys. Not all of the results in the dataset can be used, as there needs to have been 5 games of history for each team before the statistics can be calculated.

```python
[{
  'result': 'H', # Could be H, D or A (for home team win, draw or away team win)
  'odds-home': 1.6, # Decimal odds from Bet365 on a home team win
  'odds-draw': 4.8, # Decimal odds from Bet365 on a draw
  'odds-away': 6.0, # Decimal odds from Bet365 on an away team win
  'home-win': 3, # Number of wins by the home team in the last 5 games
  'home-lose': 1, # Number of losses by the home team in the last 5 games
  'home-draw': 1, # Number of draws by the home team in the last 5 games
  'home-goals': 8, # Number of goals scored by the home team in the last 5 games
  'home-goals-conceeded': 6, # Number of goals conceeded by the home team in the last 5 games
  'home-shots': 68, # Number of shots made by the home team in the last 5 games
  'home-shots-conceeded': 53, # Number of shots conceeded by the home team in the last 5 games
  'home-shots-accuracy': 0.43, # Accuracy (% shots on target) by the home team in the last 5 games
  'home-shots-accuracy-conceeded': 0.56, # Accuracy (% shots on target) by other teams against the home team in the last 5 games
  'away-win': 2, # Number of wins by the away team in the last 5 games
  'away-lose': 1, # Number of losses by the away team in the last 5 games
  'away-draw': 2, # Number of draws by the away team in the last 5 games
  'away-goals': 8, # Number of goals scored by the away team in the last 5 games
  'away-goals-conceeded': 6, # Number of goals conceeded by the away team in the last 5 games
  'away-shots': 68, # Number of shots made by the away team in the last 5 games
  'away-shots-conceeded': 53, # Number of shots conceeded by the away team in the last 5 games
  'away-shots-accuracy': 0.43, # Accuracy (% shots on target) by the away team in the last 5 games
  'away-shots-accuracy-conceeded': 0.56, # Accuracy (% shots on target) by other teams against the away team in the last 5 games
]}
```

## Classification or Regression

The next step is to look at the options available for the type of predictions our model will make. In this regard, there are two primary model types, and they are known as **classification** or **regression** models.

A classification model will output probabilities that the input matches a set of classes. An example of this would be using biometric measurements to predict whether a subject was of class male or female. Here, the output from our model would be two variables - the probability that the subject was male and the probability that the subject was female. All classification probabilities in a prediction sum to one.

A regression model outputs a continuous variable (or a vector of continuous variables). An example of this would be using house features (such as location, size and bedrooms) to predict house price.

We are going to use a classification model. Our three available classes will be home win `H`, draw `D` and away win `A`. If the output from our model for a given set of features was `[0.23, 0.65, 0.12]`, that would correspond to a prediction that there was a 23% chance of the home team winning, a 65% chance of a draw and a 12% chance of the away team winning.

This model choice means that we will be using the [TensorFlow DNNClassifier class](https://www.tensorflow.org/api_docs/python/tf/estimator/DNNClassifier). If we were solving a regression problem, we would use the [TensorFlow DNNRegressor class](https://www.tensorflow.org/api_docs/python/tf/estimator/DNNRegressor).

There are [other classification and regression classes available from the TensorFlow Estimator API](https://www.tensorflow.org/api_docs/python/tf/estimator#Classes). Some of these use linear mathematical models and some use linear models in combinations with DNNs. It is well worth investigating and understanding these, but none of them sound as cool as Deep Neural Network on your LinkedIn portfolio, so we will skip them for now.

## Features

Google Developers did an excellent [blog post explaining TensorFlow Feature Columns](https://developers.googleblog.com/2017/11/introducing-tensorflow-feature-columns.html) that goes into far more detail about the options available than this article will.

Our model will only use the `numeric_column` type that is provided, but there are others available (such as a category type).

The `DNNClassifier` class we mentioned earlier requires an array of feature columns to be provided. Looking above to the test data section, we have quite a few features available to select.

Removing the result field (that's going to be the **label**) and the odds fields, we are left with the following feature columns:

```python
feature_columns = [
  tf.feature_column.numeric_column(key='home-win'),
  tf.feature_column.numeric_column(key='home-lose'),
  tf.feature_column.numeric_column(key='home-draw'),
  tf.feature_column.numeric_column(key='home-goals'),
  tf.feature_column.numeric_column(key='home-goals-conceeded'),
  tf.feature_column.numeric_column(key='home-shots'),
  tf.feature_column.numeric_column(key='home-shots-conceeded'),
  tf.feature_column.numeric_column(key='home-shots-accuracy'),
  tf.feature_column.numeric_column(key='home-shots-accuracy-conceeded'),
  tf.feature_column.numeric_column(key='away-win'),
  tf.feature_column.numeric_column(key='away-lose'),
  tf.feature_column.numeric_column(key='away-draw'),
  tf.feature_column.numeric_column(key='away-goals'),
  tf.feature_column.numeric_column(key='away-goals-conceeded'),
  tf.feature_column.numeric_column(key='away-shots'),
  tf.feature_column.numeric_column(key='away-shots-conceeded'),
  tf.feature_column.numeric_column(key='away-shots-accuracy'),
  tf.feature_column.numeric_column(key='away-shots-accuracy-conceeded'),
]
```

## Connecting it all Together

```python
model = tf.estimator.DNNClassifier(
  model_dir='model/',
  hidden_units=[10],
  feature_columns=feature_columns,
  n_classes=3,
  label_vocabulary=['H', 'D', 'A'])
```

This is where we create our model object. The `model_dir` parameter is used to save training progress so that you don't have to retrain your model every time you want to make a prediction. The `hidden_units` parameter describes the shape of the neural network, `[10]` corresponds to one hidden layer with 10 neurons in it. We define the output that we expect from our model with `n_classes` and `label_vocabulary`. Here we state that the three classes our model will analyse are labelled by `H`, `D` or `A`.

We can train our model using the `train()` method. A model can be trained indefinitely, but with diminishing returns. Different models descend at different rates, so it is important to watch the loss function to see if and when it has converged (and stopped descending).

```python
model.train(input_fn=train_input_fn, steps=1000)
```

The `input_fn` parameter is used to provide training data to the model. There are lots of clever ways to feed data into a model, but using `numpy` arrays is pretty quick and easy:

```python
train_input_fn = tf.estimator.inputs.numpy_input_fn(
  x=train_features,
  y=train_labels,
  batch_size=500,
  num_epochs=None,
  shuffle=True
  )
```

In the example above, with only 3 training examples, `train_features` and `train_labels` would have the structure shown below. The keys of `train_features` should correspond to the key used when creating the feature column.

```python
train_features = {
  'home-goals': np.array([7, 3, 4]),
  'home-goals-conceeded': np.array([3, 8, 6]),
  // ... for each feature
}

train_labels = np.array(['H', 'D', 'A'])
```
