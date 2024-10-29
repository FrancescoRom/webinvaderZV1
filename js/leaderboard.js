document.addEventListener("DOMContentLoaded", function () {
  const leaderboardData = [
    { name: "Alice", score: 70 },
    { name: "Bob", score: 62 },
    { name: "Charlie", score: 50 }, // basic placeholders for leaderboarddata
    { name: "David", score: 30 },
    { name: "Eve", score: 10 },
  ];

  // Function to get the user's score from local storage
  function getUserScore() {
    return parseInt(localStorage.getItem("userScore")) || 0;
  }

  // Function to set the user's score in local storage
  function setUserScore(score) {
    localStorage.setItem("userScore", score);
  }

  // Retrieve the user's score from local storage
  const savedUserScore = getUserScore();

  // Add the user's score to the leaderboard data
  leaderboardData.push({ name: "You", score: savedUserScore });

  // Sort the leaderboard data based on scores in descending order
  leaderboardData.sort((a, b) => b.score - a.score);

  // Keep only the top 5 scores
  const top5Leaderboard = leaderboardData.slice(0, 5);

  const leaderboardElement = document.getElementById("leaderboard");
  const yourScoreElement = document.getElementById("your-score");

  // Clear existing leaderboard entries
  leaderboardElement.innerHTML = "";

  // Display the top 5 leaderboard entries
  top5Leaderboard.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
    if (entry.name === "You") {
      listItem.classList.add("highlight");
    }
    leaderboardElement.appendChild(listItem);
  });

  // Display the user's score
  yourScoreElement.textContent = savedUserScore;
});
