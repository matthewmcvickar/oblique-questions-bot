import * as dotenv from 'dotenv'; dotenv.config();
import { login } from 'masto';
import { loadJsonFileSync } from 'load-json-file';

// The main process. Get a question and post it.
export function doPost() {
  return postToMastodon(getQuestion());
}

// Access Mastodon.
async function accessMastodon() {
  return await login({
    url: 'https://botsin.space',
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
  });
};

// Get a random question.
const questions = loadJsonFileSync('./data/questions-corpus.json');
const numberOfQuestions = Object.keys(questions).length;
function getQuestion() {
  return questions[Math.floor(Math.random()*numberOfQuestions)].toString();
}

// Post the question.
async function postToMastodon(thePostToPost) {
  if (typeof(thePostToPost) !== 'undefined') {
    console.log('NOW ATTEMPTING TO POST:', thePostToPost);

    const masto = await accessMastodon();
    const status = await masto.v1.statuses.create({
      status: thePostToPost,
      visibility: 'public'
    });

    if (status.id !== 'undefined') {
      console.log('SUCCESSFULLY POSTED TO MASTODON: ', status.url);
    }
    else {
      console.log('ERROR POSTING:', status);
    }
  }
  else {
    console.log('ERROR: No post created; cannot post.');
  }
}
