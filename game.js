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

// Event listener for key presses
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
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
    updateEnemies();

    // Draw game elements
    drawPlayer();
    drawEnemies();
    drawScore();
    drawHearts();

    // Check game over conditions
    if (hearts <= 0) {
        gameOver();
    } else {
        requestAnimationFrame(gameLoop); // Request next frame
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
    // Move existing enemies downwards
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 2; // Speed of enemy movement
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            i--;
            hearts--; // Lose a heart if an enemy passes the player
        }
    }

    // Randomly create new enemies
    if (Math.random() < 0.02) { // Adjust the rate of enemy creation
        let enemy = {
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50
        };
        enemies.push(enemy);
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
    score = 0;
    hearts = 3;
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 60;
    enemies = []; // Reset enemies array or reinitialize

    // Hide game over screen
    let gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = 'none';

    // Start game loop again
    gameLoop();
}

// Start the game loop
gameLoop();
