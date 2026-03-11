// start screen logic
const startBtn = document.getElementById("startBtn");
const instructionsBtn = document.getElementById("instructionsBtn");

startBtn.addEventListener("click", () => {
    window.location.href = "game.html";
});

instructionsBtn.addEventListener("click", () => {
    window.location.href = "instructions.html";
});