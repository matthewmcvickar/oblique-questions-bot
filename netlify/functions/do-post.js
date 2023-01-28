import { createAndPost } from '../../bot.js';

exports.handler = async function() {
  console.log('RUNNING FUNCTION!');
  return createAndPost();
}
