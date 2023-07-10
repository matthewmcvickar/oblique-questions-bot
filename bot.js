import * as dotenv from 'dotenv'; dotenv.config();
import { login } from 'masto';
import { loadJsonFileSync } from 'load-json-file';

// The main process. Get a question and post it.
async function doPost() {
  const question = await getQuestion();
  console.log('📚 ❓ 🤖 🚀\n\nTrying to post "' + question + '" to Mastodon…');
  return await postToMastodon(question);
}

// Post!
doPost();

/* --- */

// Access Mastodon.
function accessMastodon() {
  return login({
    url: 'https://botsin.space',
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
  });
};

// Get a random question.
async function getQuestion() {
  const questions = await loadJsonFileSync('./data/questions-corpus.json');
  const numberOfQuestions = Object.keys(questions).length;
  return questions[Math.floor(Math.random()*numberOfQuestions)].toString();
}

// Post the question.
async function postToMastodon(thePostToPost) {
  if (thePostToPost) {
    console.log('NOW ATTEMPTING TO POST:', thePostToPost);

    const masto = await accessMastodon();

    // console.log('LOGGING IN TO MASTODON:', masto);

    const status = await masto.v1.statuses.create({
      status: thePostToPost,
      visibility: 'public'
    });

    // console.log('RESULT OF ATTEMPT TO POST:', status);

    if (status.id !== 'undefined') {
      console.log('SUCCESSFULLY POSTED TO MASTODON: ', status.url);
    }
    else {
      console.log('ERROR POSTING:', status);
    }
  }
  else {
    console.log('ERROR: No question retrieved; cannot post.');
  }
}
