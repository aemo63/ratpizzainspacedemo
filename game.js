// Canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Game variables
let score = 0;
let hearts = 3;

// Game objects (example)
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5
};

let enemies = [];

// Event listener for key presses (example)
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        player.x -= player.speed;
    } else if (event.key === 'ArrowRight') {
        player.x += player.speed;
    }
});

// Game loop
function gameLoop() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update game state
    // Example: Update player position
    // Example: Update enemies

    // Draw game elements
    drawPlayer();
    drawEnemies();

    // Example: Collision detection
    // Example: Scoring logic

    // Draw UI elements (score, hearts)
    drawScore();
    drawHearts();

    // Check game over conditions
    if (hearts <= 0) {
        gameOver();
    } else {
        requestAnimationFrame(gameLoop); // Loop
    }
}

// Draw player function (example)
function drawPlayer() {
    context.fillStyle = 'blue';
    context.fillRect(player.x, player.y, player.width, player.height);
}

// Draw enemies function (example)
function drawEnemies() {
    context.fillStyle = 'red';
    // Example: Loop through enemies array and draw each enemy
    // for (let i = 0; i < enemies.length; i++) {
    //     context.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    // }
}

// Draw score function (example)
function drawScore() {
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.fillText('Score: ' + score, 20, 30);
}

// Draw hearts function (example)
function drawHearts() {
    context.fillStyle = 'red';
    context.font = '24px Arial';
    let heartString = 'Hearts: ';
    for (let i = 0; i < hearts; i++) {
        heartString += '❤️';
    }
    context.fillText(heartString, canvas.width - 150, 30);
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

// Restart game function (example)
function restartGame() {
    // Reset game variables
    score = 0;
    hearts = 3;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;

    // Reset enemies array, etc.

    // Hide game over screen
    let gameOverScreen = document.getElementById('gameOverScreen');
    gameOverScreen.style.display = 'none';

    // Start game loop again
    gameLoop();
}

// Start the game loop
gameLoop();
