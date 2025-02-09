
class Level {
  constructor() {
    this.level = 1;
    this.score = 0;
  }

  reset() {
    this.level = 1;
    this.score = 0;
  }

  nextLevel() {
    gui.addMoney(-gui.resources.quota);
    gui.addTime(-gui.resources.time);
    gui.addQuota(25);
    this.level += 1;
    this.score += 25;
    sound.quotaReached.play(0, 1, 0.2);
    gui.addHealth(50);
  }

  gameOver() {
    gui.addTime(-gui.resources.time);
    scenes.cutSceneTo(new GameOverScene());
  }

  update(dt) {
    if (gui.resources.time >= gui.resources.maxTime) {
      this.gameOver();
    }

    if (gui.resources.money >= gui.resources.quota) {
      this.nextLevel();
    }
  }
}
