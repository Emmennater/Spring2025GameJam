
class Resources {
  constructor(parent) {
    this.money = 0;
    this.food = 0;
    this.health = 0;
    this.time = 0;
    this.quota = 25;
    this.maxTime = 96;
    this.foodDepletionRate = 1;
    this.drainFood = true;
    this.parent = parent;
    this.timeSpeed = 1;
    this.difficulty = 0.5;

    setInterval(() => {
      if (scenes.scene.paused) return;
      if (this.drainFood) {
        gui.addFood(-this.foodDepletionRate);
      }
      if (this.food == 0) {
        gui.addHealth(-5);
      }
      if (this.food > 100 && this.health < 100) {
        gui.addHealth(1);
      }
      gui.addTime(this.timeSpeed * this.difficulty);
    }, 3000);
  }

  update(dt) {
    const IS_MOVING = player.vx != 0 || player.vy != 0;

    if (IS_MOVING) {
      this.foodDepletionRate = 2;
      this.timeSpeed = 1;
    } else if (player.swimming) {
      this.foodDepletionRate = 1;
      this.timeSpeed = 1;
    } else {
      this.foodDepletionRate = 0;
      this.timeSpeed = boat.isMoving() ? 5 : 1;
    }
  }
}
