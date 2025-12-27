const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");

let y = 500;
let velocityY = 0;
let score = 0;

const JUMP_FORCE = 10;      
const GRAVITY_ACC = 0.5;    
const MAX_FALL_SPEED = 12;  

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    velocityY = -JUMP_FORCE;
  }
});

// --- PLAYER UPDATE ---
function updatePlayer() {
  velocityY += GRAVITY_ACC;
  if (velocityY > MAX_FALL_SPEED) velocityY = MAX_FALL_SPEED;

  y += velocityY;

  const bottom = window.innerHeight - player.offsetHeight;

  if (y >= bottom) die();

  if (y < 0) {
    y = 0;
    velocityY = 0;
  }

  player.style.top = y + "px";

  requestAnimationFrame(updatePlayer);
}

// --- PIPES SETUP ---
let pipes = [];
let PIPE_WIDTH = 100;  
let PIPE_SPEED = 4;     // увеличена скорост
const GAP_HEIGHT = 180;

function createPipe() {
  const pipeTopHeight = Math.floor(Math.random() * (window.innerHeight - GAP_HEIGHT - 100)) + 50;
  const pipeBottomHeight = window.innerHeight - pipeTopHeight - GAP_HEIGHT;

  const topPipe = document.createElement("div");
  topPipe.className = "pipe";
  topPipe.style.height = pipeTopHeight + "px";
  topPipe.style.top = "0px";
  topPipe.style.left = window.innerWidth + "px";
  topPipe.style.width = PIPE_WIDTH + "px";

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "pipe";
  bottomPipe.style.height = pipeBottomHeight + "px";
  bottomPipe.style.bottom = "0px";
  bottomPipe.style.left = window.innerWidth + "px";
  bottomPipe.style.width = PIPE_WIDTH + "px";

  document.getElementById("game").appendChild(topPipe);
  document.getElementById("game").appendChild(bottomPipe);

  topPipe.passed = false;

  return [topPipe, bottomPipe];
}

// --- PIPES UPDATE ---
function updatePipes() {
  for (let i = pipes.length - 1; i >= 0; i--) {
    const [topPipe, bottomPipe] = pipes[i];

    let left = parseInt(topPipe.style.left);
    left -= PIPE_SPEED;

    topPipe.style.left = left + "px";
    bottomPipe.style.left = left + "px";

    if (!topPipe.passed && left + PIPE_WIDTH < 100) {
      topPipe.passed = true;
      score += 1;
      scoreDisplay.textContent = "Score: " + score;
    }

    if (left + PIPE_WIDTH < 0) {
      topPipe.remove();
      bottomPipe.remove();
      pipes.splice(i, 1);
    }
  }

  requestAnimationFrame(updatePipes);
}

// --- COLLISION ---
function checkCollision() {
  const playerRect = player.getBoundingClientRect();

  for (let i = 0; i < pipes.length; i++) {
    const [topPipe, bottomPipe] = pipes[i];

    const topRect = topPipe.getBoundingClientRect();
    const bottomRect = bottomPipe.getBoundingClientRect();

    if (
      playerRect.left < topRect.right &&
      playerRect.right > topRect.left &&
      playerRect.top < topRect.bottom &&
      playerRect.bottom > topRect.top
    ) die();

    if (
      playerRect.left < bottomRect.right &&
      playerRect.right > bottomRect.left &&
      playerRect.top < bottomRect.bottom &&
      playerRect.bottom > bottomRect.top
    ) die();
  }

  requestAnimationFrame(checkCollision);
}

// --- DIE FUNCTION ---
function die() {
  pipes.forEach(([topPipe, bottomPipe]) => {
    topPipe.remove();
    bottomPipe.remove();
  });
  pipes = [];
  y = 500;
  velocityY = 0;
  score = 0;
  scoreDisplay.textContent = "Score: " + score;
}

// --- START GAME ---
updatePlayer();
updatePipes();
checkCollision();

setInterval(() => {
  pipes.push(createPipe());
}, 2000); // по-кратък интервал = тръбите по-близо

