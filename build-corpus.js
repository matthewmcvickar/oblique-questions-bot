// Require filesystem and wordfilter.
import fs from 'fs';
import wordfilter from 'wordfilter';

// Get questions corpus.
const questionsRawFile = './data/questions-raw.txt';
const questionsJSONPath = './data/questions-corpus.json';

// Read questions into an array.
const questionsArray = fs.readFileSync(questionsRawFile).toString().split('\n');

// Settings.
const characterLimit = 300;

function formatQuestion(question) {
  // Trim spaces.
  question = question.trim();

  // Strip beginning and ending quotation marks.
  question = question.replace(/^['"`]/, '').replace(/['"`]$/, '');

  // Replace curly quotation marks.
  question = question.replace(/[’]/, '\'');

  // Capitalize the very first letter.
  question = question.charAt(0).toUpperCase() + question.slice(1);

  return question;
}

// Check for characters that are part of regex and thereby mess up the wordfilter regex.
function hasCertainCharacters(question) {
  const certainCharactersRegex = /\"|\-|\||\[|\]|\(|\)|\{|\}|\$|\^|\+|\\|\/|\.|\*|, '|'\?/;
  return certainCharactersRegex.test(question);
}

// Check for proper nouns.
function hasProperNouns(question) {
  const properNounRegex = / \b[A-Z]{1}[a-z]+/;
  return properNounRegex.test(question);
}

// Check that last character is a question mark.
function lastCharacterIsQuestionMark(question) {
  return question.substr(question.length - 1) === '?';
}

// Check that first character is a letter.
function firstCharacterIsLetter(question) {
  return /[A-Za-z]+/.test(question.charAt(0));
}

// Additional filters.
wordfilter.addWords([

  // To get a better set of questions, I'm filtering out a lot of questions.
  // The lists below are used in addition to the default set:
  // https://github.com/dariusk/wordfilter/blob/master/lib/badwords.json

  // Troublesome characters.
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  ":",
  ";",
  "--",
  "“",
  "‘",
  "`",
  "_",
  "–",
  "~",
  "#",
  "%",
  "&",
  "=",
  "<",
  ">",

  // Irrelevant.
  "gutenberg",
  "donate",
  "chapter",
  "section",

  // Archaic.
  "'st",
  "beest",
  "d'ye",
  "didst",
  "dost",
  "goest",
  "hadst",
  "hast",
  "hath",
  "n't",
  "o'er",
  "prithee",
  "quoth",
  "seest",
  "thee",
  "thine",
  "thou",
  "thy\\ ",
  "'tis",
  "wert",
  "whence",
  "wilt",
  "wouldst",
  "\\ ye\\ ",
  "your'n",

  // Dialect/outdated.
  "'un",
  "\\ d'ye\\ ",
  "\\ de\\ ",
  "\\ dem\\ ",
  "\\ fer\\ ",
  "\\ git\\ ",
  "\\ ses\\ ",
  "\\ t'\\ ",
  "\\ ye\\ ",
  "\\ yeh\\ ",
  "an'",
  "i' ",
  "th' ",
  "tha' ",
  "wohin",
  "wot",
  "yer",

  // Oppressive, violent, outdated, or otherwise problematic.
  "black",
  "chief",
  "colored",
  "craz",
  "darkie",
  "darky",
  "gips",
  "kill",
  "master",
  "nagur",
  "native",
  "negre",
  "noose",
  "red",
  "savage",
  "slave",
  "suicide",
  "wench",
  "white",
  "yellow",

  // Miscellaneous.
  "\\ D'",
  "citoy",
  "coz",
  "dat \\",
  "doat",
  "hearn",
  "puss",
  "spooney",

  // Religious.
  "arab",
  "ascetic",
  "bibl",
  "buddh",
  "catholic",
  "christ",
  "clergy",
  "covenant",
  "episcopal",
  "god",
  "islam",
  "jesus",
  "jew",
  "judaism",
  "koran",
  "mohammed",
  "moses",
  "muslim",
  "priest",
  "protestant",
  "quran",
  "saint",
  "satan",
  "sikh",
  "talmud",
  "tithe",
]);

// Run through questions.
let questionsObject = {};
let counter = 0;
for (let question in questionsArray) {
  if (questionsArray.hasOwnProperty(question)) {
    // Format the question in question.
    let theQuestion = formatQuestion(questionsArray[question]);

    // If it's 140 characters or less, doesn't have proper nouns, is a question,
    // and passes the word filters, then add it to the JSON!
    if (theQuestion.length <= characterLimit &&
        ! hasProperNouns(theQuestion) &&
        ! hasCertainCharacters(theQuestion) &&
        ! wordfilter.blacklisted(theQuestion) &&
        firstCharacterIsLetter(theQuestion) &&
        lastCharacterIsQuestionMark(theQuestion))
    {
      // console.log(theQuestion)
      questionsObject[counter] = theQuestion;
      counter++;
    }
  }
}

// Add to JSON file.
fs.writeFile(questionsJSONPath, JSON.stringify(questionsObject), function (err) {
  console.error(err);
});
