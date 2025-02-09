class Player extends CollisionObject {
  constructor(x, y) {
    super(x, y, 77, 36);
    this.vx = 0;
    this.vy = 0;
    this.speed = 100;
    this.maxSpeed = 300;
    this.normalSpeed = 100;
    this.tilt = 0;
    this.swimming = true;
    this.facing = 'left';
    this.carrying = null;
    this.canPickup = null;
    this.canPickupMessage = false;
    this.speedUpPause = false;
    this.damageTime = 1;
    
    // Clockwise
    this.makeCollisionMesh(
      [this.w / 2, this.h / 2],
      [this.w / 2, -this.h / 2],
      [-this.w / 2, -this.h / 2],
      [-this.w / 2, this.h / 2]
    );
  }
  
  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.vx = 0;
    this.vy = 0;
    this.speed = 100;
    this.maxSpeed = 300;
    this.normalSpeed = 100;
    this.tilt = 0;
    this.swimming = true;
    this.facing = 'left';
    this.carrying = null;
    this.canPickup = null;
    this.canPickupMessage = false;
    this.speedUpPause = false;
    this.damageTime = 1;
  }

  takeDamage(amount) {
    if (this.damageTime > 0) return;
    this.damageTime = 0.5;
    gui.addHealth(-amount);
  }

  getSpeedMult() {
    let mult = 1;

    if (this.carrying) mult /= (this.carrying.weight / 200 + 1);
    if (gui.resources.food <= 0) mult /= 1.2;

    return mult;
  }

  speedUp() {
    if (gui.resources.food <= 0) return;
    if (this.speedUpPause) return;
    this.speed += 50;
    gui.addFood(-1);

    setTimeout(() => {
      this.speedUpPause = false;
    }, 200);
  }

  setInView() {
    panzoom.setInView(this.x, this.y - height / 8);
  }

  pickups() {
    this.canPickupMessage = false;
    let obj = null, dis = Infinity;
    this.canPickup = null;

    const { crate, distance } = getNearestCrate(this.x, this.y);
    const { fish, distance: fishDistance } = getNearestFish(this.x, this.y);

    if (fishDistance < distance && fish instanceof Carriable) { obj = fish; dis = fishDistance; }
    else { obj = crate; dis = distance; }

    if (dis > 60 || obj == this.carrying) return;

    if (this.carrying) {
      this.canPickupMessage = "Already carrying something";
      return;
    }

    this.canPickupMessage = "Press E to pick up";

    this.canPickup = obj;
  }

  dropoff() {
    if (this.carrying) {
      this.carrying.dropoff();
      this.carrying = null;
    }
  }

  drop() {
    if (this.carrying) {
      this.carrying.drop();
      this.carrying = null;
    }
  }

  controls(dt) {
    const CAN_SWIM_UP = this.y > 40;
    
    this.vy = 0;
    this.vx = 0;
    
    this.speed = lerp(this.speed, this.normalSpeed, 0.05);

    if (this.swimming) {
      if (keys.W && CAN_SWIM_UP) this.vy -= this.speed;
      if (keys.S) this.vy += this.speed;
      if (keys.A) this.vx -= this.speed;
      if (keys.D) this.vx += this.speed;
    }
    
    const TILT_ANGLE = abs(this.vx) < 0.1 ? PI / 2 : PI / 4;
    let targetTilt = 0;
    if (keys.S) targetTilt -= TILT_ANGLE;
    if (keys.W) targetTilt += TILT_ANGLE;
    this.tilt = lerp(this.tilt, targetTilt, 0.1);

    if (this.vx < 0) this.facing = 'left';
    if (this.vx > 0) this.facing = 'right';

    if (!this.swimming) {
      walkCycleGif.pause();
      walkCycleGif.setFrame(6);
    }

    if (keys.W || keys.S || keys.A || keys.D) {
      const DELAY = 10000 / Math.hypot(this.vx, this.vy);
      scoobaSwimGif.delay(DELAY);
    } else {
      scoobaSwimGif.delay(200);
    }
  }

  updateCollisions(dt) {
    if (this.damageTime <= 0) {
      for (let fish of scene.fish) {
        if (fish.collides(this)) {
          this.takeDamage(fish.damage);
          break;
        }
      }
    }

    this.damageTime -= dt;
  }

  update(dt) {
    this.controls(dt);
    this.pickups();
    
    const speedMult = this.getSpeedMult();
    this.x += this.vx * speedMult * dt;
    this.y += this.vy * speedMult * dt;

    if (this.x > scene.world.size) {
      this.x = scene.world.size;
      this.vx = 0;
    }

    if (this.x < -scene.world.size) {
      this.x = -scene.world.size;
      this.vx = 0;
    }

    if (this.y > 2200) {
      this.y = 2200;
      this.vy = 0;
    }

    if (this.swimming) {
      panzoom.trackZoom(2);
      panzoom.trackPos(this.x, this.y);
    } else {
      panzoom.trackZoom(1);
      panzoom.trackPos(this.x, this.y - height / 8);
    }

    if (this.swimming) this.y = Math.max(0, this.y);

    this.updateCollisions(dt);

    const FLIP = this.facing === 'left' ? 1 : -1;
    this.updateMesh(this.x, this.y, this.tilt * FLIP);
  }
  
  draw() {
    const FLIP = this.facing === 'left' ? 1 : -1;

    fill(255);
    rectMode(CENTER);
    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    scale(FLIP, 1);
    // rect(0, 0, this.w, this.h);
    
    if (this.swimming) {
      rotate(this.tilt);
      image(scoobaSwimGif, 0, 0);
    } else {
      image(walkCycleGif, 0, 0);
    }

    pop();

    // Debug collision mesh
    // this.drawMesh(window);
  }
}