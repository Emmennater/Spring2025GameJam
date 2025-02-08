class Scene {
  constructor() {
    
  }
  
  init() {
    boat.board();
    player.setInView();
  }

  update(dt) {
    player.update(dt);
    boat.update(dt);
  }
  
  draw() {
    const focus = panzoom.unscaleCoordinate(player.x, player.y);
    const scl = panzoom.zoom;
    const WATER_Y = panzoom.yoff * scl + height / 2;
    const RADIAL_W = 200 * scl;

    background(80, 120, 170);

    // Sky
    fill(80, 120, 170);
    noStroke();
    rect(0, 0, width, WATER_Y);

    panzoom.begin();
    boat.draw();
    player.draw();
    panzoom.end();

    // Ocean
    fill(0, 2, 10, 150);
    rect(0, WATER_Y, width, height - WATER_Y);

    // Darkness
    const DARKNESS = constrain(-panzoom.yoff / 1000, 0, 0.5);

    background(0, DARKNESS * 255);
  }
}

function drawLightCircle(x, y, size, r, g, b, a) {
  let ctx = drawingContext; // Get 2D canvas context
  let gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 2);
  
  // Define color stops
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0})`); // Fully transparent at center
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${a})`); // Opaque at edges

  ctx.fillStyle = gradient;
  
  // Draw square with the gradient
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
}






