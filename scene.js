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
    const ASPECT = titlescreen.width / titlescreen.height;
    const w = height * ASPECT;
    const x = (width - w) / 2;
    image(titlescreen, x, 0, w, height);
    fill(255, 100 + (sin(frameCount * 0.1) + 1) / 2 * 155);
    textAlign(CENTER);
    textSize(50);
    text("Press Space to Start", width / 2, height / 2);
  }
}

class GameScene extends Scene {
  constructor() {
    super();
    this.crates = [];
    this.fish = [];
    this.world = new World();
    this.level = new Level();
  }

  reset() {
    player.reset();
    this.crates = [];
    this.fish = [];
    gui.reset();
    this.level.reset();
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

    // Get the canvas 2D context so we can set a blending mode
    let ctx = drawingContext;
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
  }
}

class GameOverScene extends Scene {
  constructor() {
    super();
  }

  update(dt) {
    if (keys.SPACE) {
      scenes.cutSceneTo(new TitleScene());
    }
  }

  draw() {
    background(0);
    const ASPECT = gameoverGif.width / gameoverGif.height;
    const w = height * ASPECT;
    const x = (width - w) / 2;
    image(gameoverGif, x, 0, w, height);
    
    fill(255, 100 + (sin(frameCount * 0.1) + 1) / 2 * 155);
    textAlign(CENTER);
    textSize(30);
    text("Press Space to Continue", width / 2, height * 0.75);
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





