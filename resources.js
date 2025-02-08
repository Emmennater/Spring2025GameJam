
class Resources {
  constructor(parent) {
    this.money = 0;
    this.food = 0;
    this.health = 0;
    this.foodDepletionRate = 1;
    this.drainFood = true;
    this.parent = parent;

    setInterval(() => {
      if (this.drainFood) {
        gui.addFood(-this.foodDepletionRate);
      }
      if (this.food == 0) {
        gui.addHealth(-5);
      }
    }, 3000);
  }

  update(dt) {
    const IS_MOVING = player.vx != 0 || player.vy != 0;

    if (IS_MOVING) {
      this.foodDepletionRate = 4;
    } else if (player.swimming) {
      this.foodDepletionRate = 2;
    } else {
      this.foodDepletionRate = 1;
    }
  }
}
