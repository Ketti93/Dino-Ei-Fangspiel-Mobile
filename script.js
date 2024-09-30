const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameActive = false;
let eggs = [];
let eggCount = 0;
const eggImage = new Image();
eggImage.src = "images/egg.png"; // Stelle sicher, dass du ein Ei-Icon hier hast

// Canvas-Größe dynamisch setzen
function resizeCanvas() {
  const container = document.getElementById("game-container");
  canvas.width = container.clientWidth; // Setze die Breite des Canvas
  canvas.height = Math.floor(canvas.width * 1.5); // Höhe basierend auf Breite
}

window.addEventListener("resize", resizeCanvas); // Canvas bei Größenänderung anpassen
resizeCanvas(); // Initiale Canvas-Größe setzen

// Egg-Klasse
class Egg {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40; // Breite des Eis
    this.height = 60; // Höhe des Eis
  }

  draw() {
    ctx.drawImage(eggImage, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += 2; // Geschwindigkeit, mit der das Ei fällt
    if (this.y > canvas.height) {
      this.y = -this.height;
      this.x = Math.random() * (canvas.width - this.width);
    }
  }
}

// Spiel starten
function startGame() {
  gameActive = true;
  score = 0;
  eggCount = 0;
  eggs = [];
  for (let i = 0; i < 5; i++) {
    eggs.push(
      new Egg(
        Math.random() * (canvas.width - 40),
        Math.random() * canvas.height
      )
    );
  }
  document.getElementById("score").innerText = "Punkte: 0";
  requestAnimationFrame(gameLoop);
}

//touch-Handler
function touchHandler(event) {
  event.preventDefault();
  if (gameActive) {
    const touch = event.touches[0];
    const touchX = touch.clientX - canvas.getBoundingClientRect().left;
    const touchY = touch.clientY - canvas.getBoundingClientRect().top;

    eggs.forEach((egg) => {
      if (
        touchX >= egg.x &&
        touchX <= egg.x + egg.width &&
        touchY >= egg.y &&
        touchY <= egg.y + egg.height
      ) {
        score++;
        eggCount++;
        egg.y = -egg.height; // Setze das Ei zurück
        document.getElementById("score").innerText = "Punkte: " + score;
      }
    });
  }
}

// Spiel-Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
  eggs.forEach((egg) => {
    egg.update();
    egg.draw();
  });

  if (gameActive) {
    requestAnimationFrame(gameLoop); // Fortsetzen des Spiels
  }
}

// Event-Listener
canvas.addEventListener("touchstart", touchHandler);
document.getElementById("startButton").addEventListener("click", startGame);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registriert mit dem Scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker Registrierung fehlgeschlagen:", error);
      });
  });
}
