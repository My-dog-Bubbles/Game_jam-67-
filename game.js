// =======================
// GAME STATE
// =======================
let round = 1;
const maxRounds = 5;
let playerHealth = 100;
let enemyHealth = 100;
let playerAttack = 10;
let enemyAttack = 19;
let coins = 0;

const enemyImages = [
    "photos/Enemies/67.png",
    "photos/Enemies/ballarina_capochina.png",
    "photos/Enemies/tung_tung_sahur.png",
    "photos/Enemies/67.png",
    "photos/Enemies/ballarina_capochina.png"
];

let fightInterval;

// =======================
// DOM ELEMENTS
// =======================
const playerBar = document.getElementById("player-health-bar");
const enemyBar = document.getElementById("enemy-health-bar");
const playerDamageText = document.getElementById("player-damage");
const enemyDamageText = document.getElementById("enemy-damage");
const player = document.getElementById("character");
const enemy = document.getElementById("enemy");
const enemyImg = document.getElementById("enemy-img");
const roundText = document.getElementById("round");
const message = document.getElementById("message");
const coinsText = document.getElementById("coins");
const currentFighterText = document.getElementById("current-fighter");

// Pause menu
let isPaused = false;
const pauseMenu = document.getElementById("pause-menu");
const pauseCoins = document.getElementById("pause-coins");

// =======================
// INITIAL SETUP
// =======================
document.addEventListener("DOMContentLoaded", () => {
    
    setInterval(() => {
        coins++;
        coinsText.textContent = `Coins: ${coins}`;
        pauseCoins.textContent = `Coins: ${coins}`; // update pause menu too
    }, 1000);

    // Start auto-fight
    startAutoFight();

    // Show pause menu initially
    isPaused = true;
    pauseMenu.classList.remove("hidden");
    message.textContent = "Game Paused. Press 'P' to start!";

    // Update round and health UI
    roundText.textContent = `Round: ${round} / ${maxRounds}`;
    updateHealthBars();

    // Pause key listener
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") togglePause();
    });
});

// =======================
// AUTO-FIGHT
// =======================
function startAutoFight() {
    fightInterval = setInterval(() => {
        if (round > maxRounds) {
            clearInterval(fightInterval);
            message.textContent = "Game Finished!";
            return;
        }
        attackEnemy();
    }, 1000);
}

// =======================
// ATTACK FUNCTION
// =======================
function attackEnemy() {
    if (playerHealth <= 0 || enemyHealth <= 0) return;

    // Player attack
    currentFighterText.textContent = "Current Fighter: Player";
    player.classList.add("attack", "bounce", "hit");
    enemy.classList.remove("hit");

    const playerDamage = Math.floor(Math.random() * 20) + 5;
    const enemyDamage = Math.floor(Math.random() * 15) + 5;

    enemyHealth -= playerDamage;
    if (enemyHealth < 0) enemyHealth = 0;

    updateHealthBars();
    showDamage(enemyDamageText, playerDamage);

    setTimeout(() => { player.classList.remove("attack", "bounce"); }, 500);

    // Enemy attack
    setTimeout(() => {
        currentFighterText.textContent = "Current Fighter: Enemy";
        enemy.classList.add("attack", "bounce", "hit");
        player.classList.remove("hit");

        playerHealth -= enemyDamage;
        if (playerHealth < 0) playerHealth = 0;

        updateHealthBars();
        showDamage(playerDamageText, enemyDamage);

        setTimeout(() => { enemy.classList.remove("attack", "bounce", "hit"); }, 500);

        checkRound();
    }, 500);
}

// =======================
// UPDATE HEALTH
// =======================
function updateHealthBars() {
    playerBar.style.width = playerHealth + "%";
    enemyBar.style.width = enemyHealth + "%";
}

// =======================
// DAMAGE NUMBERS
// =======================
function showDamage(element, damage) {
    element.textContent = "-" + damage;
    element.classList.remove("show-damage");
    void element.offsetWidth;
    element.classList.add("show-damage");
}

// =======================
// ROUND CHECK
// =======================
function checkRound() {
    if (enemyHealth <= 0) nextRound();
    else if (playerHealth <= 0) nextRound();
}

// =======================
// NEXT ROUND
// =======================
function nextRound() {
    round++;
    if (round > maxRounds) {
        message.textContent = "Game Finished!";
        clearInterval(fightInterval);
        return;
    }

    playerHealth = 100;
    enemyHealth = 100;
    updateHealthBars();
    roundText.textContent = `Round: ${round} / ${maxRounds}`;
    message.textContent = "New Round!";

    enemyImg.src = enemyImages[round - 1];

    const increase = Math.random() < 0.5 ? 6 : 7;
    enemyAttack += increase;
}

// =======================
// PAUSE MENU
// =======================
function togglePause() {
    isPaused = !isPaused;

    if (isPaused) {
        pauseMenu.classList.remove("hidden");
        pauseCoins.textContent = `Coins: ${coins}`;
        clearInterval(fightInterval);
        message.textContent = "Game Paused";
    } else {
        pauseMenu.classList.add("hidden");
        message.textContent = "Game Resumed!";
        startAutoFight(); // begin auto-fight only when unpaused
    }
}

// =======================
// SONG OPTIONS
// =======================
function changeSong(song) {
    alert(`Song changed to: ${song}`);
}