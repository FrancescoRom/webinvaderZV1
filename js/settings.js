document
  .getElementById("settingsForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const difficulty = document.getElementById("difficulty").value;
    // save difficulty level to local storage
    localStorage.setItem("gameDifficulty", difficulty);

    alert("Settings saved!");
  });

// load settings from local storage when page loads
window.addEventListener("load", function () {
  const savedDifficulty = localStorage.getItem("gameDifficulty");

  if (savedDifficulty) {
    document.getElementById("difficulty").value = savedDifficulty;
  }
});
