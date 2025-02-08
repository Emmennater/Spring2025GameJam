
class GUI {
  constructor() {
    this.guiComponents = [];
    this.splashTexts = [];
    this.resources = new Resources(this);
    this.guiComponents.push(new Text("Money"));
    this.guiComponents.push(new Meter("Food", 0, 100));
    this.setFood(80, true);
    this.setMoney(100, true);
  }

  splashText(...args) {
    const splash = new SplashText(...args);
    this.splashTexts.push(splash);
    return splash;
  }

  clearSplashTexts() {
    this.splashTexts = [];
  }

  setFood(food, force = false) {
    const diff = food - this.resources.food;
    
    if (diff == 0 && !force) return;
    
    let comp = this.guiComponents[1];
    let sign = ['-', '', '+'][Math.sign(diff) + 1];
    
    if (!force) {
      this.splashText(`${sign} ${Math.abs(diff)}`, comp.x + comp.w + 20, comp.y + comp.h / 2, 1, color(255), diff > 0);
    }

    this.guiComponents[1].setValue(food);
    this.resources.food = food;
  }

  setMoney(money, force = false) {
    const diff = money - this.resources.money;
    
    if (diff == 0 && !force) return;
    
    let comp = this.guiComponents[0];
    let sign = ['-', '', '+'][Math.sign(diff) + 1];
    
    if (!force) {
      this.splashText(`${sign} $${Math.abs(diff).toFixed(2)}`, comp.x + comp.w + 40, comp.y + comp.h / 2, 1, color(255), diff > 0);
    }
    
    this.guiComponents[0].setValue(`$${money.toFixed(2)}`);
    this.resources.money = money;
  }

  update(dt) {
    this.resources.update(dt);

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
      text("Press E to board", width / 2, FONT_SIZE * 0.8);
    } else if (!player.swimming) {
      text("Press E to dismount", width / 2, FONT_SIZE * 0.8);
    }

    // Draw meters
    const COMP_W = 200;
    const COMP_H = 40;
    const COMP_SPACING = 10;
    const COMP_X = 10;
    const COMP_Y = 10;
    for (let i = 0; i < this.guiComponents.length; i++) {
      this.guiComponents[i].draw(COMP_X, COMP_Y + COMP_H * i + COMP_SPACING * i, COMP_W, COMP_H);
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
    text(`${this.val.toFixed(0)} ${this.label}`, x + w / 2, y + h / 2);
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
