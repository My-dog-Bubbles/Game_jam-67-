// start screen logic
const startBtn = document.getElementById("startBtn");
const instructionsBtn = document.getElementById("instructionsBtn");

startBtn.addEventListener("click", () => {
    const playerNameInput = document.getElementById("player-name-input");
    const playerName = playerNameInput.value.trim() || "Player";
    localStorage.setItem("playerName", playerName);
    window.location.href = "game.html";
});

instructionsBtn.addEventListener("click", () => {
    window.location.href = "instructions.html";
});