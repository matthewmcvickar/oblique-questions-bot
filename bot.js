'use strict';

var Twit = require('twit');
var T = new Twit({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
  access_token:        process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// When working locally.
// var T = new Twit(require('./config.js'));

var questions         = require('./data/questions-corpus.json');
var numberOfQuestions = Object.keys(questions).length;

function getQuestion() {
  return questions[Math.floor(Math.random()*numberOfQuestions)];
}

function tweet() {
  var theQuestion = getQuestion();

  T.post('statuses/update', { status: theQuestion }, function(err) {
    if (err) {
      console.log('error:', err);
    }
  });
}

// Tweet six times a day.
setInterval(function () {
  try {
    tweet();
  }
  catch (e) {
    console.log(e);
  }
}, 1000 * 60 * 60 * 4);
// Formula: milliseconds in a second * 60 seconds * 60 minutes * 4 hours.

// Tweet once on initialization
tweet();
