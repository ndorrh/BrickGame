const myCanvas = document.getElementById('myCanvas');
const restartBtn = document.getElementById('restart');
const StartBtn = document.getElementById('start');
const notice = document.getElementById('message');
const leftRightBtnDiv = document.getElementById('score');
const c = myCanvas.getContext('2d');

let data = JSON.parse(localStorage.getItem('gameData'));
let level = data ? data.level : 1;
myCanvas.width = window.innerWidth - 50
myCanvas.height = window.innerHeight - 500
let gravity = Math.random() / 10
let x = myCanvas.width / 2;
let y = myCanvas.height - 30;
let dx = 5 + gravity + level / 2;
let dy = -5 - gravity - level / 2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (myCanvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let highScore = data ? data.highScore : 0;

// live variable
let lives = 3;

const drawLives = () => {
  c.font = '16px Arial';
  c.fillStyle = "#0095DD"
  c.fillText(`Lives: ${lives}`, myCanvas.width - 65, 20)
}

const drawLevel = () => {
  c.font = '16px Arial';
  c.fillStyle = "#0095DD"
  c.fillText(`Level: ${level}`, myCanvas.width - 150, 20)
}

const drawHighScore = () => {
  c.font = '16px Arial';
  c.fillStyle = "#0095DD"
  c.fillText(`High Score: ${highScore}`, myCanvas.width - 450, 20)
}

//Audio variables
const hitSound = new Audio('./soundEffects/hit.wav');
const gameOverSound = new Audio('./soundEffects/bitSound.wav');

//Score variable
let score = 0;

let brickRowCount
let brickColumnCount
let brickWidth
let brickHeight
let brickPadding
let brickOffsetTop
let brickOffsetLeft
// Brick variables
if (myCanvas.width < 769) {
  left.classList.remove('hidden');
  right.classList.remove('hidden');
}

if (myCanvas.width < 426) {
  brickRowCount = 4;
  brickColumnCount = 15;
  brickWidth = myCanvas.width / (brickColumnCount / 0.65);
  brickHeight = myCanvas.height / 15;
  brickPadding = myCanvas.width / 50;
  brickOffsetTop = myCanvas.height / 10;
  brickOffsetLeft = myCanvas.width / 30;
  left.style.width = '50px';
  right.style.width = '50px';
  StartBtn.style.width = '80px';
  restartBtn.style.width = '90px';
} else if (myCanvas.width < 1024) {

  myCanvas.height = window.innerHeight - 300
  brickRowCount = 5;
  brickColumnCount = 26;
  brickWidth = myCanvas.width / (brickColumnCount / 0.67);
  brickHeight = myCanvas.height / 40;
  brickPadding = myCanvas.width / 90;
  brickOffsetTop = myCanvas.height / 10;
  brickOffsetLeft = myCanvas.width / 30;
} else {

  myCanvas.height = window.innerHeight - 200
  brickRowCount = 5;
  brickColumnCount = 26;
  brickWidth = myCanvas.width / (brickColumnCount / 0.67);
  brickHeight = myCanvas.height / 40;
  brickPadding = myCanvas.width / 90;
  brickOffsetTop = myCanvas.height / 10;
  brickOffsetLeft = myCanvas.width / 30;
}

//brick code

const bricks = [];
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//draw bricks

const drawBricks = () => {
  for (let col = 0; col < brickColumnCount; col += 1) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[col][r].status === 1) {
        const brickX = col * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[col][r].x = brickX;
        bricks[col][r].y = brickY;
        c.beginPath();
        c.rect(brickX, brickY, brickWidth, brickHeight);
        c.fillStyle = '#0095DD';
        c.fill();
        c.closePath();
      }
    }
  }
}

