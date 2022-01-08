import {Word} from './word.js';
import {wordList} from './wordList.js';

// canvas setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// constants
const SIZE_MULTIPLIER = canvas.height / 100; // word size = length * multiplier
const SPEED_MULTIPLIER = canvas.width / 60; 
const MAX_SPEED = canvas.width / 5;          // word speed = max - length * multiplier
const END_LINE = canvas.width / 15;

// globals
let words = [];
let previousTime;
let currentWord = null;
let entry = '';

// start game
requestAnimationFrame(gameLoop);
window.addEventListener('keydown', handleKey);
let wordInterval = setInterval(() => {
    words.push(randomWord(wordList, canvas.width + 10, 30, canvas.height - 30));
}, 2000);


function gameLoop(time) {
    if (previousTime === undefined)
        previousTime = time;
    const dt = (time - previousTime) * 0.001;

    update(dt);
    draw();

    previousTime = time;
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    for (let word of words)
        word.update(dt);

    //remove words that have passed out of view
    words.filter(w => w.x < 0 - w.getWidth(ctx))
         .forEach(w => {
             if (currentWord == w) {
                 currentWord = null;
                 entry = '';
             }
             words.splice(words.indexOf(w), 1);
         });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let word of words)
        word.draw(ctx);

    // draw endline
    ctx.fillRect(END_LINE, 0, 2, canvas.height);

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

function handleKey(e) {
    let key = e.key;
    if (!isLetter(key)) return; // only worry about letters, ignore other keys

    if (currentWord == null && words.some(w => w.text[0] == key)) {
        // get closest word that starts with key and isn't passed the endline
        currentWord = words.filter(w => w.text[0] == key && w.x > END_LINE) 
                           .reduce((a, b) => a.x < b.x ? a : b); 
    }

    if (currentWord == null) return; // key didn't find a word

    if (currentWord.text[entry.length] == key)
        entry += key;

    // remove word and reset entry/currentWord
    if (entry == currentWord.text) {
        words.splice(words.indexOf(currentWord), 1);
        currentWord = null;
        entry = '';
    }
}

function randomWord(list, x, minY, maxY) {
    // random y between min and max
    let y = Math.floor((Math.random() * (maxY - minY)) + minY);
    let word = list[Math.floor(Math.random() * list.length)];

    return new Word(word, word.length * SIZE_MULTIPLIER,
                    MAX_SPEED - (word.length * SPEED_MULTIPLIER), x, y);
}

function isLetter(char) {
    return char.toLowerCase() != char.toUpperCase();
}
