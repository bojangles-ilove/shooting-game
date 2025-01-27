const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0
};

let bullets = [];
let enemies = [];

function drawPlayer() {
  ctx.fillStyle = "#00F";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Prevent the player from going out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function createBullet() {
  let bullet = {
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 7,
    dy: -7
  };
  bullets.push(bullet);
}

function drawBullets() {
  ctx.fillStyle = "#F00";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.y += bullet.dy;
  });

  // Remove bullets off-screen
  bullets = bullets.filter(bullet => bullet.y > 0);
}

function createEnemy() {
  let enemy = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 3
  };
  enemies.push(enemy);
}

function drawEnemies() {
  ctx.fillStyle = "#0F0";
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += enemy.speed;
  });

  // Remove enemies off-screen
  enemies = enemies.filter(enemy => enemy.y < canvas.height);
}

function detectCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
      }
    });
  });
}

function update() {
  movePlayer();
  drawPlayer();
  drawBullets();
  drawEnemies();
  detectCollisions();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
  if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
  if (e.key === "ArrowDown" || e.key === "s") player.dy = player.speed;
  if (e.key === "ArrowUp" || e.key === "w") player.dy = -player.speed;
  if (e.key === " " || e.key === "Enter") createBullet();
});

document.addEventListener("keyup", e => {
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "ArrowLeft" || e.key === "a") player.dx = 0;
  if (e.key === "ArrowDown" || e.key === "s" || e.key === "ArrowUp" || e.key === "w") player.dy = 0;
});

setInterval(createEnemy, 1000); // Create a new enemy every second
gameLoop();
