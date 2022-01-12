import * as LS from './localStorage.js'

let scores;

function load() {
    if (LS.has('scores'))
        scores = LS.get('scores');
    else
        scores = Array(10).fill(0);
}

function addScore(score) {
    let smallestScore = scores.reduce((a, b) => a < b ? a : b);
    if (score > smallestScore)
        scores[scores.indexOf(smallestScore)] = score;
}

function save() {
    LS.set('scores', scores);
}

function getScoreList() {
    let list = document.createElement('ol');
    list.className = 'scoreList';

    for (let score of scores) {
        let item = document.createElement('li');
        item.innerHTML = `${score}`;
        list.appendChild(item);
    }

    return list;
}

function getScores() {
    return scores;
}

export {load, addScore, save, getScoreList};
