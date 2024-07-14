// Canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Resize canvas to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call to set canvas size

// Game variables
let score = 0;
let hearts = 3;
let player = {
    x: canvas.width / 2 - 25, // Center the player
    y: canvas.height - 60,    // Position the player 50px above the bottom of the canvas
    width: 50,
    height: 50,
    speed: 5
};
let enemies = [];
let playerBullets = [];
let enemyBullets = [];

// Event listener for key presses
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (event.key === ' ') { // Space key for shooting
        shootPlayerBullet();
    }
});

// Event listeners for touch events
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);

function handleTouch(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const touchX = touch.clientX;

    if (touchX < canvas.width / 2 && player.x > 0) {
        player.x -= player.speed;
    } else if (touchX > canvas.width / 2 && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

// Game loop
function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update game state
    updatePlayerBullets();
    updateEnemies();
    updateEnemyBullets();

    // Draw game elements
    drawPlayer();
    drawPlayerBullets();
    drawEnemies();
    drawEnemyBullets();
    drawScore();
    drawHearts();

    // Check game over conditions
    if (hearts <= 0) {
        gameOver();
    } else {
        requestAnimationFrame(gameLoop); // Request next frame
    }
}

// Shoot player bullet
function shootPlayerBullet() {
    playerBullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7
    });
}

// Update player bullets
function updatePlayerBullets() {
    for (let i = 0; i < playerBullets.length; i++) {
        playerBullets[i].y -= playerBullets[i].speed;
        if (playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
            i--;
        } else {
            for (let j = 0; j < enemies.length; j++) {
                if (checkCollision(playerBullets[i], enemies[j])) {
                    playerBullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += 5;
                    i--;
                    break;
                }
            }
        }
    }
}

// Draw player bullets
function drawPlayerBullets() {
    context.fillStyle = 'white';
    for (let i = 0; i < playerBullets.length; i++) {
        context.fillRect(playerBullets[i].x, playerBullets[i].y, playerBullets[i].width, playerBullets[i].height);
    }
}

// Draw player function
function drawPlayer() {
    context.fillStyle = 'blue';
    context.fillRect(player.x, player.y, player.width, player.height);
}

// Draw enemies function
function drawEnemies() {
    context.fillStyle = 'red';
    for (let i = 0; i < enemies.length; i++) {
        context.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }
}

// Update enemies function
function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 2; // Move enemies downwards

        // Some enemies move left and right
        if (enemies[i].direction === 'left') {
            enemies[i].x -= 1;
            if (enemies[i].x <= 0) enemies[i].direction = 'right';
        } else {
            enemies[i].x += 1;
            if (enemies[i].x + enemies[i].width >= canvas.width) enemies[i].direction = 'left';
        }

        // Enemies shoot bullets
        if (Math.random() < 0.01) {
            enemyBullets.push({
                x: enemies[i].x + enemies[i].width / 2 - 2.5,
                y: enemies[i].y + enemies[i].height,
                width: 5,
                height: 10,
                speed: 4
            });
        }

        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
            hearts--; // Lose half a heart if an enemy passes the player
        }
    }

    // Randomly create new enemies
    if (Math.random() < 0.02) {
        let enemy = {
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            direction: Math.random() < 0.5 ? 'left' : 'right'
        };
        enemies.push(enemy);
    }
}

// Update enemy bullets
function updateEnemyBullets() {
    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += enemyBullets[i].speed;
        if (enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
            i--;
        } else if (checkCollision(enemyBullets[i], player)) {
            enemyBullets.splice(i, 1);
            hearts--; // Lose half a heart if hit by an enemy bullet
            i--;
        }
    }
}

// Draw enemy bullets
function drawEnemyBullets() {
    context.fillStyle = 'yellow';
    for (let i = 0; i < enemyBullets.length; i++) {
        context.fillRect(enemyBullets[i].x, enemyBullets[i].y, enemyBullets[i].width, enemyBullets[i].height);
    }
}

// Draw score function
function drawScore() {
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.fillText('Score: ' + score, 20, 30);
}

// Draw hearts function
function drawHearts() {
    context.fillStyle = 'red';
    context.font = '24px Arial';
    context.fillText('Hearts: ' + hearts, canvas.width - 150, 30);
}

// Game over function
function gameOver() {
    // Display game over screen
    let gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = 'block';

    // Display final score
    let scoreSpan = document.getElementById('score');
    scoreSpan.textContent = score;
}

// Restart game function
function restartGame() {
    // Reset game variables
