'use strict';
const randomWordEle = document.querySelector('#random-word');
const typer = document.querySelector('#typer');
const wordsCompletedEle = document.querySelector('#typed-words');
const charactersMissSpelledEle = document.querySelector('#error-chars');

let allWords = [];
let currentRandomWords = [];
let currentWord = '';
let currentIndex = 0;
let wordsCompleted = 0;
let charactersMissSpelled = 0;
let isInsert = null;
let displayedWords = 4;

let wordsToBeTested = 10;

wordsCompletedEle.textContent = wordsCompleted;
charactersMissSpelledEle.textContent = charactersMissSpelled;

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
    isInsert = e.inputType === 'insertText';
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
            alert(`You have completed ${wordsCompleted} words with ${charactersMissSpelled} miss-spelled characters.`);
            window.location.reload();
        }
        typer.value = '';
    } else if (currentWord.indexOf(typedWord) !== 0) {
        highlightError();
    } else {
        removeError();
    }
})

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

