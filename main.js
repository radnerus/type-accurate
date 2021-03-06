'use strict';
const randomWordEle = document.querySelector('#random-word');
const typer = document.querySelector('#typer');
const wordsCompletedEle = document.querySelector('#typed-words');
const charactersMissSpelledEle = document.querySelector('#error-chars');
const timeEle = document.querySelector('#time-taken');
const notifications = document.querySelector('#notifications');
const rules = document.querySelector('#rules');
const arcadeTime = document.querySelector('#arcade-time');

const debugEle = document.querySelector('#debug');

notifications.style.display = 'none';

let allWords = [];
let currentRandomWords = [];
let currentWord = '';
let currentIndex = 0;
let wordsCompleted = 0;
let charactersMissSpelled = 0;
let isInsert = null;
let displayedWords = 4;
let timeTaken = 0;
let timeStarted = false;
let isArcade = true;

let wordsToBeTested = 10;

wordsCompletedEle.textContent = wordsCompleted;
charactersMissSpelledEle.textContent = charactersMissSpelled;
timeEle.textContent = timeTaken;

const showNotificationArea = () => {
    notifications.style.display = 'block';
    rules.style.display = 'none';
}

const getWordsInitial = async () => {
    const wordsResp = await fetch('words_array_six_letters.json')

    const words = (await wordsResp.json());

    if (words.length) {
        document.querySelector('.overlay').classList.remove('overlay');
        typer.focus();
        getWords();
    }

    allWords = words;
    getRandomWords();
}

const getWords = async () => {
    const wordsResp = await fetch('words_array.json')

    const words = (await wordsResp.json());

    allWords = [...allWords, ...words];

}

getWordsInitial();

const getRandomWord = () => {
    return allWords[Math.floor(Math.random() * allWords.length)];
}

const getRandomWords = (length = 4) => {
    currentRandomWords = [...new Array(length)].map(getRandomWord);
    randomWordEle.innerHTML = currentRandomWords.map(formatWords).join(' ');
    currentWord = currentRandomWords[currentIndex];

    highlightCurrentElement();
}


function removeError() {
    const errorEle = document.querySelector('.error');
    errorEle && errorEle.classList.remove('error');
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
    if (isInsert) {
        charactersMissSpelled++;
        charactersMissSpelledEle.textContent = charactersMissSpelled;
    }
}

function formatWords(w, i) {
    return `<span id="word-${i}" class="words">${w}</span>`;
}

const startTimer = () => {
    timeStarted = true;
    showNotificationArea();
    setInterval(() => {
        timeTaken++;
        timeEle.textContent = timeTaken;
    }, 1000);
}


//Event Listeners

typer.addEventListener('input', (e) => {
    const typedWord = e.srcElement.value.toLowerCase();
    isInsert = e.inputType.toLowerCase().indexOf('insert') !== -1;
    if (isInsert && !timeStarted) {
        startTimer();
    }
    if (typedWord === currentWord) {
        wordsCompleted++;
        wordsCompletedEle.textContent = wordsCompleted;
        if (displayedWords !== wordsCompleted) {
            const newWord = getRandomWord();
            currentWord = currentRandomWords[currentIndex + 1];
            if (displayedWords < wordsToBeTested) {
                if (currentRandomWords.length < 7) {
                    currentRandomWords.push(newWord);
                    currentIndex = currentRandomWords.length - 4;
                } else {
                    currentRandomWords = currentRandomWords.splice(1);
                    currentRandomWords.push(newWord);
                    currentIndex = 3;
                }
                displayedWords++;
            } else {
                currentIndex++;
            }
            randomWordEle.innerHTML = currentRandomWords.map(formatWords).join(' ');
            highlightCurrentElement();
        } else {
            setTimeout(() => {
                alert(`You have completed ${wordsCompleted} words with ${charactersMissSpelled} miss-spelled characters in ${timeTaken} seconds.`);
                window.location.reload();
            }, 10);
        }
        typer.value = '';
    } else if (currentWord.indexOf(typedWord) !== 0) {
        highlightError();
    } else {
        removeError();
    }
})


arcadeTime.addEventListener('input', (e) => {
    isArcade = e.srcElement.checked;
    rules.textContent = isArcade ? 'Type the 10 displayed random words as soon as possible with minimal errors.' : 'Time challenge is under construction';
})