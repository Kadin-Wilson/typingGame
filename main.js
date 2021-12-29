import {Word} from './word.js';
import {wordList} from './wordList.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const SIZE_MULTIPLIER = canvas.height / 100; // word size = length * multiplier
const SPEED_MULTIPLIER = canvas.width / 60; 
const MAX_SPEED = canvas.width / 5;          // word speed = max - length * multiplier

let words = [];
let previousTime;

let wordInterval = setInterval(() => {
    words.push(randomWord(wordList, canvas.width + 10, 30, canvas.height - 30));
}, 1000);
requestAnimationFrame(loop);


function loop(time) {
    if (previousTime === undefined)
        previousTime = time;
    const dt = (time - previousTime) * 0.001;

    update(dt);
    draw();

    previousTime = time;
    requestAnimationFrame(loop);
}

function update(dt) {
    for (let word of words)
        word.update(dt);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let word of words)
        word.draw(ctx);
}

function randomWord(list, x, minY, maxY) {
    // random y between min and max
    let y = Math.floor((Math.random() * (maxY - minY)) + minY);
    let word = list[Math.floor(Math.random() * list.length)];

    return new Word(word, word.length * SIZE_MULTIPLIER,
                    MAX_SPEED - (word.length * SPEED_MULTIPLIER), x, y);
}
