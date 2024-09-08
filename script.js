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

    // Cập nhật các đường dẫn đến âm thanh trong thư mục "sounds"
    const backgroundMusic = new Audio('sounds/background-music.mp3');
    const flipSound = new Audio('sounds/flip-sound.mp3');
    const matchSound = new Audio('sounds/match-sound.mp3');
    const loseSound = new Audio('sounds/lose-sound.mp3');
    const winSound = new Audio('sounds/win-sound.mp3');

    function startGame() {
        gameContainer.classList.add('game-background'); // Thêm lớp có chứa background

        phoneNumber = phoneNumberInput.value.trim();
        playerName = playerNameInput.value.trim();

        if (!phoneNumber || !playerName) {
            alert('Vui lòng nhập tên và số điện thoại.');
            return;
        }

        round = 1;
        score = 0;
        clicksLeft = 15;
        timeLeft = 90;
        flippedCards = [];
        matchedPairs = 0;
        totalScore = 0;
        level = 1;  // Bắt đầu từ cấp độ 1

        setLevel();  // Thiết lập thông số theo cấp độ hiện tại
        updateGameInfo();

        createCards();
        gameScreen.style.display = 'block';
        document.querySelector('.main-screen').style.display = 'none';
        isGameActive = true;

        if (interval) clearInterval(interval);
        interval = setInterval(updateTimer, 1000);

        // Bắt đầu phát nhạc nền
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }

    function setLevel() {
        // Điều chỉnh thông số theo cấp độ
        if (level === 1) {
            clicksLeft = 10;
            timeLeft = 20;
            cardImages = images.slice(0, 2);  // Chỉ sử dụng 2 cặp ảnh
        } else if (level === 2) {
            clicksLeft = 15;
            timeLeft = 90;
            cardImages = images.slice(0, 6);  // Sử dụng 6 cặp ảnh
        } else if (level === 3) {
            clicksLeft = 10;
            timeLeft = 60;
            cardImages = images.slice(0, 8);  // Sử dụng 8 cặp ảnh
        } else if (level === 4) {
            clicksLeft = 15;
            timeLeft = 100;
            cardImages = images.slice(0, 10);  // Sử dụng 10 cặp ảnh
        } else {
            clicksLeft = 15;
            timeLeft = 100;
            cardImages = images.slice(0, 12);  // Sử dụng 12 cặp ảnh
        }

        cardImages = [...cardImages, ...cardImages];  // Tạo bộ đôi hình ảnh
        cardImages = cardImages.sort(() => 0.5 - Math.random());  // Trộn ngẫu nhiên
    }

    function createCards() {
        gameContainer.innerHTML = '';
        gameContainer.classList.remove('round-1-container'); // Xóa lớp cho các vòng khác

        if (round === 1) {
            gameContainer.classList.add('round-1-container'); // Thêm lớp cho vòng 1
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
        flipSound.play(); // Phát âm thanh lật thẻ
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
            matchSound.play(); // Phát âm thanh đúng cặp thẻ
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
            completedMessageElement.textContent = 'qua vòng!';
            completionModal.style.display = 'block';
            nextRoundButton.style.display = 'block';
            winSound.play(); // Phát âm thanh thắng cuộc
            isGameActive = true;
        } else {
            lostMessageElement.innerHTML = `
                <p>Thua cuộc!</p>
                <p>Tên người chơi: ${playerName}</p>
                <p>Số điện thoại: ${phoneNumber}</p>
                <p>Tổng điểm: ${totalScore}</p>
            `;
            lostModal.style.display = 'block';
            nextRoundButton.style.display = 'none';
            loseSound.play(); // Phát âm thanh thua cuộc
            isGameActive = false;
        }

        // Dừng nhạc nền
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Đặt lại thời gian nhạc nền về đầu
    }

    function updateGameInfo() {
        roundElement.textContent = `vòng: ${round}`;
        scoreElement.textContent = `điểm: ${score}`;
        clicksElement.textContent = `lượt chơi: ${clicksLeft}`;
        timeLeftElement.textContent = `Thời gian: ${timeLeft} seconds`;
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

        level++;  // Tăng cấp độ
        setLevel();  // Điều chỉnh thông số theo cấp độ mới

        updateGameInfo();
        completionModal.style.display = 'none';
        lostModal.style.display = 'none';
        nextRoundButton.style.display = 'none';

        createCards();
        if (interval) clearInterval(interval);
        interval = setInterval(updateTimer, 1000);

        // Phát lại nhạc nền
        backgroundMusic.currentTime = 0; // Đặt lại thời gian nhạc nền về đầu
        backgroundMusic.play();
    }

    startGameButton.addEventListener('click', function() {
        startGame();
    });

    nextRoundButton.addEventListener('click', function() {
        nextRound();
    });
});
