// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_i9NWCqb04Imfw4UW0BqLE4jvzOi0t-M",
    authDomain: "gamejrf-4423b.firebaseapp.com",
    projectId: "gamejrf-4423b",
    storageBucket: "gamejrf-4423b.appspot.com",
    messagingSenderId: "915828708458",
    appId: "1:915828708458:web:9b4f5350ae2f8c41f5a613",
    measurementId: "G-XJV3ZFT98F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// Game variables
const images = [
    'image1.png', 'image2.png', 'image3.png', 'image4.png',
    'image5.png', 'image6.png', 'image7.png', 'image8.png',
    'image9.png', 'image10.png', 'image11.png', 'image12.png',
    'image13.png', 'image14.png', 'image15.png', 'image16.png'
];

const backImage = 'back.png';

const gameContainer = document.querySelector('.game-container');
const roundElement = document.getElementById('round');
const scoreElement = document.getElementById('score');
const clicksElement = document.getElementById('clicks');
const timeLeftElement = document.getElementById('time-left');
const completionModal = document.getElementById('completion-modal');
const lostModal = document.getElementById('lost-modal');
const completedMessageElement = document.getElementById('completed-message');
const nextRoundButton = document.getElementById('next-round');
const lostMessageElement = document.getElementById('lost-message');
const startGameButton = document.getElementById('start-game');
const phoneNumberInput = document.getElementById('phone-number');
const gameScreen = document.querySelector('.game-screen');
const mainScreen = document.querySelector('.main-screen');
const playerNameInput = document.getElementById('player-name');

let round = 1;
let score = 0;
let clicksLeft = 15;
let timeLeft = 90;
let flippedCards = [];
let matchedPairs = 0;
let cardImages = [];
let interval;
let totalScore = 0;
let phoneNumber = '';
let playerName = '';
let isGameActive = false;

// Sound effects
const backgroundMusic = new Audio('sounds/background-music.mp3');
const flipSound = new Audio('sounds/flip-sound.mp3');
const matchSound = new Audio('sounds/match-sound.mp3');
const loseSound = new Audio('sounds/lose-sound.mp3');
const winSound = new Audio('sounds/win-sound.mp3');

// Start game function
function startGame() {
    phoneNumber = phoneNumberInput.value.trim(); // Get phone number
    playerName = playerNameInput.value.trim(); // Get player name

    gameScreen.style.display = 'block'; // Show game screen
    mainScreen.style.display = 'none';  // Hide main screen

    round = 1;
    score = 0;
    clicksLeft = 15;
    timeLeft = 90;
    flippedCards = [];
    matchedPairs = 0;
    totalScore = 0;

    setLevel();
    updateGameInfo();
    createCards();

    if (interval) clearInterval(interval);
    interval = setInterval(updateTimer, 1000);

    backgroundMusic.loop = true;
    backgroundMusic.play();
    isGameActive = true;
}

function setLevel() {
    // Update game settings for each round
    const numPairs = round <= 7 ? round + 1 : 8; // Increase the number of pairs each round, up to 8 pairs

    clicksLeft = 15;
    timeLeft = 90;
    cardImages = images.slice(0, numPairs); // Select images for current round

    cardImages = [...cardImages, ...cardImages]; // Duplicate cards
    cardImages = cardImages.sort(() => 0.5 - Math.random()); // Shuffle cards

    matchedPairs = 0; // Reset matched pairs for the new round
}

function createCards() {
    gameContainer.innerHTML = '';
    gameContainer.classList.remove('round-1-container');

    cardImages.forEach((img, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', index);
        card.innerHTML = `
            <img src="images/${backImage}" class="back-face">
            <img src="images/${img}" class="front-face">
        `;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

function flipCard() {
    if (flippedCards.length === 2 || !isGameActive || this.classList.contains('flip')) return;
    const card = this;
    flipSound.play();
    card.classList.add('flip');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstImage = firstCard.querySelector('.front-face').src;
    const secondImage = secondCard.querySelector('.front-face').src;

    if (firstImage === secondImage) {
        matchedPairs++;
        score += 10;
        totalScore += 10;
        matchSound.play();
        updateGameInfo();

        if (matchedPairs === cardImages.length / 2) {
            endRound(true);
        }
    } else {
        clicksLeft--;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
        }, 1000);

        if (clicksLeft <= 0) {
            endRound(false);
        }
    }

    flippedCards = [];
    clicksElement.textContent = `Lượt chơi: ${clicksLeft}`;
}

function updateTimer() {
    timeLeft--;
    timeLeftElement.textContent = `Thời gian: ${timeLeft} giây`;
    if (timeLeft <= 0) {
        endRound(false);
    }
}

function endRound(isWinner) {
    isGameActive = false;
    clearInterval(interval);
    backgroundMusic.pause();

    if (isWinner) {
        completionModal.style.display = 'block';
        completedMessageElement.textContent = `Chúc mừng bạn đã hoàn thành vòng ${round} với ${score} điểm!`;
        winSound.play();
    } else {
        lostModal.style.display = 'block';
        lostMessageElement.textContent = `Hết lượt chơi! Bạn đã đạt ${score} điểm.`;
        loseSound.play();
        savePlayerData();
    }
}

function continuePlaying() {
    if (matchedPairs === cardImages.length / 2) {
        completionModal.style.display = 'none';
        round++;
        setLevel();
        updateGameInfo();
        createCards();

        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('flip');
        });

        isGameActive = true;
        interval = setInterval(updateTimer, 1000);
        backgroundMusic.play();
    } else {
        alert('Bạn cần lật đủ tất cả các cặp thẻ để tiếp tục!');
    }
}

// Save player data to Firebase
async function savePlayerData() {
    try {
        // Save to Firestore
        await setDoc(doc(db, 'players', phoneNumber), {
            name: playerName,
            phoneNumber: phoneNumber,
            score: totalScore
        });

        // Save to Realtime Database
        await set(ref(realtimeDb, 'players/' + phoneNumber), {
            name: playerName,
            score: totalScore
        });

        console.log("Player data saved successfully");
    } catch (error) {
        console.error("Error saving player data: ", error);
    }
}

// Update game info function
function updateGameInfo() {
    roundElement.textContent = `Vòng: ${round}`;
    scoreElement.textContent = `Điểm: ${score}`;
    clicksElement.textContent = `Lượt chơi: ${clicksLeft}`;
    timeLeftElement.textContent = `Thời gian: ${timeLeft} giây`;
}

// Start game button click handler
startGameButton.addEventListener('click', startGame);

// Next round button click handler
nextRoundButton.addEventListener('click', continuePlaying);

// When the user leaves the page, save player data
window.addEventListener('beforeunload', () => {
    if (isGameActive) {
        savePlayerData();
    }
});
