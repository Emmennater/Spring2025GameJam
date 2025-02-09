
class GUI {
  constructor() {
    this.guiComponents = {};
    this.splashTexts = [];
    this.resources = new Resources(this);
    this.guiComponents.level = new Text("Level");
    this.guiComponents.time = new ClockMeter("Time", 0, 96, color(200));
    this.guiComponents.money = new Meter("Quota", 0, 25, color(110, 230, 110));
    this.guiComponents.food = new Meter("Food", 0, 200);
    this.guiComponents.health = new Meter("Health", 0, 100, color(230, 110, 110));
    this.scoreTracker = new ScoreTracker();
    this.reset();
  }

  getScore() {
    return scene.level.score + this.resources.money;
  }

  reset() {
    this.guiComponents.money.max = 25;
    this.addFood(-this.resources.food + 80, true);
    this.addHealth(-this.resources.health + 100, true);
    this.addMoney(-this.resources.money, true);
    this.addTime(-this.resources.time, true);
  }

  splashText(...args) {
    const splash = new SplashText(...args);
    this.splashTexts.push(splash);
    return splash;
  }

  clearSplashTexts() {
    this.splashTexts = [];
  }

  addFood(diff, force = false) {
    const MAX = this.guiComponents.food.max;
    const oldFood = this.resources.food;
    this.resources.food = constrain(this.resources.food + diff, 0, MAX);
    diff = this.resources.food - oldFood;

    if (diff == 0 && !force) return;

    let comp = this.guiComponents.food;
    let sign = ['-', '', '+'][Math.sign(diff) + 1];

    if (!force) {
      this.splashText(`${sign} ${Math.abs(diff)}`, comp.x + comp.w + 20, comp.y + comp.h / 2, 1, color(255), diff > 0);
    }

    this.guiComponents.food.setValue(this.resources.food);
  }

  addMoney(diff, force = false) {
    const MAX = Infinity
    const oldMoney = this.resources.money;
    this.resources.money = constrain(this.resources.money + diff, 0, MAX);
    diff = this.resources.money - oldMoney;

    if (diff == 0 && !force) return;

    let comp = this.guiComponents.money;
    let sign = ['-', '', '+'][Math.sign(diff) + 1];

    if (!force) {
      this.splashText(`${sign} ${Math.abs(diff).toFixed(0)}`, comp.x + comp.w + 40, comp.y + comp.h / 2, 1, color(255), diff > 0);
    }

    this.guiComponents.money.setValue(this.resources.money);
  }

  addHealth(diff, force = false) {
    const MAX = this.guiComponents.health.max;
    const oldHealth = this.resources.health;
    this.resources.health = constrain(this.resources.health + diff, 0, MAX);
    diff = this.resources.health - oldHealth;

    if (diff == 0 && !force) return;

    let comp = this.guiComponents.health;
    let sign = ['-', '', '+'][Math.sign(diff) + 1];

    if (!force) {
      const c = diff > 0 ? color(110, 230, 110) : color(230, 110, 110);
      this.splashText(`${sign} ${Math.abs(diff)}`, comp.x + comp.w + 20, comp.y + comp.h / 2, 1, c, diff > 0);
    }

    this.guiComponents.health.setValue(this.resources.health);
  }

  addTime(diff, force = false) {
    const MAX = this.guiComponents.time.max;
    const oldTime = this.resources.time;
    this.resources.time = constrain(this.resources.time + diff, 0, MAX);
    diff = this.resources.time - oldTime;

    if (diff == 0 && !force) return;

    let comp = this.guiComponents.time;
    let sign = ['-', '', '+'][Math.sign(diff) + 1];

    if (!force) {
      this.splashText(`${sign} ${Math.abs(diff).toFixed(0)}`, comp.x + comp.w + 20, comp.y + comp.h / 2, 1, color(255), diff > 0);
    }

    this.guiComponents.time.setValue(this.resources.time);
  }

  addQuota(diff) {
    this.resources.quota += diff;
    this.guiComponents.money.max += diff;
  }

  update(dt) {
    this.resources.update(dt);

    this.guiComponents.level.setValue(`Level ${scene.level.level}`);

    // Update splash texts
    for (let i = 0; i < this.splashTexts.length; i++) {
      this.splashTexts[i].update(dt);
    }
  }

