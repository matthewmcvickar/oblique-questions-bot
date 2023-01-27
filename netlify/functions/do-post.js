import { createAndPost } from '../../bot';

exports.handler = function() {
  console.log('RUNNING FUNCTION!');
  return createAndPost();
}
