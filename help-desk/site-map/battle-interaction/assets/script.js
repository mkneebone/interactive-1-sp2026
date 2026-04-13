let playerHealth = 100;
let cpuHealth = 100;
let waitingForCpu = false;
const cpuTurnDelay = 800;

const playerHealthText = document.getElementById("player-health-text");
const cpuHealthText = document.getElementById("cpu-health-text");
const playerHealthBar = document.getElementById("player-health-bar");
const cpuHealthBar = document.getElementById("cpu-health-bar");
const battleMessage = document.getElementById("battle-message");

const cpuAttackNames = ["Spark", "Flame Burst", "Heat Wave"];
const cpuAttackDamage = [9, 13, 17];

function updateScreen() {
  playerHealthText.textContent = playerHealth;
  cpuHealthText.textContent = cpuHealth;
  playerHealthBar.style.width = playerHealth + "%";
  cpuHealthBar.style.width = cpuHealth + "%";
}

function playerAttack(attackName, damage) {
  if (playerHealth === 0 || cpuHealth === 0 || waitingForCpu === true) {
    return;
  }

  cpuHealth = cpuHealth - damage;

  if (cpuHealth < 0) {
    cpuHealth = 0;
  }

  updateScreen();

  if (cpuHealth === 0) {
    battleMessage.textContent = "Victory! Fire was defeated.";
    return;
  }

  battleMessage.textContent = "Water used " + attackName + " for " + damage + " damage.";
  waitingForCpu = true;

  setTimeout(cpuTurn, cpuTurnDelay);
}

function cpuTurn() {
  const randomNumber = Math.floor(Math.random() * cpuAttackNames.length);
  const attackName = cpuAttackNames[randomNumber];
  const damage = cpuAttackDamage[randomNumber];

  playerHealth = playerHealth - damage;

  if (playerHealth < 0) {
    playerHealth = 0;
  }

  updateScreen();

  if (playerHealth === 0) {
    waitingForCpu = false;
    battleMessage.textContent = "Water fainted. Fire wins.";
    return;
  }

  waitingForCpu = false;
  battleMessage.textContent = "Fire used " + attackName + " for " + damage + " damage.";
}

function resetBattle() {
  playerHealth = 100;
  cpuHealth = 100;
  waitingForCpu = false;
  updateScreen();
  battleMessage.textContent = "The battle begins. Pick an attack.";
}

updateScreen();
