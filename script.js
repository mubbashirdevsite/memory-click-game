const board = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");
const winMessage = document.getElementById("winMessage");
const starsEl = document.getElementById("stars");

const symbols = ["🍎","🚗","🐶","⚽","🎵","🌟","🔥","🎮"];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matches = 0;
let time = 0;
let timer;

function startGame(){

    board.innerHTML = "";
    cards = shuffle([...symbols, ...symbols]);

    cards.forEach(symbol => {

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face front">❓</div>
                <div class="card-face back">${symbol}</div>
            </div>
        `;

        card.dataset.symbol = symbol;

        card.addEventListener("click", flipCard);

        board.appendChild(card);

    });

    resetStats();
    startTimer();
}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        let j = Math.floor(Math.random()*(i+1));

        [array[i], array[j]] = [array[j], array[i]];

    }

    return array;
}

function flipCard(){

    if(lockBoard) return;
    if(this === firstCard) return;
    if(this.classList.contains("flipped")) return;

    this.classList.add("flipped");

    if(!firstCard){
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesEl.textContent = moves;

    checkMatch();
}

function checkMatch(){

    let isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if(isMatch){
        matches++;
        matchesEl.textContent = matches;

        firstCard = null;
        secondCard = null;

        updateScore();

        if(matches === 8){
            endGame();
        }

    }else{

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard = null;
            secondCard = null;
            lockBoard = false;

        }, 800);
    }
}

function updateScore(){

    let score = Math.max(100 - moves * 2, 10);
    scoreEl.textContent = score;

    if(moves <= 15){
        starsEl.textContent = "★★★★★";
    }else if(moves <= 25){
        starsEl.textContent = "★★★★☆";
    }else{
        starsEl.textContent = "★★★☆☆";
    }
}

function startTimer(){

    clearInterval(timer);

    timer = setInterval(() => {
        time++;
        timeEl.textContent = time + "s";
    },1000);
}

function resetStats(){

    moves = 0;
    matches = 0;
    time = 0;

    movesEl.textContent = 0;
    matchesEl.textContent = 0;
    timeEl.textContent = "0s";
    scoreEl.textContent = 100;

    winMessage.textContent = "";
}

function endGame(){

    clearInterval(timer);

    winMessage.textContent = `🎉 Congratulations! You won in ${time}s with ${moves} moves!`;
}

restartBtn.addEventListener("click", startGame);

startGame();