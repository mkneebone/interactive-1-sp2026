const STEP_SIZE   = 50;  // grid step in pixels
const ANIM_SPEED  = 12;  // pixels per frame during slide (higher = faster slide)

const CHAR_WIDTH  = 50;
const CHAR_HEIGHT = 50;
const MAP_WIDTH   = 3300;
const MAP_HEIGHT  = 3300;

const WALL_THRESHOLD = 200;

const character = document.querySelector(".character");
const world     = document.querySelector(".world");

// Poodle Colision and trigger-zone
const poodle = document.querySelector(".poodle");
const hitbox     = document.querySelector(".hitbox");
const dialogueBox = document.querySelector(".dialogueBox");
const textbox = document.querySelector(".textbox");
const triggerZone = document.querySelector(".trigger-zone");

// Game start Screen/instructions
const startScreen = document.getElementById("startScreen");

// Poodle explanation
const poodleScene = document.getElementById("poodleScene");
const poodleDialogueText = document.getElementById("poodleDialogueText");

// Poodle dialogue lines
const poodleLines = [
    "Poodle: Welcome to the vet clinic!",
    "Poodle: You're the new vet tech, right?",
    "Poodle: Walk around and visit the exam rooms.",
    "Poodle: Press SPACE near a room door to enter.",
    "Poodle: Good luck on your first day!"
];
let dialogueIndex = 0;

// ROOM BOXES
const rm1 = document.querySelector(".rm1");
const rm2 = document.querySelector(".rm2");
const rm3 = document.querySelector(".rm3");
const rm4 = document.querySelector(".rm4");
const rm5 = document.querySelector(".rm5");
const rm6 = document.querySelector(".rm6");
const rm7 = document.querySelector(".rm7");
const rm8 = document.querySelector(".rm8");
const drugs = document.querySelector(".drugs");

// EXCLMATIONS
const exclamation = document.querySelector(".exclamation");
const rm2Ex = document.querySelector(".rm2exclamation");
const rm3Ex = document.querySelector(".rm3exclamation");
const rm4Ex = document.querySelector(".rm4exclamation");
const rm5Ex = document.querySelector(".rm5exclamation");
const rm6Ex = document.querySelector(".rm6exclamation");
const rm7Ex = document.querySelector(".rm7exclamation");
const rm8Ex = document.querySelector(".rm8exclamation");
const drugsEx = document.querySelector(".drugsexclamation");

window.addEventListener("load", () => {

    hitbox.style.left =
        poodle.offsetLeft + (poodle.offsetWidth / 2) - (hitbox.offsetWidth / 2) + "px";

    hitbox.style.top =
        poodle.offsetTop + (poodle.offsetHeight / 2) - (hitbox.offsetHeight / 2) + "px";

    document.body.focus();
});

document.body.tabIndex = 0;
document.body.focus();

// RM Collision Detection Function- Rm 1 to Rm 8, and drugs
[
  exclamation,
  rm2Ex,
  rm3Ex,
  rm4Ex,
  rm5Ex,
  rm6Ex,
  rm7Ex,
  rm8Ex,
  drugsEx
].forEach(ex => ex.style.opacity = "0");

function isOverlapping(a, b) {

  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.left > bRect.right ||
    aRect.right < bRect.left
  );
}

const roomZones = [
    { num: 1, zone: rm1, ex: exclamation },
    { num: 2, zone: rm2, ex: rm2Ex },
    { num: 3, zone: rm3, ex: rm3Ex },
    { num: 4, zone: rm4, ex: rm4Ex },
    { num: 5, zone: rm5, ex: rm5Ex },
    { num: 6, zone: rm6, ex: rm6Ex },
    { num: 7, zone: rm7, ex: rm7Ex },
    { num: 8, zone: rm8, ex: rm8Ex },
];

function checkAllRooms() {
  for (const r of roomZones) {
    if (visitedRooms.has(r.num)) {
      r.ex.style.opacity = "0";
    } else {
      r.ex.style.opacity = isOverlapping(character, r.zone) ? "1" : "0";
    }
  }
  drugsEx.style.opacity =
    isOverlapping(character, drugs) ? "1" : "0";
}

// Check if player is overlapping any room and return the room number
function getRoomOverlap() {
    for (const r of roomZones) {
        if (!visitedRooms.has(r.num) && isOverlapping(character, r.zone)) return r.num;
    }
    return null;
}


// Track visited rooms
const visitedRooms = new Set();

// DIALOGUE BOX FOR POODLE IF CHARACTER GOES OUT OF ZONE
let talkedToPoodle = false;
let playerNearPoodle = false;
let isTalkingToPoodle = false;
let movementLocked = false;
let gameStarted = false;
let poodleDialogueActive = false;
let bigPoodleActive = false;


