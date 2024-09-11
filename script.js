document.addEventListener('DOMContentLoaded', function() {
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
    let level = 1;  // Bắt đầu từ cấp độ 1

    const backgroundMusic = new Audio('sounds/background-music.mp3');
    const flipSound = new Audio('sounds/flip-sound.mp3');
    const matchSound = new Audio('sounds/match-sound.mp3');
    const loseSound = new Audio('sounds/lose-sound.mp3');
    const winSound = new Audio('sounds/win-sound.mp3');

    function startGame() {
        gameContainer.classList.add('game-background');

        // Bỏ qua kiểm tra dữ liệu nhập
        phoneNumber = phoneNumberInput.value.trim(); // Lấy số điện thoại
        playerName = playerNameInput.value.trim(); // Lấy tên người chơi

        round = 1;
        score = 0;
        clicksLeft = 15;
        timeLeft = 90;
        flippedCards = [];
        matchedPairs = 0;
        totalScore = 0;
        level = 1;

        setLevel();
        updateGameInfo();

        createCards();
        gameScreen.style.display = 'block';
        document.querySelector('.main-screen').style.display = 'none';
        isGameActive = true;

        if (interval) clearInterval(interval);
        interval = setInterval(updateTimer, 1000);

        backgroundMusic.loop = true;
        backgroundMusic.play();
    }

    function setLevel() {
        if (level === 1) {
            clicksLeft = 10;
            timeLeft = 20;
            cardImages = images.slice(0, 2);
        } else if (level === 2) {
            clicksLeft = 15;
            timeLeft = 60;
            cardImages = images.slice(0, 6);
        } else if (level === 3) {
            clicksLeft = 10;
            timeLeft = 60;
            cardImages = images.slice(0, 8);
        } else if (level === 4) {
            clicksLeft = 15;
            timeLeft = 60;
            cardImages = images.slice(0, 10);
        } else {
            clicksLeft = 15;
            timeLeft = 60;
            cardImages = images.slice(0, 12);
        }

        cardImages = [...cardImages, ...cardImages];
        cardImages = cardImages.sort(() => 0.5 - Math.random());
    }

    function createCards() {
        gameContainer.innerHTML = '';
        gameContainer.classList.remove('round-1-container');

        if (round === 1) {
            gameContainer.classList.add('round-1-container');
        }

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
                updateGameInfo();
            }, 1000);
        }

        flippedCards = [];

        if (clicksLeft <= 0) {
            endRound(false);
        }
    }

    function endRound(won) {
        clearInterval(interval);
        if (won) {
            completedMessageElement.textContent = 'Qua vòng!';
            completionModal.style.display = 'block';
            nextRoundButton.style.display = 'block';
            winSound.play();
        } else {
            lostMessageElement.innerHTML = `
                <p>Thua cuộc!</p>
                <p>Tên người chơi: ${playerName}</p>
                <p>Số điện thoại: ${phoneNumber}</p>
                <p>Tổng điểm: ${totalScore}</p>
            `;
            lostModal.style.display = 'block';
            nextRoundButton.style.display = 'none';
            loseSound.play();
        }

        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        savePlayerData();

        isGameActive = false;
    }

    function updateGameInfo() {
        roundElement.textContent = `Vòng: ${round}`;
        scoreElement.textContent = `Điểm: ${score}`;
        clicksElement.textContent = `Lượt chơi: ${clicksLeft}`;
        timeLeftElement.textContent = `Thời gian: ${timeLeft} giây`;
    }

    function updateTimer() {
        timeLeft--;
        if (timeLeft <= 0) {
            endRound(false);
        } else {
            updateGameInfo();
        }
    }

    function nextRound() {
        round++;
        matchedPairs = 0;

        level++;
        setLevel();

        updateGameInfo();
        completionModal.style.display = 'none';
        lostModal.style.display = 'none';
        nextRoundButton.style.display = 'none';

        createCards();
        if (interval) clearInterval(interval);
        interval = setInterval(updateTimer, 1000);

        backgroundMusic.currentTime = 0;
        backgroundMusic.play();

        isGameActive = true;
    }

    async function savePlayerData() {
        console.log("Saving player data...");
        try {
            const playerData = {
                name: playerName,  // Lấy tên người chơi từ input
                phone: phoneNumber,  // Lấy số điện thoại từ input
                score: totalScore,  // Điểm số của người chơi
                date: new Date().toISOString()  // Thời gian lưu
            };
    
            // Đặt dữ liệu vào đường dẫn `players/phoneNumber` trong Realtime Database
            const playerRef = ref(db, 'players/' + phoneNumber);
            await set(playerRef, playerData);
    
            console.log("Player data saved successfully");
        } catch (error) {
            console.error("Error saving player data: ", error);
        }
    }
    
    
    

    startGameButton.addEventListener('click', startGame);
    nextRoundButton.addEventListener('click', nextRound);
});
