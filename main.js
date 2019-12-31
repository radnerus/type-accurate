'use strict';
const randomWordEle = document.querySelector('#random-word');
const typer = document.querySelector('#typer');

let allWords = [];
let currentRandomWords = [];
let currentWord = '';
let currentIndex = 0;

const getWords = async () => {
    const wordsResp = await fetch('words_array.json')

    const words = (await wordsResp.json());

    if (words.length) {
        document.querySelector('.overlay').classList.remove('overlay');
    }

    console.log('words', words.length);
    allWords = words;
    getRandomWords();
}

getWords();

const getRandomWord = () => {
    return allWords[Math.floor(Math.random() * allWords.length)];
}

const getRandomWords = (length = 4) => {
    currentRandomWords = [...new Array(length)].map(getRandomWord);
    randomWordEle.innerHTML = currentRandomWords.map(formatWords).join(' ');
    currentWord = currentRandomWords[currentIndex];

    highlightCurrentElement();
}


//Event Listeners

typer.addEventListener('input', (e) => {
    console.log(e.srcElement.value, currentWord);
    const typedWord = e.srcElement.value.toLowerCase();
    if (typedWord === currentWord) {
        const newWord = getRandomWord();
        currentWord = currentRandomWords[currentIndex + 1];
        if (currentRandomWords.length < 7) {
            currentRandomWords.push(newWord);
            currentIndex = currentRandomWords.length - 4;
        } else {
            currentRandomWords = currentRandomWords.splice(1);
            currentRandomWords.push(newWord);
            currentIndex = 3;
        }
        randomWordEle.innerHTML = currentRandomWords.map(formatWords).join(' ');
        highlightCurrentElement();
        typer.value = '';
    } else if (currentWord.indexOf(typedWord) !== 0) {
        highlightError();
    } else {
        removeError();
    }
})

function removeError() {
    document.querySelector('.error').classList.remove('error');
}

function highlightCurrentElement() {
    document.querySelectorAll('.words').forEach((el, index) => {
        el.classList.remove('active');
        el.classList.remove('error');
        if (index < currentIndex) {
            el.classList.add('completed');
        }
    });
    const currentEle = document.getElementById(`word-${currentIndex}`);
    currentEle.classList.add('active');
}

function highlightError() {
    document.querySelector('.active').classList.add('error');
}

function formatWords(w, i) {
    return `<span id="word-${i}" class="words">${w}</span>`;
}

