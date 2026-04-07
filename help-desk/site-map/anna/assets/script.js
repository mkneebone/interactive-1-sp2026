const STEP_SIZE   = 50;  // grid step in pixels
const ANIM_SPEED  = 12;  // pixels per frame during slide (higher = faster slide)

const CHAR_WIDTH  = 50;
const CHAR_HEIGHT = 50;
const MAP_WIDTH   = 3300;
const MAP_HEIGHT  = 3300;

const WALL_THRESHOLD = 200;

const character = document.querySelector(".character");
const world     = document.querySelector(".world");

// Target position (grid-snapped)
let targetX = 1625;
let targetY = 2100;

// Visual/render position (slides toward target)
let renderX = targetX;
let renderY = targetY;

let moving = false;

// Offscreen canvas for pixel-based collision
const collisionCanvas = document.createElement("canvas");
collisionCanvas.width  = MAP_WIDTH;
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
    return a > 128 && r > WALL_THRESHOLD && g > WALL_THRESHOLD && b > WALL_THRESHOLD;
}

function hasCollision(x, y) {
    const right  = x + CHAR_WIDTH  - 1;
    const bottom = y + CHAR_HEIGHT - 1;
    const midX   = x + CHAR_WIDTH  / 2;
    const midY   = y + CHAR_HEIGHT / 2;
    return (
        isWall(x,     y)      ||
        isWall(right, y)      ||
        isWall(x,     bottom) ||
        isWall(right, bottom) ||
        isWall(midX,  y)      ||
        isWall(midX,  bottom) ||
        isWall(x,     midY)   ||
        isWall(right, midY)
    );
}

function updateCamera() {
    character.style.left = `${renderX}px`;
    character.style.top  = `${renderY}px`;

    const worldX = window.innerWidth  / 2 - renderX - CHAR_WIDTH  / 2;
    const worldY = window.innerHeight / 2 - renderY - CHAR_HEIGHT / 2;
    world.style.left = `${worldX}px`;
    world.style.top  = `${worldY}px`;
}

const KEY_MAP = {
    ArrowLeft:  [-STEP_SIZE, 0],
    ArrowRight: [ STEP_SIZE, 0],
    ArrowUp:    [0, -STEP_SIZE],
    ArrowDown:  [0,  STEP_SIZE],
    a: [-STEP_SIZE, 0],
    d: [ STEP_SIZE, 0],
    w: [0, -STEP_SIZE],
    s: [0,  STEP_SIZE],
};

const keys = {};
document.addEventListener("keydown", (e) => { if (KEY_MAP[e.key]) keys[e.key] = true; });
document.addEventListener("keyup",   (e) => { if (KEY_MAP[e.key]) keys[e.key] = false; });

function tryMove(dx, dy) {
    const newX = Math.max(0, Math.min(targetX + dx, MAP_WIDTH  - CHAR_WIDTH));
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

    const arrived = renderX === targetX && renderY === targetY;

    // Only accept new input when the slide is done
    if (arrived) {
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
