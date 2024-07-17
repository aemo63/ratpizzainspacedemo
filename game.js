const canvas = document.getElementById('gameCanvas');

const context = canvas.getContext('2d');

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

// Load images

const playerImg = new Image();

const enemyImg = new Image();

playerImg.src = 'https://cdn.discordapp.com/attachments/982623710743756900/1263078977405456425/player.png';

enemyImg.src = 'https://cdn.discordapp.com/attachments/982623710743756900/1263079433779154944/enemy.png';

const player = {

  x: canvas.width / 2 - 25,

  y: canvas.height - 60,

  width: 50,

  height: 50,

  speed: 10,

};

const bullets = [];

const enemies = [];

const bulletSpeed = 10;

const enemySpeed = 2;

function drawImage(img, x, y, width, height) {
  context.drawImage(img, x, y, width, height);
}

function drawRect(x, y, width, height, color) {
  context.fillStyle = color;

  context.fillRect(x, y, width, height);
}

function handlePlayerMovement() {
  if (leftPressed && player.x > 0) {
    player.x -= player.speed;
  }

  if (rightPressed && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

function handleBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bulletSpeed;

    if (bullets[i].y < 0) {
      bullets.splice(i, 1);

      i--;
    }
  }
}

function handleEnemies() {
  if (Math.random() < 0.02) {
    enemies.push({

      x: Math.random() * (canvas.width - 50),

      y: 0,

      width: 50,

      height: 50,

    });
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemySpeed;

    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);

      i--;
    }
  }
}

function detectCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (bullets[i].x < enemies[j].x + enemies[j].width

                && bullets[i].x + bullets[i].width > enemies[j].x

                && bullets[i].y < enemies[j].y + enemies[j].height

                && bullets[i].y + bullets[i].height > enemies[j].y) {
        enemies.splice(j, 1);

        bullets.splice(i, 1);

        i--;

        break;
      }
    }
  }
}

let leftPressed = false;

let rightPressed = false;

let spacePressed = false;

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') leftPressed = true;

  if (event.code === 'ArrowRight') rightPressed = true;

  if (event.code === 'Space') spacePressed = true;
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') leftPressed = false;

  if (event.code === 'ArrowRight') rightPressed = false;

  if (event.code === 'Space') spacePressed = false;
});

canvas.addEventListener('touchstart', (event) => {
  const touchX = event.touches[0].clientX;

  if (touchX < canvas.width / 2) {
    leftPressed = true;
  } else {
    rightPressed = true;
  }

  spacePressed = true;
});

canvas.addEventListener('touchend', (event) => {
  leftPressed = false;

  rightPressed = false;

  spacePressed = false;
});

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Fill the canvas with a black background

  context.fillStyle = 'black';

  context.fillRect(0, 0, canvas.width, canvas.height);

  handlePlayerMovement();

  if (spacePressed) {
    bullets.push({

      x: player.x + player.width / 2 - 5,

      y: player.y,

      width: 10,

      height: 20,

      color: 'green',

    });

    spacePressed = false; // Prevent continuous shooting
  }

  handleBullets();

  handleEnemies();

  detectCollisions();

  drawImage(playerImg, player.x, player.y, player.width, player.height);

  bullets.forEach((bullet) => drawRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color));

  enemies.forEach((enemy) => drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height));

  requestAnimationFrame(gameLoop);
}

// Ensure the game starts after the images have loaded

playerImg.onload = () => {
  enemyImg.onload = () => {
    gameLoop();
  };
};
