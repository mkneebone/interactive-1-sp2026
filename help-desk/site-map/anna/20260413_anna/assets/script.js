const STEP_SIZE = 50; // grid step in pixels
const ANIM_SPEED = 12; // pixels per frame during slide (higher = faster slide)

const CHAR_WIDTH = 50;
const CHAR_HEIGHT = 50;
const MAP_WIDTH = 3300;
const MAP_HEIGHT = 3300;

const WALL_THRESHOLD = 200;
const ZONES = [
  {
    x: 1770,
    y: 1880,
    width: 280,
    height: 220,
    title: "Front Desk",
    body: "Welcome to your neighborhood vet.",
    prompt: "Press spacebar to enter.",
  },
  {
    x: 2860,
    y: 560,
    width: 260,
    height: 180,
    title: "Exam Room",
    body: "You enter the exam room.",
    prompt: "Press spacebar to enter.",
  },
];

const character = document.querySelector(".character");
const world = document.querySelector(".world");
const zonesLayer = document.querySelector(".zones");
const dialogScreen = document.querySelector(".screen-dialog");
const returnButton = document.querySelector(".screen-button");
const zoneAlert = document.querySelector(".zone-alert");
const interactionPrompt = document.querySelector(".interaction-prompt");
const dialogTitle = document.querySelector("#dialog-title");
const dialogBody = document.querySelector("#dialog-body");

// Target position (grid-snapped)
let targetX = 1625;
let targetY = 2100;

// Visual/render position (slides toward target)
let renderX = targetX;
let renderY = targetY;

let moving = false;
let dialogLoaded = false;
let activeZone = null;

for (const zone of ZONES) {
  const zoneElement = document.createElement("div");
  zoneElement.className = "zone";
  zoneElement.style.left = `${zone.x}px`;
  zoneElement.style.top = `${zone.y}px`;
  zoneElement.style.width = `${zone.width}px`;
  zoneElement.style.height = `${zone.height}px`;
  zonesLayer.appendChild(zoneElement);
}

// Offscreen canvas for pixel-based collision
const collisionCanvas = document.createElement("canvas");
collisionCanvas.width = MAP_WIDTH;
collisionCanvas.height = MAP_HEIGHT;
const collisionCtx = collisionCanvas.getContext("2d");

const mapImage = new Image();
mapImage.src = "assets/bigmap.svg";
mapImage.onload = () => {
  collisionCtx.drawImage(mapImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);
  gameLoop();
};

function isWall(x, y) {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return true;
  const [r, g, b, a] = collisionCtx.getImageData(x, y, 1, 1).data;
  return (
    a > 128 && r > WALL_THRESHOLD && g > WALL_THRESHOLD && b > WALL_THRESHOLD
  );
}

function hasCollision(x, y) {
  const right = x + CHAR_WIDTH - 1;
  const bottom = y + CHAR_HEIGHT - 1;
  const midX = x + CHAR_WIDTH / 2;
  const midY = y + CHAR_HEIGHT / 2;
  return (
    isWall(x, y) ||
    isWall(right, y) ||
    isWall(x, bottom) ||
    isWall(right, bottom) ||
    isWall(midX, y) ||
    isWall(midX, bottom) ||
    isWall(x, midY) ||
    isWall(right, midY)
  );
}

function overlapsZone(x, y, zone) {
  return (
    x < zone.x + zone.width &&
    x + CHAR_WIDTH > zone.x &&
    y < zone.y + zone.height &&
    y + CHAR_HEIGHT > zone.y
  );
}

function getActiveZone(x, y) {
  return ZONES.find((zone) => overlapsZone(x, y, zone)) ?? null;
}

function openDialogScreen(zone) {
  if (dialogLoaded || !zone) return;
  dialogTitle.textContent = zone.title;
  dialogBody.textContent = zone.body;
  dialogLoaded = true;
  dialogScreen.hidden = false;
}

function closeDialogScreen() {
  dialogScreen.hidden = true;
  dialogLoaded = false;
}

function updateCamera() {
  character.style.left = `${renderX}px`;
  character.style.top = `${renderY}px`;
  zoneAlert.style.left = `${renderX + CHAR_WIDTH / 2}px`;
  zoneAlert.style.top = `${renderY - 40}px`;

  const worldX = window.innerWidth / 2 - renderX - CHAR_WIDTH / 2;
  const worldY = window.innerHeight / 2 - renderY - CHAR_HEIGHT / 2;
  world.style.left = `${worldX}px`;
  world.style.top = `${worldY}px`;
}

const KEY_MAP = {
  ArrowLeft: [-STEP_SIZE, 0],
  ArrowRight: [STEP_SIZE, 0],
  ArrowUp: [0, -STEP_SIZE],
  ArrowDown: [0, STEP_SIZE],
  a: [-STEP_SIZE, 0],
  d: [STEP_SIZE, 0],
  w: [0, -STEP_SIZE],
  s: [0, STEP_SIZE],
};

const keys = {};
document.addEventListener("keydown", (e) => {
  if (KEY_MAP[e.key]) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (KEY_MAP[e.key]) keys[e.key] = false;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dialogLoaded) {
    closeDialogScreen();
  }

  if (e.code === "Space") {
    e.preventDefault();
    if (activeZone && !dialogLoaded) {
      openDialogScreen(activeZone);
    }
  }
});

returnButton.addEventListener("click", closeDialogScreen);

function tryMove(dx, dy) {
  const newX = Math.max(0, Math.min(targetX + dx, MAP_WIDTH - CHAR_WIDTH));
  const newY = Math.max(0, Math.min(targetY + dy, MAP_HEIGHT - CHAR_HEIGHT));

  if (!hasCollision(newX, targetY)) targetX = newX;
  if (!hasCollision(targetX, newY)) targetY = newY;
}

function moveToward(current, target) {
  if (current === target) return target;
  const diff = target - current;
  const step = Math.min(ANIM_SPEED, Math.abs(diff));
  return current + Math.sign(diff) * step;
}

function gameLoop() {
  // Slide render position toward target
  renderX = moveToward(renderX, targetX);
  renderY = moveToward(renderY, targetY);

  activeZone = getActiveZone(renderX, renderY);
  zoneAlert.hidden = !activeZone || dialogLoaded;
  interactionPrompt.hidden = !activeZone || dialogLoaded;
  interactionPrompt.textContent = activeZone ? activeZone.prompt : "";

  const arrived = renderX === targetX && renderY === targetY;

  // Only accept new input when the slide is inavtive
  if (arrived && !dialogLoaded) {
    moving = false;
    for (const key of Object.keys(keys)) {
      if (keys[key]) {
        const [dx, dy] = KEY_MAP[key];
        tryMove(dx, dy);
        moving = true;
        break;
      }
    }
  }

  updateCamera();
  requestAnimationFrame(gameLoop);
}

updateCamera();
