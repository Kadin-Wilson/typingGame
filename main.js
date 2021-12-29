import {Word} from './word.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let words = [];
let previousTime;

words.push(new Word('example', 25, 50, canvas.width + 10, 30));
words.push(new Word('example', 25, 50, canvas.width + 10, 60));
words.push(new Word('example', 25, 50, canvas.width + 10, 90));
words.push(new Word('example', 25, 50, canvas.width + 10, 120));

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

