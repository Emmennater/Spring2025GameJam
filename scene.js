class Scene {
  constructor() {
    this.crates = [];
  }

  addCrate(crate) {
    this.crates.push(crate);
  }

  initCrates() {
    for (let i = 0; i < 10; i++)
      spawnRandomCrate(true, GreenCrate);
    for (let i = 0; i < 10; i++)
      spawnRandomCrate(true, OrangeCrate);
    for (let i = 0; i < 5; i++)
      spawnRandomCrate(true, RedCrate);
  }
  
  init() {
    boat.board();
    player.setInView();
    this.initCrates();
  }

  update(dt) {
    player.update(dt);
    boat.update(dt);

    for (let i = this.crates.length - 1; i >= 0; i--) {
      this.crates[i].update(dt);

      if (this.crates[i].destroyed) {
        spawnRandomCrate(false, this.crates[i].constructor);
        this.crates.splice(i, 1);
      }
    }
  }
  
  draw() {
    const focus = panzoom.unscaleCoordinate(player.x, player.y);
    const scl = panzoom.zoom;
    const WATER_Y = panzoom.yoff * scl + height / 2;
    const RADIAL_W = 250 * scl;
  
    // Draw the sky and background
    background(80, 120, 170);
    fill(80, 120, 170);
    noStroke();
    rect(0, 0, width, WATER_Y);
  
    // Draw game objects
    panzoom.begin();
    boat.draw();
    player.draw();
    for (let i = 0; i < this.crates.length; i++) {
      this.crates[i].draw();
    }
    panzoom.end();
  
    // Draw the ocean water
    const DARKNESS = constrain(-panzoom.yoff / 1500, 0, 0.8);
    fill(0, lerp(2, 0, DARKNESS), lerp(0, 10, DARKNESS), lerp(150, 255, DARKNESS));
    rect(0, WATER_Y, width, height - WATER_Y);
  
    // Get the canvas 2D context so we can set a blending mode
    let ctx = drawingContext;
    ctx.save();  
    // Change the composite operation so that the gradient blends with the water.
    // Try 'screen' (brightens), 'lighter' (adds light), or even 'overlay' to see what works best.
    ctx.globalCompositeOperation = "lighter"; 
  
    // Draw the light gradient if the player is low enough
    if (player.y > 150) {
      drawLightCircle(focus.x, focus.y, RADIAL_W, color(80, 100, 120), color(0));
    }
    // Restore to the default composite operation so other drawing isn’t affected.
    ctx.restore();
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








