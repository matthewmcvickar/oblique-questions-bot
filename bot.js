import * as dotenv from 'dotenv'; dotenv.config();
import { login } from 'masto';
import { loadJsonFileSync } from 'load-json-file';

// Import questions JSON file.
const questions = loadJsonFileSync('./data/questions-corpus.json');
const numberOfQuestions = Object.keys(questions).length;

// Access Mastodon.
const masto = (async () => {
  await login({
    url: 'https://botsin.space',
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
  });
});

// The main process. Get a useable comment and post it or try again.
export function createAndPost() {
  return post(getQuestion());
}

// Get a random question.
function getQuestion() {
  return questions[Math.floor(Math.random()*numberOfQuestions)].toString();
}

// Post the question.
async function post(thePostToPost) {
  if (typeof(thePostToPost) !== 'undefined') {
    console.log('NOW ATTEMPTING TO POST:', thePostToPost);

    // Mastodon.
    const status = await masto.v1.statuses.create({
      status: thePostToPost,
      visibility: 'public'
    });

    if (status.id !== 'undefined') {
      console.log('SUCCESSFULLY POSTED TO MASTODON: ' . status.uri);
    }
    else {
      console.log('ERROR POSTING:', status);
    }
  }
  else {
    console.log('ERROR: No post created; cannot post.');
  }
}
