// Game elements
const main = document.querySelector("main");
const startPage = document.querySelector(".start-page");
const endPage = document.querySelector(".end-page");
const newBallPage = document.querySelector(".new-ball-con");
const newBall = document.querySelector(".new-ball img");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasWidth = (canvas.width = main.offsetWidth);
const canvasHeight = (canvas.height = main.offsetHeight);

// Sound elements
const seaSound = document.querySelector(".sea-sound");
const endSound = document.querySelector(".end-sound");
seaSound.volume = 0.1;
endSound.volume = 0.1;
seaSound.loop = true;
// Game controls
const startBtn = document.querySelector(".start-btn");
const practiceBtn = document.querySelector(".practice-btn");
const endBtn = document.querySelector(".restart-btn");
const scoreBtn = document.querySelector(".score-btn");
const newBallBtn = document.querySelector(".new-ball-btn");
const scoreDiv = document.querySelector(".score span");
const leaderboardDiv = document.querySelector(".leaderboard");
const leaderboardScoresDiv = document.querySelector(".leaderboard-scores");
const leaderboardCloseBtn = document.querySelector(".leaderboard-close");
const playerNameInput = document.getElementById("player-name");

// Game values
let isGameStarted = false;
let speed = 1;
let ball = null;
let bG1 = null;
let bG2 = null;
let bgSpeed = null;
let ballSpeed = null;
let previousBall = 0;
let randomBallIndex = null;
let score = 0;
let isPracticeMode = false;
let groundIndex = 0;
let keyboard = true;
let animateId = null;
let bgArray = [];
let inactivityTimer;
const bGImagesArray = [
    "./images/blue-bg.jpg",
    "./images/orange-bg.jpg",
    "./images/green-bg.jpg",
    "./images/yellow-bg.jpg",
    "./images/olive-bg.jpg",
];
const ballsArray = [
    "blue-surf",
    "orange-surf",
    "green-surf",
    "yellow-surf",
    "olive-surf",
];
const ballTouchPoint = canvasHeight * 0.63;
const ballStartPosition = canvasHeight * 0.22;

// Game classes
class Background {
    constructor(bgSrc, x, y, width, height) {
        this.bg = new Image();
        this.bg.src = bgSrc;
        this.bg.onload = () => {
            this.draw();
        };
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.id = "blue";
    }

    draw() {
        ctx.drawImage(this.bg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.x -= this.speed;
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }
}

class Ball {
    constructor(ballSrc, x, y, width, height) {
        this.ball = new Image();
        this.ball.src = ballSrc;
        this.ball.onload = () => {
            this.draw();
        };
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.id = "blue";
    }

    draw() {
        ctx.drawImage(this.ball, this.x, this.y, this.width, this.height);
    }

    update() {
        if (this.y >= ballTouchPoint || this.y <= ballStartPosition) {
            this.speed = -this.speed;
        }
        if (this.y <= ballStartPosition) {
            randomBallIndex = createRandomIndex(randomBallIndex, ballsArray)
            let newId = ballsArray[randomBallIndex].slice(0, -5);
            this.ball.src = "./images/" + newId + "-surf.png";
            this.id = newId;
            previousBall = randomBallIndex
        }
        this.y += this.speed;
    }
}

// Canvas elements
ball = new Ball(
    "./images/blue-surf.png",
    canvasWidth * 0.3,
    ballStartPosition + 50,
    canvasWidth * 0.1,
    canvasWidth * 0.1
);

bG1 = new Background(
    "./images/blue-bg.jpg",
    0,
    0,
    canvasWidth,
    canvasHeight
);
bgArray.push(bG1);
bG2 = new Background(
    "./images/blue-bg.jpg",
    canvasWidth,
    0,
    canvasWidth,
    canvasHeight
);
bgArray.push(bG2);


function updateSpeeds() {
    ball.speed = speed;
    bG1.speed = speed;
    bG2.speed = speed;
}


// Game functions
function startGame() {
    seaSound.muted = false;
    seaSound.play()
    isGameStarted = true;
    ballSpeed = speed;
    bgSpeed = speed;
    ball.speed = ballSpeed;
    bG1.speed = bgSpeed;
    bG2.speed = bgSpeed;
    animate();
}

function animate() {
    animateId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (ball.y >= ballTouchPoint && ball.id !== bG1.id) {
        endGame();
    } else if (ball.y >= ballTouchPoint && ball.id === bG1.id) {
        score += 10;
        scoreDiv.textContent = score;
        if (score % 30 === 0) {
            cancelAnimationFrame(animateId);
            newBallPage.classList.remove("d-none");
            speed++;
            updateSpeeds();
        }
    }
    if (bG2.x <= canvas.getBoundingClientRect().left) {
        bG1.x = 0;
        bG2.x = canvasWidth;
    }

    bG1.update();
    bG2.update();

    ball.draw();
    ball.update();
}

// Click functions
startBtn.onclick = () => {
    isPracticeMode = false;
    startPage.classList.add("d-none");
    startGame();
};

// Practice button onclick to start the game in practice mode
practiceBtn.onclick = () => {
    isPracticeMode = true;
    startPage.classList.add("d-none");
    startGame();
};

endBtn.onclick = () => {
    location.reload();
};

newBallBtn.onclick = () => {
    newBallPage.classList.add("d-none");
    animate();
};

scoreBtn.onclick = () => {
    showLeaderboard();
};

leaderboardCloseBtn.onclick = () => {
    leaderboardDiv.classList.toggle("d-none");
};

// Show leaderboard
function showLeaderboard() {
    leaderboardDiv.classList.remove("d-none");
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
    const leaderboardScoresDiv = document.querySelector(".leaderboard-scores-inner");
    leaderboardScoresDiv.innerHTML = "";

    leaderboard.forEach((playerData, index) => {
        const leaderboardItem = document.createElement("div");
        leaderboardItem.textContent = `${index + 1}. ${playerData.name} - ${playerData.score} points`;
        leaderboardScoresDiv.appendChild(leaderboardItem);
    });
}

// Create random ball color
function createRandomIndex(item, arr) {
    do {
        item = Math.floor(Math.random() * arr.length);
    } while (item === previousBall);
    return item;
}

// Change ground color functions
function changeBgColor() {

    if (groundIndex === bGImagesArray.length - 1) {
        groundIndex = 0;
    } else {
        groundIndex++
    }
    const newBg = bGImagesArray[groundIndex];
    bgArray.forEach((item) => {
        item.bg.src = "";
        item.bg.src = newBg;
        item.id = newBg.slice(9, -7);
        item.draw();
    });
}

const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        showLeaderboard();
    }, 30000);
};

// Event listeners to reset the inactivity timer
window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("keydown", resetInactivityTimer);

// Initial render of the leaderboard
document.addEventListener("DOMContentLoaded", () => {
    resetInactivityTimer();
});

canvas.addEventListener("click", changeBgColor);
document.addEventListener("keydown", function (event) {
    if (event.key === " " && keyboard && isGameStarted) {
        changeBgColor();
    }
});

// End game function
function endGame() {
    seaSound.muted = true;
    seaSound.currentTime = 0;
    isGameStarted = false;
    keyboard = false;
    canvas.removeEventListener("click", changeBgColor);
    cancelAnimationFrame(animateId);
    endPage.classList.remove("d-none");
    endSound.play();

    const playerName = playerNameInput.value.trim();
    const playerScore = score;

    if (!isPracticeMode && playerName && playerScore >= 0) {
        const playerData = {name: playerName, score: playerScore};
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push(playerData);
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        displayLeaderboard(leaderboard);
    }
}
