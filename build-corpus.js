'use strict';

// Require filesystem and wordfilter.
var fs         = require('fs');
var jsonfile   = require('jsonfile');
var wordfilter = require('wordfilter');

// Get questions corpus.
var questionsFile = './data/questions-raw.txt';
var questionsJSON = './data/questions-corpus.json';

// Read questions into an array.
var questionsArray = fs.readFileSync(questionsFile).toString().split('\n');

// Settings.
var characterLimit = 300;

function formatQuestion(question) {
  // Trim spaces.
  question = question.trim();

  // Strip beginning and ending quotation marks.
  question = question.replace(/^['"`]/, '').replace(/['"`]$/, '');

  // Capitalize the very first letter.
  question = question.charAt(0).toUpperCase() + question.slice(1);

  return question;
}

// Check for characters that are part of regex and thereby mess up the wordfilter regex.
function hasCertainCharacters(question) {
  var certainCharactersRegex = /\"|\-|\||\[|\]|\(|\)|\{|\}|\$|\^|\+|\\|\/|\.|, '|'\?/;
  return certainCharactersRegex.test(question);
}

// Check for proper nouns.
function hasProperNouns(question) {
  var properNounRegex = / \b[A-Z]{1}[a-z]+/;
  return properNounRegex.test(question);
}

// Check that last character is a question mark.
function lastCharacterIsQuestionMark(question) {
  return question.substr(question.length - 1) === '?';
}

// Additional filters.
wordfilter.addWords([

  // To get a better set of questions, I'm filtering out a lot of questions.
  // The lists below are used in addition to the default set:
  // https://github.com/dariusk/wordfilter/blob/master/lib/badwords.json

  // Troublesome characters.
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  ':',
  ';',
  '--',
  '“',
  '‘',
  '`',
  '_',
  '–',
  '~',
  '#',
  '%',
  '&',
  '=',
  '<',
  '>',

  // Irrelevant.
  'gutenberg',
  'donate',
  'chapter',
  'section',

  // Archaic.
  '\'st',
  'beest',
  'd\'ye',
  'didst',
  'dost',
  'goest',
  'hadst',
  'hast',
  'hath',
  'n\'t',
  'o\'er',
  'prithee',
  'quoth',
  'seest',
  'thee',
  'thine',
  'thou',
  'thy ',
  '\'tis',
  'wert',
  'wilt',
  ' ye ',
  'your\'n',

  // Outdated.
  'an\'',
  'i\' ',
  ' de ',
  ' dem ',
  ' t\' ',
  'th\' ',
  'tha\' ',
  '\'un',
  ' ye ',
  ' yeh ',

  // Oppressive or violent.
  'kill',
  'master',
  'wench',

  // Racial. (Sentences with these words are too often problematic.)
  'white',
  'black',
  'yellow',
  'red',
  'colored',
  'slave',

  // Religious.
  'arab',
  'ascetic',
  'bibl',
  'buddh',
  'catholic',
  'christ',
  'clergy',
  'covenant',
  'episcopal',
  'god',
  'islam',
  'jesus',
  'jew',
  'judaism',
  'koran',
  'mohammed',
  'moses',
  'muslim',
  'priest',
  'protestant',
  'quran',
  'saint',
  'satan',
  'sikh',
  'talmud',
  'tithe',
]);

var questionsObject = {};
var counter = 0;

// Run through questions.
for (var question in questionsArray) {
  if (questionsArray.hasOwnProperty(question)) {

    // Format the question in question.
    var theQuestion = formatQuestion(questionsArray[question]);

    // If it's 140 characters or less, doesn't have proper nouns, is a question,
    // and passes the word filters, then add it to the JSON!
    if (theQuestion.length <= characterLimit &&
        ! hasProperNouns(theQuestion) &&
        ! hasCertainCharacters(theQuestion) &&
        ! wordfilter.blacklisted(theQuestion) &&
        lastCharacterIsQuestionMark(theQuestion))
    {
      // console.log(theQuestion)
      questionsObject[counter] = theQuestion;
      counter++;
    }

  }
}

// Add to JSON file.
jsonfile.writeFile(questionsJSON, questionsObject, {spaces: 2}, function (err) {
  console.error(err);
});
