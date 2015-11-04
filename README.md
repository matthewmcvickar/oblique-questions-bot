# Oblique Questions Bot

**[@obliquestions](https://twitter.com/obliquestions)**

A Twitter bot that tweets questions without context.


## How I Built It

Taking inspiration from [Hugo van Kemenade](https://github.com/hugovk/)'s [gutengrep](https://github.com/hugovk) project, the initial corpus was derived from books in the [Project Gutenberg 'August 2003' CD](http://www.gutenberg.org/wiki/Gutenberg:The_CD_and_DVD_Project#What_the_Discs_Contain). To make the dataset cleaner to begin with, I removed almost 200 books from the collection manually before building my corpus. These included non-English texts, poetry and dramatic texts, texts heavy with dialect, and religious, mathematical, encyclopedic, and political texts. (This required moving the folder-separated files on the Project Gutenberg disk image into a single folder and then deleting everything that wasn't a text file.)

This left me with about 400 books. I used [gutengrep](https://github.com/hugovk) to tokenize the texts into sentences. (This required [installing NLTK](http://www.nltk.org/install.html) and downloading its data.)

Once tokenized, I deleted duplicate lines and deleted empty lines from the corpus.

Then I wrote a script ([build-corpus.js](build-corpus.js)) to format and filter the sentences into a set of tweetable questions. In order:

- Removed beginning and trailing quotation marks, such that questions that were quotations in the original text would be tweeted as though they were prose.

- Capitalized the first letter of the question, in case it wasn't already capitalized.

- Filtered out any question longer than 140 characters.

- Filtered out any question that included a proper noun. (I felt this would provide too much context.) I did this with a regular expression that searched for words preceded by a space and starting with a capitalized letter. This doesn't capture proper nouns at the beginning of sentences, but that's fine.

- Filtered out any question that contained non-letter characters (excluding apostrophes), as they often indicated weird formatting and non-questions:
    ```txt
    1 2 3 4 5 6 7 8 9 0 : ; . " “ ” ‘ ’ < > [ ] ( ) { } ` ~ # $ % ^ & _ + - = \ / |
    ```

- Filtered out any question that contained archaic language (like `thine` and `dost` and `prithee`).

- Filtered out any question that contained religious language (like `moses` and `buddha` and `clergy`).

- Filtered out any question that would relate to the text itself or Project Gutenberg itself (like `gutenberg` and `donate` and `chapter` and `section`).

- Filtered out the [bad words listed in Darius Kazemi's wordfilter](https://github.com/dariusk/wordfilter/blob/master/lib/badwords.json).

If a sentence passed all the filters, I added it to a giant JSON file.

After refining the script, I ended up with a JSON file of about 66K questions.

I then wrote a script ([bot.js](bot.js)) that reads the JSON file, chooses a question from it at random, and tweets the question.

This script is running on Heroku.


## Acknowledgements

I couldn't have created this bot without the help of the following:

- [Sarah Kuehnle's 'Creating a Twitter bot with Node.js' series](http://ursooperduper.github.io/2014/10/27/twitter-bot-with-node-js-part-1.html)

- [Molly White's two-part series on Twitter bots](http://blog.mollywhite.net/twitter-bots-pt1/)

- [Darius Kazemi](https://twitter.com/tinysubversions) provided inspiration and of personal technical assistance. I also referenced his projects [examplebot](https://github.com/dariusk/examplebot) and [grunt-init-twitter-bot](https://github.com/dariusk/grunt-init-twitter-bot) and his posts [How to make a Twitter bot](http://tinysubversions.com/2013/09/how-to-make-a-twitter-bot/) and [Basic Twitter bot etiquette](http://tinysubversions.com/2013/03/basic-twitter-bot-etiquette/).

- [Hugo van Kemenade](https://github.com/hugovk/)'s [gutengrep](https://github.com/hugovk) project was instrumental in both providing my corpus and tokenizing it into sentences.

- [Justin Falcone](https://twitter.com/modernserf) provided inspiration, encouragement, and personal technical assistance.

- This project was inspired in name and in concept by Brian Eno and Peter Schmidt's [Oblique Strategies](https://en.wikipedia.org/wiki/Oblique_Strategies).


## Afterword

This is my first Twitter bot. The idea for Oblique Questions came to me while walking the dog on Saturday, October 31, 2015. I started working on it the next day and launched the working bot on the morning of November 4, 2015.

