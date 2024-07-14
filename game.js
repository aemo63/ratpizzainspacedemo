const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 10,
    color: "white",
    hearts: 3
};

let score = 0;
const bullets = [];
const enemyBullets = [];
const enemies = [];
const bulletSpeed = 10;
const enemySpeed = 2;
const enemyBulletSpeed = 5;

let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let gamePaused = false;

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawText(text, x, y, color, fontSize = "20px") {
    context.fillStyle = color;
    context.font = `${fontSize} Arial`;
    context.fillText(text, x, y);
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

function handleEnemyBullets() {
    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += enemyBulletSpeed;
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
            i--;
        }
    }
}

function handleEnemies() {
    if (!gamePaused && Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50,
            color: "red",
            direction: Math.random() < 0.5 ? 1 : -1,
            moveSideways: Math.random() < 0.5
        });
    }
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;

        if (enemies[i].moveSideways) {
            enemies[i].x += enemies[i].direction * enemySpeed;
            if (enemies[i].x <= 0 || enemies[i].x + enemies[i].width >= canvas.width) {
                enemies[i].direction *= -1;
            }
        }

        if (!gamePaused && Math.random() < 0.01) {
            enemyBullets.push({
                x: enemies[i].x + enemies[i].width / 2 - 5,
                y: enemies[i].y + enemies[i].height,
                width: 10,
                height: 20,
                color: "purple"
            });
        }

        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
            player.hearts -= 0.5;
            if (player.hearts <= 0) {
                gameOver();
            }
        }
    }
}

function detectCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y) {
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                i--;
                score += 5;
                displayScoreText(bullets[i].x, bullets[i].y);
                break;
            }
        }
    }
}

function detectPlayerHit() {
    for (let i = 0; i < enemyBullets.length; i++) {
        if (enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y) {
            enemyBullets.splice(i, 1);
            i--;
            player.hearts -= 0.5;
            if (player.hearts <= 0) {
                gameOver();
            }
        }
    }
}

function displayScoreText(x, y) {
    context.fillStyle = "yellow";
    context.font = "20px Arial";
    context.fillText("+5", x, y);
}

function gameOver() {
    gamePaused = true;
    gameOverScreen.style.display = "block";
    finalScore.textContent = `Your final score is: ${score}`;
}

function resetGame() {
    player.hearts = 3;
    score = 0;
    bullets.length = 0;
    enemyBullets.length = 0;
    enemies.length = 0;
    player.x = canvas.width / 2 - 25;
    gamePaused = false;
}

function restartGame() {
    gameOverScreen.style.display = "none";
    resetGame();
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    handlePlayerMovement();

    if (!gamePaused && spacePressed) {
        bullets.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 20,
            color: "green"
        });
        spacePressed = false;  // Prevent continuous shooting
    }

    handleBullets();
    handleEnemies();
    handleEnemyBullets();
    detectCollisions();
    detectPlayerHit();

    drawRect(player.x, player.y, player.width, player.height, player.color);
    bullets.forEach(bullet => drawRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color));
    enemies.forEach(enemy => drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color));
    enemyBullets.forEach(bullet => drawRect(bullet.x, bullet.y, bullet.width, bullet.height, bullet.color));

    // Draw score
    drawText(`Score: ${score}`, 10, 30, "white");

    // Draw hearts
    drawText(`Hearts: ${player.hearts}`, 10, 60, "white");

    requestAnimationFrame(gameLoop);
}

// Event listeners for player controls
document.addEventListener("keydown", (
