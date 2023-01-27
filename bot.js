const Masto = require('masto');
const questions = require('./data/questions-corpus.json');

// The main process. Get a useable comment and post it or try again.
export function createAndPost() {
  return post(getQuestion());
}

// Change this to `true` to post to the web when you run this script locally.
const canPostFromLocal = false;

// Are we on production? Check if an important environment variable exists.
const isProduction = () => {
  return (
    typeof(process.env.MASTODON_ACCESS_TOKEN) !== 'undefined'
  );
}

// Use environment variables if we're on production, config files if local.
const twitter = {};
const mastodon = {};

if (isProduction()) {

  mastodon = new Masto({
    access_token: process.env.MASTODON_ACCESS_TOKEN,
    api_url: 'https://botsin.space/api/v1/'
  });
}
else {
  mastodon = new Masto(require('./config/mastodon-config.js'));

}

// Get a random question.
const numberOfQuestions = Object.keys(questions).length;
const getQuestion = () => {
  return questions[Math.floor(Math.random()*numberOfQuestions)].toString();
}

// Post to the web.
const post = (thePostToPost) => {
  if (typeof(thePostToPost) !== 'undefined') {
    console.log('NOW ATTEMPTING TO POST:', thePostToPost);

    if (isProduction() || canPostFromLocal) {
      // Mastodon.
      mastodon.post('statuses', { status: thePostToPost }, function (error) {
        if (error) {
          console.log('ERROR POSTING:', error);
        }
        else {
          console.log('SUCCESSFULLY POSTED TO MASTODON!');
        }
      });
    }
  }
  else {
    console.log('ERROR: No post created; cannot post.');
  }
}

// if (isProduction()) {
//   var millisecondsInDay = 1000 * 60 * 60 * 24;
//   var timesToPostPerDay = 6;
//   var postInterval = millisecondsInDay / timesToPostPerDay;

//   setInterval(function () {
//     try {
//       createAndPost();
//     }
//     catch (error) {
//       console.log('POSTING UNSUCCESSFUL!', error);
//     }
//   }, postInterval);
// }
