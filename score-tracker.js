
class ScoreTracker {
  constructor() {
    this.highscores = JSON.parse(localStorage.getItem("highscores")) || {};
  }

  saveHighscores() {
    localStorage.setItem("highscores", JSON.stringify(this.highscores));
  }

  addHighscore(name, score) {
    this.highscores[name] = score;
    this.saveHighscores();
  }

  clearHighscores() {
    this.highscores = {};
    this.saveHighscores();
  }

  isHighscore(score) {
    let highscores = Object.values(this.highscores);
    highscores.sort((a, b) => b - a);
    let maxScore = highscores[0] || 0;
    print(maxScore);
    return maxScore < score;
  }
}
