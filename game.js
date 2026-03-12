/* =========================
   GAME STATE
========================= */

let round = 1
let maxRounds = 5

let playerHealth = 100
let enemyHealth = 100

let playerAttack = 10
let enemyAttack = 19
let bonusApplied = false;

let coins = 0
let coinInterval
let fightInterval
let paused = false
/* =========================
   ENEMY DATA
========================= */

const enemyImages = [
"photos/Enemies/67.png",
"photos/Enemies/ballarina_capochina.png",
"photos/Enemies/tung_tung_sahur.png",
"photos/Enemies/67.png",
"photos/Enemies/ballarina_capochina.png"
]


/* =========================
   DOM ELEMENTS
========================= */

const playerBar = document.getElementById("player-health-bar")
const enemyBar = document.getElementById("enemy-health-bar")

const player = document.getElementById("character")
const enemy = document.getElementById("enemy")

const enemyImg = document.getElementById("enemy-img")

const message = document.getElementById("message")
const coinsText = document.getElementById("coins")

const playerDamageText = document.getElementById("player-damage")
const enemyDamageText = document.getElementById("enemy-damage")

const fighterText = document.getElementById("current-fighter")

const pauseMenu = document.getElementById("pause-menu")
const pauseCoins = document.getElementById("pause-coins")


/* =========================
   COIN SYSTEM
========================= */

function startCoins() {
    coinInterval = setInterval(() => {
        coins++
        coinsText.textContent = "Coins: " + coins
    }, 1000)
}

// Start immediately when the game starts
startCoins();

function stopCoins() {
    clearInterval(coinInterval)
}

/* =========================
   START AUTO FIGHT
========================= */

startFight()

function startFight() {

    fightInterval = setInterval(() => {

        attack()

    }, 1000)

}


/* =========================
   ATTACK SYSTEM
========================= */

function attack() {

    fighterText.textContent = "Current Fighter: Player"

    player.classList.add("attack")

    let playerDamage = Math.floor(Math.random() * playerAttack) + 5
    enemyHealth -= playerDamage

    showDamage(enemyDamageText, playerDamage)
    enemy.classList.add("hit", "bounce")

    updateBars();
    checkHealthBonus();

    setTimeout(() => {

        fighterText.textContent = "Current Fighter: Enemy"

        let enemyDamage = Math.floor(Math.random() * enemyAttack) + 5
        playerHealth -= enemyDamage

        showDamage(playerDamageText, enemyDamage)

        player.classList.add("hit", "bounce")

        updateBars()

        checkRound()

    }, 500)

}


/* =========================
   HEALTH BAR SYSTEM
========================= */

function updateBars() {

    playerBar.style.width = playerHealth + "%"
    enemyBar.style.width = enemyHealth + "%"

    updateColor(playerBar, playerHealth)
    updateColor(enemyBar, enemyHealth)

}

function checkHealthBonus() {
    if (!bonusApplied && playerHealth === 67) {
        playerAttack *= 2; // double attack
        bonusApplied = true;
        message.textContent = "Health at 67! Attack doubled!";
    }
}

function updateColor(bar, health) {

    if (health > 60) {
        bar.style.background = "limegreen"
    }
    else if (health > 30) {
        bar.style.background = "yellow"
    }
    else {
        bar.style.background = "red"
    }

}


/* =========================
   FLOATING DAMAGE TEXT
========================= */

function showDamage(element, damage) {

    element.textContent = "-" + damage

    element.classList.remove("show-damage")

    void element.offsetWidth

    element.classList.add("show-damage")

}


/* =========================
   ROUND SYSTEM
========================= */

function checkRound() {
    if (enemyHealth <= 0) {
        // Random coin drop
        let droppedCoins = Math.random() < 0.5 ? 16 : 17;
        coins += droppedCoins;
        coinsText.textContent = "Coins: " + coins;

        // Show floating coin drop above enemy
        const coinDrop = document.getElementById("coin-drop");
        coinDrop.textContent = `+${droppedCoins} 💰`;
        coinDrop.classList.remove("show-damage");
        void coinDrop.offsetWidth; // restart animation
        coinDrop.classList.add("show-damage");

        // Optional: also update message area
        message.textContent = `Enemy defeated! You gained ${droppedCoins} coins!`;

        // Reset enemy for next round
        round++

        if (round > maxRounds) {

            clearInterval(fightInterval)
            message.textContent = "Game Finished"
            return
        }

        playerHealth = 100
        enemyHealth = 100

        enemyImg.src = enemyImages[round - 1]

        enemyAttack += Math.random() < .5 ? 6 : 7
    }

    // Player death
    else if (playerHealth <= 0) {
        round++;
        if (round > maxRounds) {
            clearInterval(fightInterval);
            message.textContent = "Game Finished";
            return;
        }
        playerHealth = 100;
        enemyHealth = 100;

        // Swap enemy image
        enemyImg.src = enemyImages[round - 1];
        enemyAttack += Math.random() < 0.5 ? 6 : 7;
    }

}


/* =========================
   PAUSE SYSTEM
========================= */

document.addEventListener("keydown", e => {

    if (e.key === "p") {
        togglePause()
    }

})

function togglePause() {
    paused = !paused;

    const statsDiv = document.getElementById("pause-stats");

    if (paused) {
        pauseMenu.classList.remove("hidden")
        clearInterval(fightInterval)
        stopCoins(); // stop coin gain

        // Show player stats
        statsDiv.innerHTML = `
            <p>Round: ${round} / ${maxRounds}</p>
            <p>Health: ${playerHealth} / 100</p>
            <p>Attack: ${playerAttack}</p>
            <p>Coins: ${coins}</p>
        `;
    }
    else {

        pauseMenu.classList.add("hidden")
        startFight()
        startCoins(); // resume coin gain

    }

}


/* =========================
   WEAPON SHOP
========================= */

document.querySelectorAll(".weapon-card").forEach(card => {

    card.onclick = () => {

        let cost = parseInt(card.dataset.cost)
        let power = parseInt(card.dataset.attack)

        if (coins >= cost) {
            coins -= cost
            playerAttack += power

            coinsText.textContent = "Coins: " + coins

            card.style.background = "#2ecc71"
            card.style.pointerEvents = "none"

            message.textContent = "Attack increased!" + " (+" + power + ")"
        }
        else {

            message.textContent = "Not enough coins!"
        }
    }
})

/* =========================
   MUSIC SYSTEM
========================= */

function changeSong(song) {

    alert("Song changed to " + song)

}