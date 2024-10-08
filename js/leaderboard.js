document.addEventListener("DOMContentLoaded", function () {
  const leaderboardData = [
    { name: "Alice", score: 150 },
    { name: "Bob", score: 120 },
    { name: "Charlie", score: 100 },
    { name: "David", score: 90 },
    { name: "Eve", score: 80 },
  ];

  // Function to get the user's score from local storage
  function getUserScore() {
    return localStorage.getItem("userScore") || 0;
  }

  // Function to set the user's score in local storage
  function setUserScore(score) {
    localStorage.setItem("userScore", score);
  }

  // user score for the leaderboard
  const userScore = getUserScore();
  setUserScore(userScore);

  // Retrieve the user's score from local storage
  const savedUserScore = getUserScore();

  const leaderboardElement = document.getElementById("leaderboard");
  const yourScoreElement = document.getElementById("your-score");

  leaderboardData.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${entry.name} - ${entry.score}`;
    leaderboardElement.appendChild(listItem);
  });

  yourScoreElement.textContent = savedUserScore;
});
