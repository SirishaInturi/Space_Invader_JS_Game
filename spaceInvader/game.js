const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameOverDiv = document.getElementById("game-over");

// Set canvas dimensions to window dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize game variables
let player;
let invaders = [];
let bullets = [];
let invaderBullets = [];
let score = 0;
let level = 0;
let gameOver = false;

// Handle player movement with arrow keys
let keysDown = {};
document.addEventListener("keydown", function(event) {
  keysDown[event.key] = true;
});
document.addEventListener("keyup", function(event) {
  keysDown[event.key] = false;
});

// Shoot bullet when space bar is pressed
document.addEventListener("keydown", function(event) {
  if (event.key === " ") {
    shoot();
  }
});

// Create player object
player = {
  x: canvas.width / 2,
  y: canvas.height - 150,
  width: 100,
  height: 100,
  speed: 5,
  update: function() {
    // Handle player movement with left and right arrow keys
	if (keysDown.ArrowLeft) {
		this.x -= this.speed;
    }
    if (keysDown.ArrowRight) {
		this.x += this.speed;
    }

    // Keep player within canvas boundaries
if (this.x < 0) {
  this.x = 0;
} else if (this.x + this.width > canvas.width) {
  this.x = canvas.width - this.width;
}
},
draw: function() {
  // Draw player spaceship on canvas
  let playerImg = new Image();
  playerImg.src = "spaceship.png";
  ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
}
};

// Create invader objects and add them to the invaders array
function createInvaders() {
for (let i = 0; i < 5 * level; i++) {
  let invader = {
    x: 50 * i + 50,
    y: 50,
    width: 50,
    height: 50,
    speed: 1,
    update: function() {
      this.x += this.speed;

      // Change direction when invader reaches edge of canvas
      if (this.x + this.width > canvas.width || this.x < 0) {
        this.speed *= -1;
        this.y += this.height;
      }

      // Randomly shoot bullet
      if (Math.random() < 0.005) {
        shootInvaderBullet(this);
      }
    },
    draw: function() {
      // Draw invader on canvas
      let invaderImg = new Image();
      invaderImg.src = "invader.png";
      ctx.drawImage(invaderImg, this.x, this.y, this.width, this.height);
    }
  };
  invaders.push(invader);
}
}

// Create bullet object and add it to the bullets array
function shoot() {
  let bullet = {
    x: player.x + player.width / 2,
    y: player.y,
    width: 5,
    height: 20,
    speed: 10,
    update: function() {
      this.y -= this.speed;
    },
    draw: function() {
      // Draw bullet on canvas
      ctx.fillStyle = "white";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  bullets.push(bullet);
}
// Create bullet object for an invader and add it to the invaderBullets array
function shootInvaderBullet(invader) {
  let bullet = {
    x: invader.x + invader.width / 2,
    y: invader.y + invader.height,
    width: 5,
    height: 20,
    speed: 5,
    update: function() {
      this.y += this.speed;
    },
    draw: function() {
      // Draw bullet on canvas
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  invaderBullets.push(bullet);
}

// Check for collisions between bullets and objects
function checkCollisions() {
  // Check for collisions between player bullets and invaders
  bullets.forEach(function(bullet) {
    invaders.forEach(function(invader) {
      if (
        bullet.x + bullet.width > invader.x &&
        bullet.x < invader.x + invader.width &&
        bullet.y + bullet.height > invader.y &&
        bullet.y < invader.y + invader.height
      ) {
        // Remove invader and bullet when collision is detected
        invaders.splice(invaders.indexOf(invader), 1);
        bullets.splice(bullets.indexOf(bullet), 1);

        // Increase score
        score++;
      }
    });
  });

  // Check for collisions between invader bullets and player
  invaderBullets.forEach(function(bullet) {
    if (
      bullet.x + bullet.width > player.x &&
      bullet.x < player.x + player.width &&
      bullet.y + bullet.height > player.y &&
      bullet.y < player.y + player.height
    ) {
      // Game over if player is hit
      gameOver = true;
    }
  });
}

// Check if all invaders have been destroyed to advance to the next level
function checkWin() {
if (invaders.length === 0) {
  level++;
  createInvaders();
}
}

// Main game loop
function update() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player and draw on canvas
  player.update();
  player.draw();

  // Update invaders and draw on canvas
  invaders.forEach(function(invader) {
    invader.update();
    invader.draw();
  });

  // Update bullets and draw on canvas
  bullets.forEach(function(bullet) {
    bullet.update();
    bullet.draw();
  });

  // Update invader bullets and draw on canvas
  invaderBullets.forEach(function(bullet) {
    bullet.update();
    bullet.draw();
  });

  // Check for collisions between bullets and objects
  checkCollisions();

  // Check if all invaders have been destroyed to advance to the next level
  checkWin();

  // Check if an invader has reached the bottom of the canvas
  invaders.forEach(function(invader) {
    if (invader.y + invader.height > canvas.height) {
      gameOver = true;
    }
  });

  // Display game over screen if game is over
  if (gameOver) {
    gameOverDiv.style.display = "block";
  } else {
    // Repeat game loop
    requestAnimationFrame(update);
  }

  // Display score and level on canvas
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Score: " + score, canvas.width / 2, canvas.height - 50);
  ctx.fillText("Level: " + level, canvas.width / 2, canvas.height - 20);
}

// Start game loop
update();


