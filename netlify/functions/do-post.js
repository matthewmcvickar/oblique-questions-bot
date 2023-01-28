import { createAndPost } from '../../bot';

exports.handler = async function() {
  console.log('RUNNING FUNCTION!');
  return createAndPost();
}
