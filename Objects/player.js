class Player extends CollisionObject {
  constructor(x, y) {
    super(x, y, 77, 36);
    this.vx = 0;
    this.vy = 0;
    this.speed = 100;
    this.tilt = 0;
    this.swimming = true;
    this.facing = 'left';
    
    // Clockwise
    this.makeCollisionMesh(
      [this.w / 2, this.h / 2],
      [this.w / 2, -this.h / 2],
      [-this.w / 2, -this.h / 2],
      [-this.w / 2, this.h / 2]
    );
  }
  
  setInView() {
    panzoom.setInView(this.x, this.y);
  }

  controls(dt) {
    const CAN_SWIM_UP = this.y > -5;
    
    this.vy = 0;
    this.vx = 0;
    
    if (this.swimming) {
      if (keys.W && CAN_SWIM_UP) this.vy -= this.speed;
      if (keys.S) this.vy += this.speed;
      if (keys.A) this.vx -= this.speed;
      if (keys.D) this.vx += this.speed;
    }
    
    const TILT_ANGLE = PI / 4;
    let targetTilt = 0;
    if (keys.S) targetTilt -= TILT_ANGLE;
    if (keys.W) targetTilt += TILT_ANGLE;
    this.tilt = lerp(this.tilt, targetTilt, 0.2);

    if (this.vx < 0) this.facing = 'left';
    if (this.vx > 0) this.facing = 'right';

    if (!this.swimming) {
      this.tilt = HALF_PI;
    }
  }
  
  update(dt) {
    this.controls(dt);
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.updateMesh(this.x, this.y, this.tilt);
  }
  
  draw() {
    const FLIP = this.facing === 'left' ? 1 : -1;

    fill(255);
    rectMode(CENTER);
    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    scale(FLIP, 1);
    rotate(this.tilt);
    // rect(0, 0, this.w, this.h);
    image(scoobaSwimGif, 0, 0, this.w, this.h);
    pop();

    // Debug collision mesh
    // this.drawMesh(window);
  }
}