import {Word} from './word.js';
import {wordList} from './wordList.js';
import {Menu} from './menu.js';
import {GameState} from './gamestate.js';
import * as Highscore from './highscore.js';

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
const INITIAL_LEVEL = 1;
const INITIAL_SCORE = 0;
const INITIAL_LIVES = 3;

// globals
let previousTime = null;
let frame, wordInterval, gamestate;

// menu setup
let menuWidth = 350;
let menuHeight = 300;
let scoreMenu = new Menu((canvas.width / 2) - (menuWidth / 2), 
                       (canvas.height / 2) - (menuHeight), 
                       menuWidth, menuHeight * 2, 
                       'Highscores:',
                       {label: 'Try Again', callback: (e) => {startGame();}});
let endMenu = new Menu((canvas.width / 2) - (menuWidth / 2), 
                       (canvas.height / 2) - (menuHeight / 2), 
                       menuWidth, menuHeight, 
                       `Gameover! <br> Your Score:`,
                       {label: 'Try Again', callback: () => startGame()},
                       {label: 'High Scores', callback: () => scoreMenu.show()});
let startMenu = new Menu((canvas.width / 2) - (menuWidth / 2), 
                         (canvas.height / 2) - (menuHeight / 2), 
                         menuWidth, menuHeight, 
                         'Click start to play!',
                         {label: 'Start', callback: (e) => {
                             document.getElementById('statusBar')
                                     .style.visibility = 'visible';
                             startGame();
                         }});

// entry point
Highscore.load();
window.addEventListener('beforeunload', () => Highscore.save());
startMenu.show();


// set listeners, intervals, gameloop
function startGame() {
    scoreElm.innerHTML = `Score: ${INITIAL_SCORE}`;
    levelElm.innerHTML = `Level: ${INITIAL_LEVEL}`;
    livesElm.innerHTML = `Lives: ${INITIAL_LIVES}`;

    gamestate = new GameState(INITIAL_SCORE, 
                              INITIAL_LEVEL, 
                              INITIAL_LIVES, 
                              END_LINE);

    window.addEventListener('keydown', handleKey);
    wordInterval = setInterval(addWord, START_INTERVAL);
    frame = requestAnimationFrame(gameLoop);
}

// cancel listeners, intervals, gameloop
// update score and menus
// show end menu
function endGame() {
    cancelAnimationFrame(frame);
    clearInterval(wordInterval);

    Highscore.addScore(gamestate.score);
    scoreMenu.updateLabel(`High Scores: `, Highscore.getScoreList());
    endMenu.updateLabel(`Gameover! <br> Your Score: ${gamestate.score}`);
    endMenu.show();
}

function gameLoop(time) {
    frame = requestAnimationFrame(gameLoop);
    if (previousTime === null)
        previousTime = time;
    const dt = (time - previousTime) * 0.001;

    update(dt);
    drawCanvas();

    previousTime = time;
}

function update(dt) {
    for (let word of gamestate.words)
        word.update(dt);

    if (gamestate.completeWord()) {
        scoreElm.innerHTML = `Score: ${gamestate.score}`;
    }

    if (gamestate.levelUp(LEVEL_INTERVAL)) {
        clearInterval(wordInterval);
        wordInterval = setInterval(addWord, 
                                   START_INTERVAL - LEVEL_SPEEDUP * gamestate.level);
        levelElm.innerHTML = `Level: ${gamestate.level}`;
    }

    if (gamestate.failedWords(w => w.x < 0 - w.getWidth(ctx))) {
        livesElm.innerHTML = `Lives: ${gamestate.lives}`;
    }

    // end game when we run out of lives
    if (gamestate.lives == 0) {
        endGame();
    }
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let word of gamestate.words)
        word.draw(ctx);

    // draw endline
    ctx.fillRect(END_LINE, canvas.height/15, 2, canvas.height - (canvas.height/15)*2);

    // draw words passed the endline as red
    gamestate.words.filter(w => w.x < END_LINE)
                   .forEach(w => {
                       ctx.save();
                       ctx.fillStyle = 'red';
                       w.draw(ctx);
                       ctx.restore();
                   });

    // draw entry
    if (gamestate.currentWord != null) {
        ctx.save();
        ctx.fillStyle = 'blue';
        ctx.font = `${gamestate.currentWord.size}px serif`;
        ctx.fillText(gamestate.entry, 
                     gamestate.currentWord.x, gamestate.currentWord.y);
        ctx.restore();
    }
}

// either set current word or update entry on keypress
function handleKey(e) {
    let key = e.key;
    // only worry about letters, ignore other keys
    if (key.toLowerCase() == key.toUpperCase()) return; 

    gamestate.enterCharacter(key);
}

function addWord() {
    gamestate.addWord(randomWord(wordList, 
                                 canvas.width + 10, 
                                 30, canvas.height - 30));
}

function randomWord(list, x, minY, maxY) {
    // random y between min and max
    let y = Math.floor((Math.random() * (maxY - minY)) + minY);
    let word = list[Math.floor(Math.random() * list.length)];

    return new Word(word, word.length * SIZE_MULTIPLIER,
                    MAX_SPEED - (word.length * SPEED_MULTIPLIER), x, y);
}
