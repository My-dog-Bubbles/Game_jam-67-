// start screen logic
const startBtn = document.getElementById("startBtn");
const instructionsBtn = document.getElementById("instructionsBtn");

startBtn.addEventListener("click", () => {
    window.location.href = "game.html";
});

instructionsBtn.addEventListener("click", () => {
    window.location.href = "instructions.html";
});

settingsBtn.addEventListener("click", () => {
    alert("Settings coming soon!");
});



// Game logic
let playerHealth = 100;
let enemyHealth = 100;
let round = 1;
let maxRounds = 5;

const playerHealthText = document.getElementById("player-health");
const enemyHealthText = document.getElementById("enemy-health");
const roundText = document.getElementById("round");
const message = document.getElementById("message");
const enemy = document.getElementById("enemy");
const playerBar = document.getElementById("player-health-bar");
const enemyBar = document.getElementById("enemy-health-bar");

const playerDamageText = document.getElementById("player-damage");
const enemyDamageText = document.getElementById("enemy-damage");

enemy.addEventListener("click", attackEnemy);

function attackEnemy(){

    if(round > maxRounds) return;

    let playerDamage = Math.floor(Math.random()*20)+5;
    let enemyDamage = Math.floor(Math.random()*15)+5;

    enemyHealth -= playerDamage;
    playerHealth -= enemyDamage;

    if(enemyHealth < 0) enemyHealth = 0;
    if(playerHealth < 0) playerHealth = 0;

    updateHealthBars();

    showDamage(enemyDamageText, playerDamage);
    showDamage(playerDamageText, enemyDamage);

    document.getElementById("enemy").classList.add("hit");
    document.getElementById("character").classList.add("hit");

    setTimeout(()=>{
        document.getElementById("enemy").classList.remove("hit");
        document.getElementById("character").classList.remove("hit");
    },300);

    checkRound();
}

function updateHealthBars(){

    playerBar.style.width = playerHealth + "%";
    enemyBar.style.width = enemyHealth + "%";

}

function showDamage(element, damage){

    element.textContent = "-" + damage;

    element.classList.remove("show-damage");

    void element.offsetWidth;

    element.classList.add("show-damage");
}

function checkRound(){

    if(enemyHealth <= 0){
        message.textContent = "You won round " + round + "!";
        nextRound();
    }

    else if(playerHealth <= 0){
        message.textContent = "You lost round " + round + "!";
        nextRound();
    }

}

function nextRound(){

    round++;

    if(round > maxRounds){
        message.textContent = "Game Finished!";
        return;
    }

    playerHealth = 100;
    enemyHealth = 100;

    playerHealthText.textContent = playerHealth;
    enemyHealthText.textContent = enemyHealth;

    roundText.textContent = "Round: " + round + " / 5";

    message.textContent = "New Round! Attack!";
}