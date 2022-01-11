class GameState {
    constructor(score, level, lives, entryOffset) {
        this.score = score;
        this.level = level;
        this.lives = lives;
        this.entryOffset = entryOffset;

        this.words = [];
        this.currentWord = null;
        this.entry = '';
    }

    addWord(word) {
        this.words.push(word);
    }

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

    levelUp(levelInterval) {
        if (this.score > levelInterval * this.level * this.level) {
            ++this.level;
            return true;
        }

        return false;
    }

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
