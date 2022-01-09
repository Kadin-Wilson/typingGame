import {Word} from './word.js';
import {wordList} from './wordList.js';

// canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const rect = canvas.parentNode.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;

// status setup
const scoreElm = document.getElementById('score');
const levelElm = document.getElementById('level');
const livesElm = document.getElementById('lives');

// constants
const SIZE_MULTIPLIER = canvas.height / 100; // word size = length * multiplier
const SPEED_MULTIPLIER = canvas.width / 60; 
const MAX_SPEED = canvas.width / 5;          // word speed = max - length * multiplier
const END_LINE = canvas.width / 15; // position of end of screen line
const START_INTERVAL = 2000; // initial speed of word spawn
const LEVEL_INTERVAL = 150;  // point interval for levelup 
const LEVEL_SPEEDUP = 250;

// globals
let words = []; // words on screen
let currentWord = null; // active word
let entry = ''; // currently typed entry
let previousTime; // last timestamp (used for delta time)
let score = 0; // current score
let level = 1; // current level
let lives = 3; // current lives

// start game
requestAnimationFrame(gameLoop);
window.addEventListener('keydown', handleKey);
let wordInterval = setInterval(addWord, START_INTERVAL);


function gameLoop(time) {
    if (previousTime === undefined)
        previousTime = time;
    const dt = (time - previousTime) * 0.001;

    update(dt);
    drawCanvas();

    previousTime = time;
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    for (let word of words)
        word.update(dt);

    // word is completed
    if (currentWord != null && entry == currentWord.text) {
        // update score
        score += currentWord.text.length * level;
        scoreElm.innerHTML = `Score: ${score}`;

        // reset current word and entry
        words.splice(words.indexOf(currentWord), 1);
        currentWord = null;
        entry = '';
    }

    // level up at certain scores
    if (score > LEVEL_INTERVAL * level * level) {
        clearInterval(wordInterval);
        wordInterval = setInterval(addWord, START_INTERVAL - LEVEL_SPEEDUP * level);
        ++level;
        levelElm.innerHTML = `Level: ${level}`;
    }

    //remove words that have passed out of view
    words.filter(w => w.x < 0 - w.getWidth(ctx))
         .forEach(w => {
             if (currentWord == w) {
                 currentWord = null;
                 entry = '';
             }
             words.splice(words.indexOf(w), 1);

             if (lives > 0) {
                 --lives;
                 livesElm.innerHTML = `Lives: ${lives}`;
             }
         });
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let word of words)
        word.draw(ctx);

    // draw endline
    ctx.fillRect(END_LINE, canvas.height/15, 2, canvas.height - (canvas.height/15)*2);

    // draw words passed the endline as red
    words.filter(w => w.x < END_LINE)
         .forEach(w => {
             ctx.save();
             ctx.fillStyle = 'red';
             w.draw(ctx);
             ctx.restore();
         });

    // draw entry
    if (currentWord != null) {
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.font = `${currentWord.size}px serif`;
        ctx.fillText(entry, currentWord.x, currentWord.y);
        ctx.restore();
    }
}

// either set current word or update entry on keypress
function handleKey(e) {
    let key = e.key;
    // only worry about letters, ignore other keys
    if (key.toLowerCase() == key.toUpperCase()) return; 

    if (currentWord == null && words.some(w => w.text[0] == key && w.x > END_LINE)) {
        // get closest word that starts with key and isn't passed the endline
        currentWord = words.filter(w => w.text[0] == key && w.x > END_LINE) 
                           .reduce((a, b) => a.x < b.x ? a : b); 
    }
    // if key didn't match a word then exit
    if (currentWord == null) return; 

    // update entry if right key was pressed
    if (currentWord.text[entry.length] == key)
        entry += key;
}

function addWord() {
    words.push(randomWord(wordList, canvas.width + 10, 30, canvas.height - 30));
}

function randomWord(list, x, minY, maxY) {
    // random y between min and max
    let y = Math.floor((Math.random() * (maxY - minY)) + minY);
    let word = list[Math.floor(Math.random() * list.length)];

    return new Word(word, word.length * SIZE_MULTIPLIER,
                    MAX_SPEED - (word.length * SPEED_MULTIPLIER), x, y);
}