// winning message
const winningMessage = () => {
  if (score === brickRowCount * brickColumnCount * level) {
    gameOverSound.play()
    //alert("YOU WIN, CONGRATULATIONS!");
    notice.innerHTML = `YOU WIN, CONGRATULATIONS!`
    start = false
    StartBtn.disabled = true
    StartBtn.innerHTML = 'Disabled'
    level++
    highScore = score > highScore ? score : highScore;
    let gameData = {
      level,
      highScore
    }
    localStorage.setItem('gameData', JSON.stringify(gameData));
    // document.location.reload();
  }
}

// collision detection code
const collisionDetection = () => {
  for (let col = 0; col < brickColumnCount; col += 1) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[col][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          hitSound.play()
          dy = -dy;
          b.status = 0;
          score += level;
          winningMessage()
        }
      }
    }
  }
};

const drawBall = () => {
  c.beginPath();
  c.arc(x, y, ballRadius, 0, 2 * Math.PI);
  c.fillStyle = '#0095DD';
  c.fill();
  c.closePath();
};

const drawPaddle = () => {
  c.beginPath();
  c.rect(paddleX, myCanvas.height - paddleHeight, paddleWidth, paddleHeight);
  c.fillStyle = '#0095DD';
  c.fill();
  c.closePath();
}

const drawScore = () => {
  c.font = '16px Arial';
  c.fillStyle = "#0095DD"
  c.fillText(`Score: ${score}`, 8, 20)
}

let start = false
StartBtn.addEventListener('click', (e) => {
  if (!start) {
    start = true
    draw();
    StartBtn.innerHTML = 'Pause'
  } else {
    StartBtn.innerHTML = 'Start'
    start = false
  }
});

const draw = () => {
  c.clearRect(0, 0, myCanvas.width, myCanvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLevel();
  drawLives();
  drawHighScore()
  collisionDetection();

  if (x + dx > myCanvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > myCanvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy - (Math.random() / 10);
    } else {
      lives--;
      if (!lives) {
        gameOverSound.play()
        notice.classList.add('active')
        notice.innerHTML = `GAME OVER!`
        highScore = score > highScore ? score : highScore;
        let gameData = {
          level,
          highScore
        }
        localStorage.setItem('gameData', JSON.stringify(gameData));
        start = false
        StartBtn.disabled = true
        StartBtn.innerHTML = 'Disabled'
      } else {
        x = myCanvas.width / 2;
        y = myCanvas.height - 30;
        dx = 5 + (Math.random() / 10) + level / 2;
        dy = -5 - (Math.random() / 10) - level / 2;
        paddleX = (myCanvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX = Math.min(paddleX + 7 + (level / 5), myCanvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 7 - (level / 5), 0);
  }

  x += dx;
  y += dy;

  const strt = async (start) => {
    start && requestAnimationFrame(draw)

  }
  strt(start)

}

draw()

const keyDownHandler = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
};

const keyUpHandler = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}



const mouseMoveHandler = (e) => {
  const relativeX = e.clientX - myCanvas.offsetLeft;
  if (relativeX > 0 && relativeX < myCanvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

const pressRightOrLeftBtnHandler = (e) => {
  if (e.target.id === 'right' ) {
    //console.log('right')
    rightPressed = true;
  } else if (e.target.id === 'left') {
    console.log('left')
    //leftPressed = true;
  }
}

const releaseLeftOrBtnHandler = (e) => {
  
  if (e.target.id === 'right') {
    rightPressed = false;
  } else if (e.target.id === 'left') {
    console.log('left')
    leftPressed = false;
  }
}

window.addEventListener('keydown', keyDownHandler, false);

leftRightBtnDiv.addEventListener('click', pressRightOrLeftBtnHandler, false);
leftRightBtnDiv.addEventListener('mouseout', releaseLeftOrBtnHandler, false);

window.addEventListener('keyup', keyUpHandler, false);

document.addEventListener('mousemove', mouseMoveHandler, false)

restartBtn.addEventListener('click', () => {
  document.location.reload();
});

window.addEventListener('resize', () => {
  // myCanvas.height = window.innerHeight;
  // myCanvas.width = window.innerWidth;

  document.location.reload();
})
