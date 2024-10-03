document.addEventListener("DOMContentLoaded", function () {
  const gameContainer = document.getElementById("gameContainer");
  const buttons = document.querySelector(".buttons");
  const helpButton = document.getElementById("helpButton");
  const leaderboardButton = document.getElementById("leaderboardButton");
  const settingsButton = document.getElementById("settingsButton");

  // Wait for the animation to complete (5s in this case)
  gameContainer.addEventListener("animationend", function () {
    buttons.style.display = "flex"; // Show the buttons
    buttons.style.animation = "fadeInButtons 1s ease forwards"; // Fade-in effect
    helpButton.style.display = "flex";
    helpButton.style.animation = "fadeInButtons 1s ease forwards";
    leaderboardButton.style.display = "flex";
    leaderboardButton.style.animation = "fadeInButtons 1s ease forwards";
    settingsButton.style.display = "flex";
    settingsButton.style.animation = "fadeInButtons 1s ease forwards";
  });
});
