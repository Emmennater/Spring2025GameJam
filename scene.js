class SceneManager {
  constructor() {
    this.scene = new TitleScene();
    this.fade = 0;
    this.fadeDuration = 1;
    this.fadeTime = this.fadeDuration;
    this.nextScene = null;
  }

  setScene(scene) {
    this.scene = scene;
    this.scene.reset();
    this.scene.init();
  }

  cutSceneTo(scene) {
    if (this.nextScene) return;
    this.fadeTime = 0;
    this.nextScene = scene;
  }

  update(dt) {
    if (this.fadeTime < this.fadeDuration) {
      this.fadeTime = min(this.fadeTime + dt, this.fadeDuration);
    }

    if (this.nextScene && this.fadeTime > this.fadeDuration / 2) {
      this.setScene(this.nextScene);
      this.nextScene = null;
    }

    this.scene.update(dt);
  }

  draw() {
    this.fade = Math.abs(this.fadeDuration - this.fadeTime * 2) / this.fadeDuration;

    this.scene.draw();
    background(0, 0, 0, 255 - this.fade * 255);
  }
}

class Scene {
  constructor() {
    
  }

  pause() {

  }

  typed(ch) {

  }

  init() {

  }

  reset() {

  }
}

class TitleScene extends Scene {
  constructor() {
    super();
  }

  update(dt) {
    if (keys.SPACE) {
      scenes.cutSceneTo(scene);
    }
  }

  draw() {
    background(0);
    
    const aspect = (width / height) * (titlescreen.height / titlescreen.width);
    let w = width;
    let h = height;
    let x = 0;
    let y = 0;

    if (aspect < 1) {
      h *= aspect;
      y = (height - h) / 2;
    } else {
      w /= aspect;
      x = (width - w) / 2;
    }

    image(titlescreen, x, y, w, h);

    textFont("arial");
    fill(255, 100 + (sin(frameCount * 0.1) + 1) / 2 * 155);
    textAlign(CENTER);
    textSize(50);
    text("Press Space to Start", width / 2, height / 2);
    
    let sz = h * 0.04;
    textFont("monospace");
    fill(219, 183, 15);
    noStroke();
    textSize(sz);
    textAlign(LEFT, TOP);

    let i = 0;
    for (let name in gui.scoreTracker.highscores) {
      const score = gui.scoreTracker.highscores[name];

      text(name + "   " + score, x + w * 0.69, y + h * 0.13 + sz * i);
      
      if (i++ > 5) break;
    }
  }
}

class GameScene extends Scene {
  constructor() {
    super();
    this.crates = [];
    this.fish = [];
    this.world = new World();
    this.level = new Level();
    this.paused = false;
    this.timeFade = 0;
  }

  pause() {
    this.paused = !this.paused;
  }

  reset() {
    player.reset();
    boat.reset();
    this.crates = [];
    this.fish = [];
    gui.reset();
    this.level.reset();
    this.timeFade = 0;
  }

  addCrate(crate) {
    this.crates.push(crate);
  }

  addFish(fish) {
    this.fish.push(fish);
  }

  initObjects() {
    // Crates
    for (let i = 0; i < 20; i++)
      spawnRandomCrate(true, GreenCrate);
    for (let i = 0; i < 20; i++)
      spawnRandomCrate(true, OrangeCrate);
    for (let i = 0; i < 10; i++)
      spawnRandomCrate(true, RedCrate);

    // Fish
    for (let i = 0; i < 10; i++)
      spawnRandomFish(true, Fish);
    for (let i = 0; i < 40; i++)
      spawnRandomFish(true, SmallFish);
    for (let i = 0; i < 10; i++)
      spawnRandomFish(true, Shark);
    for (let i = 0; i < 5; i++)
      spawnRandomFish(true, Angler);
    for (let i = 0; i < 10; i++)
      spawnRandomFish(true, BigFish);
  }
  
  init() {
    this.reset();
    boat.board();
    player.setInView();
    this.initObjects();
  }

  update(dt) {
    if (this.paused) return;

    gui.update(dt);
    player.update(dt);
    boat.update(dt);
    this.level.update(dt);

    for (let i = this.crates.length - 1; i >= 0; i--) {
      this.crates[i].update(dt);

      if (this.crates[i].destroyed) {
        spawnRandomCrate(false, this.crates[i].constructor);
        this.crates.splice(i, 1);
      }
    }

    for (let i = this.fish.length - 1; i >= 0; i--) {
      this.fish[i].update(dt);

      if (this.fish[i].destroyed) {
        spawnRandomFish(false, this.fish[i].constructor);
        this.fish.splice(i, 1);
      }
    }
    
    if (gui.resources.health <= 0) {
      scenes.cutSceneTo(new GameOverScene());
    }
  }

