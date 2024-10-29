// Get the settings form element
const settingsForm = document.getElementById("settingsForm");

// Add an event listener to the form's submit event
settingsForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get the selected difficulty value
  const difficulty = document.getElementById("difficulty").value;

  // Save the selected difficulty to local storage
  localStorage.setItem("gameDifficulty", difficulty);

  // Notify the user that the settings have been saved
  alert("Settings saved!");
});

// Load the saved settings when the page loads
window.addEventListener("load", function () {
  // Get the saved difficulty from local storage
  const savedDifficulty = localStorage.getItem("gameDifficulty");

  // If a saved difficulty is found, set the select element's value
  if (savedDifficulty) {
    document.getElementById("difficulty").value = savedDifficulty;
  }
});
