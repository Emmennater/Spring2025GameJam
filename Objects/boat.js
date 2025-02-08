class Boat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.s = 300;
    this.speed = 100;
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
    this.boarded = false;
  }
  
  board() {
    this.updatePlayerPos();
    player.swimming = false;
    player.facing = 'right';
    this.boarded = true;
  }
  
  updatePlayerPos() {
    player.x = this.x - 50;
    player.y = this.y - player.w / 2 - 15;
  }
  
  controls(dt) {
    if (this.boarded) {
      this.vx = 0;
      if (keys.A) this.vx -= this.speed;
      if (keys.D) this.vx += this.speed;
    }
  }
  
  update(dt) {
    this.controls(dt);
    
    this.x += this.vx * dt;
    
    if (this.boarded) {
      this.updatePlayerPos(); 
    }
  }
  
  draw() {
    fill(107, 85, 45);
    noStroke();
    arc(this.x, this.y - 20, this.s, this.s * 0.5, 0, PI);
  }
}