function checkTriggerZone() {

    if (!gameStarted || bigPoodleActive) return

    const insideZone =
        isOverlapping(character, triggerZone);

    // Already talked — nothing to do
    if (talkedToPoodle) {
        textbox.style.display = "none";
        return;
    }

    // Once triggered, keep textbox visible until poodle dialogue is done
    // Only trigger it when the player touches the boundary
    if (!insideZone && !poodleDialogueActive) {
        poodleDialogueActive = true;
        textbox.style.display = "block";
    }

    // Push player back if outside the zone
    if (!insideZone) {
        const zone = triggerZone.getBoundingClientRect();
        const player = character.getBoundingClientRect();

        const PUSH_BACK = 25;

        if (player.right < zone.left) {
            targetX += PUSH_BACK;
        }
        else if (player.left > zone.right) {
            targetX -= PUSH_BACK;
        }
        else if (player.bottom < zone.top) {
            targetY += PUSH_BACK;
        }
        else if (player.top > zone.bottom) {
            targetY -= PUSH_BACK;
        }
    }
}

function positionTextbox() {

    if (!poodleDialogueActive) return;

    textbox.style.left =
        poodle.offsetLeft + -250 + "px";

    textbox.style.top =
        poodle.offsetTop - 200 + "px";
}

// POP UP if Character moves out of hitbox
function checkPoodleDistance() {

    playerNearPoodle = isColliding(character, hitbox);

    const playerRect = character.getBoundingClientRect();
    const poodleRect = poodle.getBoundingClientRect();

    const dx = Math.abs(playerRect.left - poodleRect.left);
    const dy = Math.abs(playerRect.top - poodleRect.top);

    const TALK_DISTANCE = 120;

    playerNearPoodle =
        dx < TALK_DISTANCE &&
        dy < TALK_DISTANCE;
}



function isColliding(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
        aRect.right < bRect.left ||
        aRect.left > bRect.right ||
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom
    );
}

function collidesWithHitbox(x, y) {

    const rect = hitbox.getBoundingClientRect();

    return !(
        x + CHAR_WIDTH  < rect.left ||
        x > rect.right ||
        y + CHAR_HEIGHT < rect.top ||
        y > rect.bottom
    );
}

