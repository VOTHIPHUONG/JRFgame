document.addEventListener('DOMContentLoaded', function() {
    const images = [
        'image1.png',
        'image2.png',
        'image3.png',
        'image4.png',
        'image5.png',
        'image6.png',
        'image7.png',
        'image8.png'
    ];

    const backImages = [
        'back1.png',
        'back2.png',
        'back3.png',
        'back4.png',
        'back5.png',
        'back6.png',
        'back7.png',
        'back8.png',
        'back9.png',
        'back10.png',
        'back11.png',
        'back12.png',
        'back13.png',
        'back14.png',
        'back15.png',
        'back16.png'
    ];

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

    let round = 1;
    let score = 0;
    let clicksLeft = 15;
    let timeLeft = 90;
    let flippedCards = [];
    let matchedPairs = 0;
    let cardImages = [];
    let interval;
    let totalScore = 0; // To keep track of total score across rounds
    let phoneNumber = '';
    let isGameActive = false; // To check if the game is active

    function startGame() {
        phoneNumber = phoneNumberInput.value.trim(); // Capture the phone number
        if (!phoneNumber) {
            alert('Vui lòng nhập số điện thoại.');
            return;
        }

        round = 1;
        score = 0;
        clicksLeft = 15;
        timeLeft = 90;
        flippedCards = [];
        matchedPairs = 0;
        totalScore = 0; // Reset total score at the start of a new game

        updateGameInfo();

        // Shuffle and create cards
        createCards();
        gameScreen.style.display = 'block';
        document.querySelector('.main-screen').style.display = 'none';
        isGameActive = true; // Mark game as active

        if (interval) clearInterval(interval);
        interval = setInterval(updateTimer, 1000);
    }

    function createCards() {
        cardImages = [...images, ...images];
        cardImages = cardImages.sort(() => 0.5 - Math.random());

        gameContainer.innerHTML = '';
        cardImages.forEach((img, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', index);
            card.innerHTML = `
                <img src="images/${backImages[index]}" class="back-face">
                <img src="images/${img}" class="front-face">
            `;
            card.addEventListener('click', flipCard);
            gameContainer.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length === 2 || !isGameActive || this.classList.contains('flip')) return;
        const card = this;
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
            score += 10; // Add 10 points for each correct match
            totalScore += 10; // Add to total score
            updateGameInfo(); // Update score display
            if (matchedPairs === 8) {
                endRound(true);
            }
        } else {
            score -= 5;
            clicksLeft--;
            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                updateGameInfo(); // Update score and clicks display
            }, 1000);
        }

        flippedCards = [];

        // Check if the game is over due to clicks running out
        if (clicksLeft <= 0) {
            endRound(false);
        }
    }

    function endRound(won) {
        clearInterval(interval);
        if (won) {
            completedMessageElement.textContent = 'Bạn đã thắng!';
            completionModal.style.display = 'block';
            nextRoundButton.style.display = 'block'; // Show next round button
            isGameActive = true; // Allow the game to be active for the next round
        } else {
            lostMessageElement.innerHTML = `
                <p>Thua cuộc!</p>
                <p>Số điện thoại: ${phoneNumber}</p>
                <p>Tổng điểm: ${totalScore}</p>
            `;
            lostModal.style.display = 'block';
            nextRoundButton.style.display = 'none'; // Hide next round button
            isGameActive = false; // Prevent further play
        }
    }

    function updateGameInfo() {
        roundElement.textContent = `Round: ${round}`;
        scoreElement.textContent = `Score: ${score}`;
        clicksElement.textContent = `Clicks Left: ${clicksLeft}`;
        timeLeftElement.textContent = `Time Left: ${timeLeft} seconds`;
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
        // Reset for the new round
        matchedPairs = 0;
        clicksLeft = 15;
        timeLeft = 90;
        updateGameInfo();
        completionModal.style.display = 'none';
        lostModal.style.display = 'none';
        nextRoundButton.style.display = 'none';
        createCards();
        if (interval) clearInterval(interval);
        interval = setInterval(updateTimer, 1000);
    }

    startGameButton.addEventListener('click', function() {
        startGame();
    });
    
    nextRoundButton.addEventListener('click', function() {
        nextRound();
    });
});
