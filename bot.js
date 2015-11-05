'use strict';

var Twit = require('twit');
var T = new Twit({
  consumer_key:        process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
  access_token:        process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// When tweeting from local machine.
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

// Tweet on a regular schedule.
var timesToTweetPerDay = 6;

setInterval(function () {
  try {
    tweet();
  }
  catch (e) {
    console.log(e);
  }
}, (1000 * 60 * 60 * 24) / timesToTweetPerDay) ;

// Tweet once on initialization
tweet();
