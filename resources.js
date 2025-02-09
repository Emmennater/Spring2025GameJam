
class Resources {
  constructor(parent) {
    this.money = 0;
    this.food = 0;
    this.health = 0;
    this.time = 0;
    this.quota = 25;
    this.maxTime = 100;
    this.foodDepletionRate = 1;
    this.drainFood = true;
    this.parent = parent;
    this.timeSpeed = 1;
    this.difficulty = 2;

    setInterval(() => {
      if (this.drainFood) {
        gui.addFood(-this.foodDepletionRate);
      }
      if (this.food == 0) {
        gui.addHealth(-5);
      }
      gui.addTime(this.timeSpeed * this.difficulty, 1);
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
      this.timeSpeed = boat.isMoving() ? 3 : 1;
    }
  }
}