// Target position (grid-snapped)
let targetX = 925;
let targetY = 3100;

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
mapImage.src = "assets/images/bigmap.svg";
mapImage.onload = () => {
    collisionCtx.drawImage(mapImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);

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
document.addEventListener("keydown", (e) => { if (!examActive && KEY_MAP[e.key]) keys[e.key] = true; });
document.addEventListener("keyup",   (e) => { if (KEY_MAP[e.key]) keys[e.key] = false; });

// SPACE KEY HANDLER
document.addEventListener("keydown", (e) => {

    if (e.code !== "Space") return;
    if (examActive) return;

    e.preventDefault();

    checkPoodleDistance();

    /* START GAME SCREEN */
    if (!gameStarted) {
        startScreen.style.display = "none";
        gameStarted = true;
        gameLoop();
        document.body.focus();
        return;
    }

    /* ADVANCE POODLE DIALOGUE (if active) */
    if (bigPoodleActive) {

        dialogueIndex++;

        if (dialogueIndex < poodleLines.length) {
            poodleDialogueText.textContent =
                poodleLines[dialogueIndex];
        } else {
            // Dismiss poodle scene and return to overworld
            bigPoodleActive = false;
            talkedToPoodle = true;
            movementLocked = false;
            poodleDialogueActive = false;

            poodleScene.style.display = "none";
            textbox.style.display = "none";
        }
        return;
    }

    /* TALK TO POODLE — anywhere inside the trigger zone */
    if (!talkedToPoodle) {
        const insideTriggerZone = isOverlapping(character, triggerZone);
        if (insideTriggerZone || playerNearPoodle) {

            bigPoodleActive = true;
            movementLocked = true;

            poodleScene.style.display = "flex";
            textbox.style.display = "none";

            dialogueIndex = 0;
            poodleDialogueText.textContent =
                poodleLines[dialogueIndex];

            return;
        }
    }

    /* ENTER A ROOM */
    const roomNum = getRoomOverlap();
    if (roomNum !== null) {
        enterRoom(roomNum);
    }
});


function tryMove(dx, dy) {
    if (!gameStarted) return;
     if (bigPoodleActive) return;

    if (movementLocked) return;

    const newX = Math.max(0, Math.min(targetX + dx, MAP_WIDTH  - CHAR_WIDTH));
    const newY = Math.max(0, Math.min(targetY + dy, MAP_HEIGHT - CHAR_HEIGHT));

    if (!hasCollision(newX, targetY) &&
    !collidesWithHitbox(newX, targetY))
    targetX = newX;

if (!hasCollision(targetX, newY) &&
    !collidesWithHitbox(targetX, newY))
    targetY = newY;
}

function moveToward(current, target) {
    if (current === target) return target;
    const diff = target - current;
    const step = Math.min(ANIM_SPEED, Math.abs(diff));
    return current + Math.sign(diff) * step;
}

function updatePoodleHitbox() {

    hitbox.style.left =
        poodle.offsetLeft +
        (poodle.offsetWidth / 2) -
        (hitbox.offsetWidth / 2) + "px";

    hitbox.style.top =
        poodle.offsetTop +
        (poodle.offsetHeight / 2) -
        (hitbox.offsetHeight / 2) + "px";
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
    checkPoodleDistance();
    updatePoodleHitbox();
    checkAllRooms();
    checkTriggerZone();
    positionTextbox();
    requestAnimationFrame(gameLoop);
}

updateCamera();

// ===== EXAM ROOM SYSTEM =====
const examScene = document.getElementById("examScene");
const doorVideo = document.getElementById("doorOpenVideo");
const examContainer = document.getElementById("examContainer");
const examCharacter = document.getElementById("examCharacter");
const examDialogueText = document.getElementById("examDialogueText");
const examChoices = document.getElementById("examChoices");
const examChoiceA = document.getElementById("examChoiceA");
const examChoiceB = document.getElementById("examChoiceB");

let examActive = false;
let examEnded = false;
let examStep = 0;
let examChoice = 0;
let examInChoice = false;
let currentRoom = null;
let currentRoomNum = null;

function enterRoom(roomNum) {
    currentRoom = ROOMS[roomNum];
    if (!currentRoom) return;
    currentRoomNum = roomNum;

    examActive = true;
    examEnded = false;
    examStep = 0;
    examChoice = 0;
    examInChoice = false;
    movementLocked = true;

    // Set character image
    examCharacter.src = currentRoom.image;

    // Reset UI
    examContainer.style.display = "none";
    examChoices.style.display = "none";
    examChoiceA.classList.add("selected");
    examChoiceB.classList.remove("selected");
    examDialogueText.textContent = "";

    // Show overlay and play video
    examScene.style.display = "flex";
    doorVideo.style.display = "";
    doorVideo.currentTime = 0;
    doorVideo.play().catch(() => {
        // Video failed to load/play — skip straight to dialogue
        doorVideo.style.display = "none";
        examContainer.style.display = "flex";
        examRender();
    });
}

// When door video ends, start dialogue
doorVideo.addEventListener("ended", () => {
    doorVideo.style.display = "none";
    examContainer.style.display = "flex";
    examRender();
});

function examRender() {
    if (currentRoom.script[examStep] === "MAKE_CHOICE") {
        examInChoice = true;
        examChoice = 0;
        examDialogueText.textContent = "Choose your response:";
        examChoices.style.display = "";
        examChoiceA.textContent = currentRoom.options.A;
        examChoiceB.textContent = currentRoom.options.B;
        examUpdateSelection();
        return;
    }
    examDialogueText.textContent = currentRoom.script[examStep];
}

function examUpdateSelection() {
    examChoiceA.classList.remove("selected");
    examChoiceB.classList.remove("selected");
    if (examChoice === 0) {
        examChoiceA.classList.add("selected");
    } else {
        examChoiceB.classList.add("selected");
    }
}

// Exam room keyboard controls
document.addEventListener("keydown", (e) => {
    if (!examActive) return;

    // After ending, Space returns to overworld
    if (examEnded && e.code === "Space") {
        visitedRooms.add(currentRoomNum);
        examActive = false;
        movementLocked = false;
        examScene.style.display = "none";
        return;
    }

    // Choice mode
    if (examInChoice) {
        if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "Space") {
            e.preventDefault();
        }
        if (e.code === "ArrowUp") {
            examChoice = 0;
            examUpdateSelection();
        }
        if (e.code === "ArrowDown") {
            examChoice = 1;
            examUpdateSelection();
        }
        if (e.code === "Space") {
            if (examChoice === 0) {
                examDialogueText.innerHTML = currentRoom.goodEnding;
            } else {
                examDialogueText.innerHTML = currentRoom.badEnding;
            }
            examChoices.style.display = "none";
            examInChoice = false;
            examEnded = true;
        }
        return;
    }

    // Advance dialogue
    if (e.code === "Space") {
        if (examStep >= currentRoom.script.length - 1) return;
        examStep++;
        examRender();
    }
});
