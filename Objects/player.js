class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 36;
    this.h = 77;
    this.vx = 0;
    this.vy = 0;
    this.speed = 100;
    this.tilt = 0;
    this.swimming = true;
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
    
    const TILT_ANGLE = 0.2;
    let targetTilt = 0;
    if (keys.A && this.swimming) targetTilt -= TILT_ANGLE;
    if (keys.D && this.swimming) targetTilt += TILT_ANGLE;
    this.tilt = lerp(this.tilt, targetTilt, 0.2);
  }
  
  update(dt) {
    this.controls(dt);
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  
  draw() {
    fill(255);
    rectMode(CENTER);
    push();
    translate(this.x, this.y);
    rotate(this.tilt);
    rect(0, 0, this.w, this.h);
    pop();
  }
}