class Boat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.s = 300;
    this.speed = 200;
    this.boarded = false;
  }
  
  canBoard() {
    const DIST_TO_BOAT = dist(player.x, player.y, this.x, this.y);
    
    return DIST_TO_BOAT < 100 && player.swimming;
  }

  dismount() {
    player.swimming = true;
    player.x -= 50;
    player.y += 50;
    scoobaSwimGif.play();
    this.boarded = false;
  }
  
  board() {
    this.updatePlayerPos();
    player.swimming = false;
    player.facing = 'right';
    scoobaSwimGif.pause();
    scoobaSwimGif.setFrame(1);
    this.boarded = true;
  }
  
  updatePlayerPos() {
    player.x = this.x - 50;
    player.y = this.y - player.w / 2 - 15;
  }
  
  controls(dt) {
    let targetSpeedX = 0;
    if (this.boarded) {
      if (keys.A) targetSpeedX -= this.speed;
      if (keys.D) targetSpeedX += this.speed;
    }
    this.vx = lerp(this.vx, targetSpeedX, 0.05);
  }
  
  update(dt) {
    this.controls(dt);
    
    this.x += this.vx * dt;
    this.y += Math.sin(frameCount / 40) * 0.05;

    if (this.boarded) {
      this.updatePlayerPos(); 
    }

    if (this.x > 1800) {
      this.x = 1800;
      this.vx = 0;
    }

    if (this.x < -1800) {
      this.x = -1800;
      this.vx = 0;
    }
  }
  
  draw() {
    fill(107, 85, 45);
    noStroke();
    arc(this.x, this.y - 20, this.s, this.s * 0.5, 0, PI);
  }
}