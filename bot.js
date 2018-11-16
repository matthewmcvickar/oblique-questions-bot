'use strict';

// Change this to `true` to post to the web
// when you run this script locally.
var canPostFromLocal = false;

// Load libraries.
var Twit = require('twit');
var Masto = require('mastodon');

// Are we on production? Check if an important environment variable exists.
function isProduction () {
  return (
    typeof(process.env.MASTODON_ACCESS_TOKEN) !== 'undefined' ||
    typeof(process.env.TWITTER_CONSUMER_KEY) !== 'undefined'
  );
}

// Use environment variables if we're on production, config files if we're local.
if (isProduction()) {
  var twitter = new Twit({
    consumer_key:        process.env.TWITTER_CONSUMER_KEY,
    consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
    access_token:        process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var mastodon = new Masto({
    access_token: process.env.MASTODON_ACCESS_TOKEN,
    api_url: 'https://botsin.space/api/v1/'
  });
}
else {
  var mastodon = new Masto(require('./config/mastodon-config.js'));
  var twitter  = new Twit(require('./config/twitter-config.js'));
}

// Get a question and post it!
var questions         = require('./data/questions-corpus.json');
var numberOfQuestions = Object.keys(questions).length;

// Execute and post!
createAndPost();

// The main process. Get a useable comment and tweet it or try again.
function createAndPost () {
  var question = getQuestion();
  return post(question);
}

// Get a random question.
function getQuestion () {
  return questions[Math.floor(Math.random()*numberOfQuestions)].toString();
}

// Post to the web.
function post (data) {
  if (typeof(data) !== 'undefined') {
    console.log('NOW ATTEMPTING TO POST:', data);

    if (isProduction() || canPostFromLocal) {
      // Twitter.
      twitter.post('statuses/update', { status: data }, function (error) {
        if (error) {
          console.log('ERROR POSTING:', error);
        }
        else {
          console.log('SUCCESS!');
        }
      });

      // Mastodon.
      mastodon.post('statuses', { status: data }, function (error) {
        if (error) {
          console.log('ERROR POSTING:', error);
        }
        else {
          console.log('SUCCESS!');
        }
      });
    }
  }
  else {
    console.log('ERROR: No post created; cannot post.');
  }
}

// Note that because Heroku machines restart at least once per day, the bot's
// schedule will not be regular:
// https://devcenter.heroku.com/articles/how-heroku-works#dyno-manager
if (isProduction()) {
  var millisecondsInDay = 1000 * 60 * 60 * 24;
  var timesToPostPerDay = 6;
  var postInterval = millisecondsInDay / timesToPostPerDay;

  setInterval(function () {
    try {
      createAndPost();
    }
    catch (error) {
      console.log('PROCESS UNSUCCESSFUL!', error);
    }
  }, postInterval);
}
