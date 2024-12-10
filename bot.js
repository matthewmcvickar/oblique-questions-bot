import * as dotenv from 'dotenv'; dotenv.config();
import { createRestAPIClient } from 'masto';
import { AtpAgent } from '@atproto/api';
import { loadJsonFileSync } from 'load-json-file';

// Initiate BlueSky connection.
const blueskyAgent = new AtpAgent({
  service: 'https://bsky.social',
})

await blueskyAgent.login({
  identifier: process.env.BLUESKY_USERNAME,
  password: process.env.BLUESKY_PASSWORD
});

// console.log('CONNECTING TO BLUESKY:', blueskyAgent);

// Initiate Mastodon connection.
const mastodonAgent = createRestAPIClient({
  url: 'https://mastodon.matthewmcvickar.com',
  accessToken: process.env.MASTODON_ACCESS_TOKEN,
});

// console.log('CONNECTING TO MASTODON:', mastodonAgent);

// The main process. Get a question and post it.
async function doPost() {
  const question = await getQuestion();
  console.log('📚 ❓ 🤖 🚀\n\nTrying to post "' + question + '" to Mastodon…');

  await postToMastodon(question);
  await postToBluesky(question);
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
async function postToMastodon(thePostToPost) {
  if ( ! thePostToPost) {
    console.error('ERROR: No question retrieved; cannot post to Mastodon.');
  }

  if ( ! mastodonAgent ) {
    console.error('ERROR: Could not connect to Mastodon. Try again later.');
  }

  // console.log('NOW ATTEMPTING TO POST TO MASTODON:', thePostToPost);

  const postedPost = await mastodonAgent.v1.statuses.create({
    status: thePostToPost,
    visibility: 'public'
  });

  // console.log('RESULT OF ATTEMPT TO POST TO MASTODON:', postedPost);

  if (postedPost.id) {
    console.log('\n✅ SUCCESSFULLY POSTED TO MASTODON:', postedPost.url);
  }
  else {
    console.error('ERROR POSTING TO MASTODON:', postedPost);
  }
}

async function postToBluesky(thePostToPost) {
  if ( ! thePostToPost) {
    console.error('ERROR: No question retrieved; cannot post to Bluesky.');
  }

  if ( ! blueskyAgent ) {
    console.error('ERROR: Could not connect to Bluesky. Try again later.');
  }

  // console.log('NOW ATTEMPTING TO POST TO BLUESKY:', thePostToPost);

  const postedPost = await blueskyAgent.post({
    text: thePostToPost
  });

  // console.log('RESULT OF ATTEMPT TO POST TO BLUESKY:', postedPost);

  if (postedPost.uri) {
    console.log('\n✅ SUCCESSFULLY POSTED TO BLUESKY:', postedPost.uri);
  }
  else {
    console.error('ERROR POSTING TO BLUESKY:', postedPost);
  }
}