  getDaytimeFilter() {
    let t = gui.resources.time / gui.resources.maxTime;
    let diff = t - this.timeFade;
    if (diff > 0.1) this.timeFade = t;
    this.timeFade = lerp(this.timeFade, t, 0.002);
    t = this.timeFade;

    let earlyColor = color(0, 0, 0, 210);
    let midColor = color(200, 100, 0, 100);
    let lateColor = color(255, 255, 255, 0);

    let finalColor = color(0, 0);

    let timeStops = [0, 0.1, 0.3, 0.7, 0.8, 1];
    let colorStops = [midColor, lateColor, lateColor, lateColor, midColor, earlyColor];

    for (let i = 0; i < timeStops.length - 1; i++) {
      if (t >= timeStops[i] && t < timeStops[i + 1]) {
        let t2 = (t - timeStops[i]) / (timeStops[i + 1] - timeStops[i]);
        finalColor = lerpColor(colorStops[i], colorStops[i + 1], t2);
        break;
      }
    }

    return finalColor;
  }
  
  drawBackground() {
    const focus = panzoom.unscaleCoordinate(player.x, player.y);
    const scl = panzoom.zoom;
    const WATER_Y = panzoom.yoff * scl + height / 2;
  
    // Draw the sky and background
    background(0);
    // background(80, 120, 170);
    // fill(80, 120, 170);
    // noStroke();
    // rect(0, 0, width, WATER_Y);

    panzoom.begin();
    this.world.draw(0);
    this.world.draw(2);
    panzoom.end();
  }

  draw() {
    const focus = panzoom.unscaleCoordinate(player.x, player.y);
    const scl = panzoom.zoom;
    const WATER_Y = panzoom.yoff * scl + height / 2;
    const RADIAL_W = 300 * scl;
  
    // Draw the sky and background
    this.drawBackground();
  
    // Draw game objects
    panzoom.begin();
    for (let i = 0; i < this.crates.length; i++) {
      this.crates[i].draw();
    }
    for (let i = 0; i < this.fish.length; i++) {
      this.fish[i].draw();
    }
    if (!player.swimming) player.draw();
    boat.draw();
    if (player.swimming) player.draw();
    this.world.draw(1);
    panzoom.end();
  
    // Draw the ocean water
    const DARKNESS = constrain(-panzoom.yoff / 1500, 0, 0.8);
    // fill(0, lerp(2, 0, DARKNESS), lerp(0, 10, DARKNESS), lerp(150, 255, DARKNESS));
    // rect(0, WATER_Y, width, height - WATER_Y);
    background(0, DARKNESS * 255);

    // Darken the background
    let ctx = drawingContext;
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    background(this.getDaytimeFilter());
    ctx.restore();

    // Get the canvas 2D context so we can set a blending mode
    ctx.save();  
    ctx.globalCompositeOperation = "lighter"; 
  
    // Draw the flash light gradient if the player is low enough
    if (player.y > 500) {
      const V = 0.5;
      const DIR_ANGLE = player.facing == 'left' ? PI + player.tilt + 0.3 : -player.tilt - 0.3;
      const LEN = PI/6;
      // drawLightArc(
      //   focus.x + (player.w / 2 + 2) * cos(DIR_ANGLE) * scl,
      //   focus.y + (player.w / 2 + 2) * sin(DIR_ANGLE) * scl,
      //   RADIAL_W,
      //   DIR_ANGLE - LEN,
      //   DIR_ANGLE + LEN,
      //   color(80*V, 100*V, 120*V), color(0)
      // );
      drawLightCircle(
        focus.x,
        focus.y,
        RADIAL_W,
        color(80*V, 100*V, 120*V), color(0)
      );
    }

    // Restore to the default composite operation so other drawing isn’t affected.
    ctx.restore();

    gui.draw();

    if (this.paused) {
      background(0, 100);
      fill(255);
      textAlign(CENTER);
      textSize(Math.min(width, height) * 0.1);
      text("Paused", width / 2, height / 2);
    }
  }
}

class GameOverScene extends Scene {
  constructor() {
    super();
    this.username = "";
    this.enteringName = true;
  }

  reset() {
    this.username = "";
    this.enteringName = true;
  }

  init() {
    this.isHighscore = gui.scoreTracker.isHighscore(gui.getScore());
    this.enteringName = this.isHighscore;
  }

  submitHighscore() {
    if (this.username === "") return;
    gui.scoreTracker.addHighscore(this.username, gui.getScore());
    this.enteringName = false;
  }