  draw() {
    const FONT_SIZE = 40;

    fill(255, 200);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(FONT_SIZE);

    if (boat.canBoard()) {
      if (player.carrying) {
        text("Press E to drop off", width / 2, FONT_SIZE * 0.8);
      } else {
        text("Press E to board", width / 2, FONT_SIZE * 0.8);
      }
    } else if (!player.swimming) {
      text("Press E to dismount", width / 2, FONT_SIZE * 0.8);
    } else if (player.canPickupMessage) {
      text(player.canPickupMessage, width / 2, FONT_SIZE * 0.8);
    }

    // Draw meters
    const COMP_W = 200;
    const COMP_H = 40;
    const COMP_SPACING = 10;
    const COMP_X = 10;
    const COMP_Y = 10;
    let i = 0;
    for (let key in this.guiComponents) {
      this.guiComponents[key].draw(COMP_X, COMP_Y + COMP_H * i + COMP_SPACING * i, COMP_W, COMP_H);
      i++;
    }

    // Draw splash texts
    for (let i = 0; i < this.splashTexts.length; i++) {
      this.splashTexts[i].draw();
    }
  }
}

class GUIComponent {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }

  draw(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

class Text extends GUIComponent {
  constructor(text) {
    super();
    this.text = text;
  }

  setValue(val) {
    this.text = val;
  }

  draw(x, y, w, h) {
    super.draw(x, y, w, h);

    fill(255);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(30);
    text(this.text, x, y + h / 2);
    this.w = textWidth(this.text);
  }
}

class Meter extends GUIComponent {
  constructor(label, min, max, col = color(110, 170, 230)) {
    super();
    this.label = label;
    this.val = 0;
    this.min = min;
    this.max = max;
    this.col = col;
  }

  setValue(val) {
    const diff = val - this.val;
    this.val = val;
    return diff;
  }

  draw(x, y, w, h) {
    super.draw(x, y, w, h);

    // Draw background
    fill(setAlpha(setBrightness(this.col, 0.3), 200));
    rect(x, y, w, h);

    // Draw value
    fill(this.col);
    rect(x, y, w * ((this.val - this.min) / (this.max - this.min)), h);

    // Draw label
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text(`${this.val.toFixed(0)} / ${this.max.toFixed(0)} ${this.label}`, x + w / 2, y + h / 2);
  }
}

class ClockMeter extends Meter {
  constructor(label, min, max, col = color(110, 170, 230)) {
    super(label, min, max, col);
    this.startTime = new Date("2023-02-08T06:00:00"); // Sunrise
    this.endTime = new Date("2023-02-08T22:00:00"); // Sunset
  }

  draw(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    // Draw background
    fill(setAlpha(setBrightness(this.col, 0.3), 200));
    rect(x, y, w, h);

    // Draw value
    fill(this.col);
    rect(x, y, w * ((this.val - this.min) / (this.max - this.min)), h);

    // Draw label
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);

    // Correct interpolation of time
    let elapsed = this.endTime.getTime() - this.startTime.getTime();
    let timePassed = this.startTime.getTime() + elapsed * (this.val / this.max);
    let time = new Date(timePassed);

    // Extract time components correctly
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

    let strTime = hours + ":" + minutes + " " + ampm;
    text(strTime, x + w / 2, y + h / 2);

  }
}

class SplashText {
  constructor(text, x, y, timer = 1, col = color(255), grow = true) {
    this.text = text;
    this.timer = timer;
    this.x = x;
    this.y = y;
    this.col = col;
    this.grow = grow;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer < 0) this.timer = 0;
  }

  draw() {
    const FADE_SPEED = 1;

    if (this.timer > 0) {
      let sz = 40;
      let alpha = 255;
      if (this.timer < FADE_SPEED) {
        if (this.grow) {
          sz = map(this.timer, 0, FADE_SPEED, sz, 30);
        } else {
          sz = map(this.timer, 0, FADE_SPEED, 30, sz);
        }
        alpha = map(this.timer, 0, FADE_SPEED, 0, 255);
      }
      fill(setAlpha(this.col, alpha));
      noStroke();
      textAlign(LEFT, CENTER);
      textSize(sz);
      text(this.text, this.x, this.y);
    }
  }
}
