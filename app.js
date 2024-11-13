// Get game elements
var jet = document.getElementById("jet");
var board = document.getElementById("board");
var scoreElement = document.getElementById("points");
var finalScoreElement = document.getElementById("final-score");
var gameOverOverlay = document.getElementById("game-over-overlay");
var score = 0;
var gameOver = false;

var generaterocks, moverocks;
// Variables to hold the intervals
var moveInterval;
var shootInterval;



// Object to track which keys are pressed
var keysPressed = {};
var lastShotTime = 0; // Track the last bullet shot time

// Update initGame to add a delay and clear rocks
function initGame() {
    score = 0;
    scoreElement.innerHTML = score;
    gameOver = false;
    gameOverOverlay.style.display = "none";
    jet.style.left = "50%"; // Center the jet
  
    // Clear any rocks from a previous session
    document.querySelectorAll(".rocks").forEach((rock) => rock.remove());
  
    // Add event listeners for keydown and keyup
    window.addEventListener("keydown", (e) => keysPressed[e.key] = true);
    window.addEventListener("keyup", (e) => keysPressed[e.key] = false);
  
    // Delay before starting rock generation and movement
    setTimeout(() => {
      generaterocks = setInterval(createRock, 1000); // Generate rocks every second
      moverocks = setInterval(moveRocks, 100); // Move rocks every 50ms
      gameLoop(); // Start the game loop for continuous movement/shooting
    }, 2000); // Adjust delay (in milliseconds) as needed
}
  
// Game loop to handle continuous key presses
function gameLoop() {
  if (gameOver) return;

  // Handle movement
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  if (keysPressed["ArrowLeft"] && left > 0) {
    jet.style.left = left - 10 + "px";
  }
  if (keysPressed["ArrowRight"] && left <= 460) {
    jet.style.left = left + 10 + "px";
  }

  // Handle shooting (spacebar or up arrow) with 20ms interval
  var currentTime = Date.now();
  if ((keysPressed["ArrowUp"] || keysPressed[" "]) && currentTime - lastShotTime > 200) {
    createBullet(left);
    lastShotTime = currentTime; // Update the last shot time
  }

  // Continuously call gameLoop using requestAnimationFrame
  requestAnimationFrame(gameLoop);
}







// Continuous movement functions for left and right
function startMoveLeft() {

  if (!moveInterval) { // Prevent multiple intervals from stacking
    moveInterval = setInterval(moveLeft, 25); // Move left every 50ms
  }
}


function startMoveRight() {
  if (!moveInterval) { // Prevent multiple intervals from stacking
    moveInterval = setInterval(moveRight, 25); // Move right every 50ms
  }
}




function stopMove() {
  clearInterval(moveInterval);  // Stop movement when button is released
  moveInterval = null;  // Reset the interval
}



// Continuous shooting function
function startShooting() {
  if (!shootInterval) { // Prevent multiple intervals from stacking
    shootInterval = setInterval(shootBullet, 200); // Shoot every 200ms
  }
}






function stopShooting() {
  clearInterval(shootInterval);  // Stop shooting when button is released
  shootInterval = null;  // Reset the interval
}










// Mobile control functions
function moveLeft() {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  if (left > 0) {
    jet.style.left = left - 10 + "px";
  }
}

function moveRight() {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  if (left <= 460) {
    jet.style.left = left + 10 + "px";
  }
}

function shootBullet() {
  var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  createBullet(left);
}











// Function to create a bullet
function createBullet(left) {
  var bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = left + 7 + "px";
  board.appendChild(bullet);

  var movebullet = setInterval(() => {
    if (gameOver) {
      clearInterval(movebullet);
      bullet.remove();
      return;
    }

    var bulletbottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
    if (bulletbottom >= 500) {
      bullet.remove();
      clearInterval(movebullet);
      return;
    }

    bullet.style.bottom = bulletbottom + 3 + "px";
    checkCollision(bullet, movebullet);
  }, 5);
}




// Function to check bullet-rock collision
function checkCollision(bullet, movebullet) {
    var rocks = document.getElementsByClassName("rocks");
    var bulletbound = bullet.getBoundingClientRect(); // Calculate bullet bounds once
  
    for (var i = 0; i < rocks.length; i++) {
      var rock = rocks[i];
      if (rock) {
        var rockbound = rock.getBoundingClientRect(); // Get rock bounds for each rock
  
        // Check if any part of the bullet intersects with the rock
        if (
          bulletbound.right > rockbound.left &&
          bulletbound.left < rockbound.right &&
          bulletbound.bottom > rockbound.top &&
          bulletbound.top < rockbound.bottom
        ) {
          rock.remove();
          bullet.remove();
          clearInterval(movebullet);
  
          score += 1;
          scoreElement.innerHTML = score;
          break; // Exit the loop once collision is detected
        }
      }
    }
  }
  






// Function to create a rock
function createRock() {
  if (gameOver) return;

  var rock = document.createElement("div");
  rock.classList.add("rocks");
  rock.style.left = Math.floor(Math.random() * 450) + "px";
  board.appendChild(rock);
}

// Function to move rocks
function moveRocks() {
  if (gameOver) return;

  var rocks = document.getElementsByClassName("rocks");
  for (var i = 0; i < rocks.length; i++) {
    var rock = rocks[i];
    var rocktop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));

    if (rocktop >= 475) {
      endGame();
      return;
    } else {
      rock.style.top = rocktop + 5 + "px";
    }
  }
}

// Function to end the game
function endGame() {
  gameOver = true;
  finalScoreElement.textContent = score;
  gameOverOverlay.style.display = "flex";

  clearInterval(generaterocks);
  clearInterval(moverocks);
  window.removeEventListener("keydown", handleKeydown); // Stop movement
  keysPressed = {}; // Clear any lingering key states
}

// Function to restart the game
function restartGame() {
  board.innerHTML = '<div id="jet"></div>'; // Reset board
  jet = document.getElementById("jet"); // Re-fetch jet element
  score = 0;
  scoreElement.innerHTML = score;
  gameOver = false;
  gameOverOverlay.style.display = "none"; // Hide overlay




  // Clear all intervals before reinitializing the game
  clearInterval(moveInterval);
  clearInterval(shootInterval);
  moveInterval = null;
  shootInterval = null;
  



  initGame(); // Reinitialize the game
}

// Initialize the game on page load
initGame();
