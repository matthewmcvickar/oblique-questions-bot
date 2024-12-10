import * as dotenv from 'dotenv'; dotenv.config();
import { createRestAPIClient } from 'masto';
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

// Get a random question.
async function getQuestion() {
  const questions = await loadJsonFileSync('./data/questions-corpus.json');
  const numberOfQuestions = Object.keys(questions).length;
  return questions[Math.floor(Math.random()*numberOfQuestions)].toString();
}

// Post the question.
let attemptsToPost = 0;

async function postToMastodon(thePostToPost) {
  attemptsToPost++;

  if (thePostToPost) {
    // console.log('NOW ATTEMPTING TO POST:', thePostToPost);

    // Access Mastodon.
    const masto = createRestAPIClient({
      url: 'https://mastodon.matthewmcvickar.com',
      accessToken: process.env.MASTODON_ACCESS_TOKEN,
    });

    // console.log('LOGGING IN TO MASTODON:', masto);

    if (masto) {
      const status = await masto.v1.statuses.create({
        status: thePostToPost,
        visibility: 'public'
      });

      // console.log('RESULT OF ATTEMPT TO POST:', status);

      if (status.id) {
        console.log('\n✅ SUCCESSFULLY POSTED TO MASTODON:', status.url);
      }
      else {
        console.log('ERROR POSTING:', status);
      }
    }
    else {
      // If we haven't already tried ten times, wait a bit and try again.
      if (attemptsToPost < 10) {
        setTimeout(() => {
          postToMastodon(thePostToPost);
        }, 5000);
      }
      else {
        console.log('ERROR: Could not post to Mastodon. Try again later.');
      }
    }
  }
  else {
    console.log('ERROR: No question retrieved; cannot post.');
  }
}
