class GameState {
    /**
     * Class containing all the state for the typing game.
     * All changes to game state are made through state object methods.
     *
     * score - initial score
     * level - initial level
     * lives - initial lives
     * entryOffset - point past which a new word entry can't be started
     */
    constructor(score, level, lives, entryOffset) {
        this.score = score;
        this.level = level;
        this.lives = lives;
        this.entryOffset = entryOffset;

        this.words = [];
        this.currentWord = null; // word to be typed / matched with entry
        this.entry = ''; // currently typed entry
    }

    addWord(word) {
        this.words.push(word);
    }

    /**
     * Adds character to current entry if it matches the current word
     * if no word is active, find a word matching the character
     *
     * char - character to add to entry
     */
    enterCharacter(char) {
        if (this.currentWord == null 
         && this.words.some(w => w.text[0] == char && w.x > this.entryOffset)) {
            // get closest word that starts with char and isn't passed the offset
            this.currentWord = this.words.filter(w => w.text[0] == char 
                                                 && w.x > this.entryOffset) 
                                         .reduce((a, b) => a.x < b.x ? a : b); 
        }
        // if char didn't match a word then exit
        if (this.currentWord == null) return; 

        // update entry if right char was pressed
        if (this.currentWord.text[this.entry.length] == char)
            this.entry += char;
    }

    /**
     * If entry matches current word, clear entry and current word,
     * increase score, and remove word.
     *
     * returns - true if word was completed 
     *           false otherwise
     */
    completeWord() {
        if (this.wordIsComplete()) {
            // update score
            this.score += this.currentWord.text.length * this.level;

            // reset current word and entry
            this.words.splice(this.words.indexOf(this.currentWord), 1);
            this.currentWord = null;
            this.entry = '';

            return true;
        }

        return false;
    }

    /**
     * If score has passed required value, increase level
     *
     * levelInterval - used in calculation of score threshold
     * returns - true if level goes up
     *           false otherwise
     */
    levelUp(levelInterval) {
        if (this.score > levelInterval * this.level * this.level) {
            ++this.level;
            return true;
        }

        return false;
    }

    /**
     * Remove words that haven't been typed and deincrement lives for 
     * each failed word.
     *
     * failCondition - predicate to check if word is failed
     * returns - true if words have failed / lives have been lost
     *           false otherwise
     */
    failedWords(failCondition) {
        let livesLost = false;

        this.words.filter(failCondition)
                  .forEach(w => {
                      if (this.currentWord == w) {
                          this.currentWord = null;
                          this.entry = '';
                      }
                      this.words.splice(this.words.indexOf(w), 1);

                      if (this.lives > 0) {
                          --this.lives;
                          livesLost = true;
                      }
                  });

        return livesLost;
    }

    wordIsComplete() {
        return this.currentWord != null && this.entry == this.currentWord.text;
    }
}

export {GameState};