  typed(key) {
    if (!this.enteringName) return;
    key = key.toUpperCase();
    if (key === "BACKSPACE") this.username = this.username.slice(0, -1);
    else if (key === "ENTER") this.submitHighscore();
    else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key) && this.username.length < 10) this.username += key;
  }

  update(dt) {
    if (keys.SPACE && !this.enteringName) {
      scenes.cutSceneTo(new TitleScene());
    }
  }

  draw() {
    background(0);
    
    const aspect = (width / height) * (gameoverGif.height / gameoverGif.width);
    let w = width;
    let h = height;
    let x = 0;
    let y = 0;

    if (aspect < 1) {
      h *= aspect;
      y = (height - h) / 2;
    } else {
      w /= aspect;
      x = (width - w) / 2;
    }

    image(gameoverGif, x, y, w, h);
    
    const highscore = gui.getScore();

    // Username
    let fs = Math.min(w, h) * 0.05;
    let inputUnderscore = frameCount % 45 < 20 && this.enteringName ? "_" : " ";
    let enterName = this.enteringName ? "Enter your name: " : "";
    fill(255);
    textAlign(CENTER);
    textFont("monospace");
    textSize(fs * 1.25);
    text(enterName + this.username + inputUnderscore, width / 2, height * 0.05);

    // Score
    let scoreText = this.isHighscore ? "High Score " : "Score ";
    textSize(fs * 1.5);
    text(scoreText + highscore, x + w / 2, y + h * 0.15);

    // Continue
    textFont("arial");
    fill(255, 100 + (sin(frameCount * 0.1) + 1) / 2 * 155);
    textSize(fs);
    textFont("arial");
    text("Press Space to Continue", x + w / 2, y + h * 0.75);
  }
}

function drawLightCircle(x, y, size, start, stop) {
  let ctx = drawingContext; // Get 2D canvas context
  
  // Create multiple color stops to approximate inverse square falloff
  let gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
  
  // Calculate color components for interpolation
  const startR = red(start);
  const startG = green(start);
  const startB = blue(start);
  const startA = alpha(start);
  
  const stopR = red(stop);
  const stopG = green(stop);
  const stopB = blue(stop);
  const stopA = alpha(stop);
  
  // Add more color stops to create inverse square falloff
  // Using normalized and scaled inverse square falloff
  for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      // Calculate inverse square falloff and normalize it to [0, 1]
      const rawIntensity = 1 / (1 + 8 * t * t);
      const maxIntensity = 1; // At t = 0
      const minIntensity = 1 / (1 + 8); // At t = 1
      // Normalize intensity to reach 0 at the edge
      const intensity = (rawIntensity - minIntensity) / (maxIntensity - minIntensity);
      
      // Interpolate colors based on normalized intensity
      const r = lerp(stopR, startR, intensity);
      const g = lerp(stopG, startG, intensity);
      const b = lerp(stopB, startB, intensity);
      const a = lerp(stopA, startA, intensity);
      
      gradient.addColorStop(t, `rgba(${r}, ${g}, ${b}, ${a})`);
  }
  
  // Set the gradient as the fill style and draw a rectangle
  ctx.fillStyle = gradient;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
}

function drawLightArc(x, y, size, startAngle, endAngle, start, stop) {
  let ctx = drawingContext; // Get 2D canvas context
  
  // Save the current context state
  ctx.save();
  
  // Create a clipping path for the arc
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, size / 2, startAngle, endAngle);
  ctx.closePath();
  ctx.clip();
  
  // Create multiple color stops to approximate inverse square falloff
  let gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
  
  // Calculate color components for interpolation
  const startR = red(start);
  const startG = green(start);
  const startB = blue(start);
  const startA = alpha(start);
  
  const stopR = red(stop);
  const stopG = green(stop);
  const stopB = blue(stop);
  const stopA = alpha(stop);
  
  // Add color stops with normalized inverse square falloff
  for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      // Calculate inverse square falloff and normalize it to [0, 1]
      const rawIntensity = 1 / (1 + 8 * t * t);
      const maxIntensity = 1; // At t = 0
      const minIntensity = 1 / (1 + 8); // At t = 1
      // Normalize intensity to reach 0 at the edge
      const intensity = (rawIntensity - minIntensity) / (maxIntensity - minIntensity);
      
      // Interpolate colors based on normalized intensity
      const r = lerp(stopR, startR, intensity);
      const g = lerp(stopG, startG, intensity);
      const b = lerp(stopB, startB, intensity);
      const a = lerp(stopA, startA, intensity);
      
      gradient.addColorStop(t, `rgba(${r}, ${g}, ${b}, ${a})`);
  }
  
  // Set the gradient as the fill style and draw a rectangle that covers the arc
  ctx.fillStyle = gradient;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  
  // Restore the context state
  ctx.restore();
}

function getSpawnRange(Type) {
  switch (Type) {
    case GreenCrate:
      return [100, 600];
    case OrangeCrate:
      return [600, 1200];
    case RedCrate:
      return [1200, 1800];
    case Fish:
      return [1200, 1700];
    case SmallFish:
      return [100, 800];
    case Shark:
      return [800, 1600];
    case Angler:
      return [1600, 2000];
    case BigFish:
      return [800, 1600];
  }
}





