/* =========================
   GAME STATE
========================= */
let round = 1
let playerHealth = 100
let enemyHealth = 100
let playerAttack = 6
let enemyAttack = 16
let bonusApplied = false
let coins = 66
let coinInterval
let fightInterval
let paused = false
let activeBonuses = [];
let baseCoinRate = 1;

/* =========================
   character bonuses based on name
========================= */
// Get player name from start menu
let playerName = localStorage.getItem("playerName") || "Player";

// Apply special bonuses based on name
let shield = 0;
let coinRateMultiplier = 1;

function applyBonuses() {
    if(playerName === "67"){
        playerAttack += 67; // special weapon
        document.getElementById("character").classList.add("glow-red"); // red glow
        message.textContent = "Special weapon unlocked! +67 attack!";
        activeBonuses.push("+67 Attack");
    } 
    else if(playerName === "^&"){
        shield = playerHealth / 2; // half health shield
        message.textContent = "Shield activated! You start with half health shield!";
        activeBonuses.push("Shield");
    } 
    else if(playerName[0] === "C"){
        coinRateMultiplier = 1.5; // 1.5x coin gain
        message.textContent = "Coin rate multiplied by 1.5x!";
        activeBonuses.push("1.5x Coins");
    }
}

// Wait for DOM to be ready before applying bonuses
document.addEventListener('DOMContentLoaded', applyBonuses);

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
const pauseStats = document.getElementById("pause-stats")
const tryAgainBtn = document.getElementById("try-again-btn")
const endScreen = document.getElementById("end-screen")
const coinDrop = document.getElementById("coin-drop")

/* =========================
   COINS
========================= */
function startCoins() {
    coinInterval = setInterval(() => {
        let coinRate = baseCoinRate;
        if(playerName[0] === "C"){
            coinRate = baseCoinRate * 1.5;
        }
        coins += Math.floor(coinRate)
        coinsText.textContent = "Coins: " + coins
    }, 1000)
}
function stopCoins() { clearInterval(coinInterval) }
startCoins()

/* =========================
   AUTO-FIGHT
========================= */
startFight()
function startFight() {
    fightInterval = setInterval(() => { attack() }, 6000)
}

/* =========================
   ATTACK SYSTEM
========================= */
function attack() {
    fighterText.textContent = "Current Fighter: Player"
    player.classList.add("attack")
    let playerDamage = Math.floor(Math.random() * 2) + playerAttack
    enemyHealth -= playerDamage
    showDamage(enemyDamageText, playerDamage)
    enemy.classList.add("hit","bounce")
    updateBars()
    checkHealthBonus()

    setTimeout(() => {
        fighterText.textContent = "Current Fighter: Enemy"
        let enemyDamage = Math.floor(Math.random() * 2) + enemyAttack
        let actualDamage = enemyDamage
        
        // Apply shield if available
        if (shield > 0) {
            if (shield >= actualDamage) {
                shield -= actualDamage
                actualDamage = 0
                message.textContent = `Shield blocked ${enemyDamage} damage! Shield: ${shield.toFixed(1)}`
            } else {
                actualDamage -= shield
                message.textContent = `Shield absorbed ${shield} damage! Shield depleted!`
                shield = 0
            }
        }
        
        if (actualDamage > 0) {
            playerHealth -= actualDamage
        }
        
        showDamage(playerDamageText, actualDamage)
        player.classList.add("hit","bounce")
        updateBars()
        checkRound()
    }, 3000)
}

/* =========================
   HEALTH BARS
========================= */
function updateBars() {
    playerBar.style.width = playerHealth + "%"
    enemyBar.style.width = enemyHealth + "%"
    updateColor(playerBar, playerHealth)
    updateColor(enemyBar, enemyHealth)
}

function updateColor(bar, health) {
    if (health > 60) bar.style.background = "limegreen"
    else if (health > 30) bar.style.background = "yellow"
    else bar.style.background = "red"
}

function checkHealthBonus() {
    if (!bonusApplied && playerHealth === 67) {
        playerAttack *= 2
        bonusApplied = true
        message.textContent = "Health at 67! Attack doubled!"
    }
}

/* =========================
   DAMAGE TEXT
========================= */
function showDamage(el, damage) {
    el.textContent = "-" + damage
    el.classList.remove("show-damage")
    void el.offsetWidth
    el.classList.add("show-damage")
}

/* =========================
   ROUND SYSTEM (ENDLESS)
========================= */
function checkRound() {
    if (enemyHealth <= 0) {
        let droppedCoins = Math.random() < 0.5 ? 16 : 17
        coins += droppedCoins
        coinsText.textContent = "Coins: " + coins

        coinDrop.textContent = `+${droppedCoins} 💰`
        coinDrop.classList.remove("show-damage")
        void coinDrop.offsetWidth
        coinDrop.classList.add("show-damage")

        message.textContent = `Enemy defeated! +${droppedCoins} coins`

        round++
        playerHealth = 100
        enemyHealth = 100
        bonusApplied = false
        baseCoinRate += 1 // Increase coin rate by 1 per round
        playerAttack += 1.5 // Increase player attack by 1.5 each round
        // Reset shield and reapply bonus if player name is "^&"
        if(playerName === "^&"){
            shield = playerHealth / 2;
        } else {
            shield = 0;
        }
        enemyImg.src = enemyImages[(round-1) % enemyImages.length]
        enemyAttack += Math.random() < 0.5 ? 6 : 7
        let currentCoinRate = playerName[0] === "C" ? Math.floor(baseCoinRate * 1.5) : baseCoinRate;
        message.textContent = `Round ${round} - Coin rate: ${currentCoinRate}/sec`
    }
    else if (playerHealth <= 0) {
        clearInterval(fightInterval)
        stopCoins()
        endScreen.classList.remove("hidden")
    }
}

/* =========================
   PAUSE SYSTEM
========================= */
document.addEventListener("keydown", e => { if(e.key === "p") togglePause() })

function togglePause() {
    paused = !paused

    const statsDiv = document.getElementById("pause-stats");
    // Show player stats + bonuses
        let bonusText = activeBonuses.length > 0 ? `<p>Bonuses: ${activeBonuses.join(", ")}</p>` : "";

    if(paused){
        pauseMenu.classList.remove("hidden")
        clearInterval(fightInterval)
        stopCoins()
        pauseStats.innerHTML = `
            <p>Round: ${round}</p>
            <p>Health: ${playerHealth} / 100</p>
            <p>Attack: ${playerAttack}</p>
            <p>Coins: ${coins}</p>
            ${bonusText}
        `
    } else {
        pauseMenu.classList.add("hidden")
        startFight()
        startCoins()
    }
}

/* =========================
   WEAPON SHOP
========================= */
document.querySelectorAll(".weapon-card").forEach(card=>{
    card.onclick = ()=>{
        let cost = parseInt(card.dataset.cost)
        let power = parseInt(card.dataset.attack)
        if(coins >= cost){
            coins -= cost
            coinsText.textContent = "Coins: " + coins
            card.style.background = "#2ecc71"
            card.style.pointerEvents = "none"
            
            if(power === 0){
                // Coin rate upgrade
                baseCoinRate += 5
                message.textContent = "Coin rate increased by +5/sec!"
            } else {
                // Attack upgrade
                playerAttack += power
                message.textContent = "Attack increased! (+" + power + ")"
            }
        } else {
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

/* =========================
   END SCREEN
========================= */
tryAgainBtn.addEventListener("click", ()=>{
    window.location.href = "index.html"
})