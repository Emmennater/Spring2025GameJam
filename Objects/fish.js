
class Fish extends CollisionObject {
  constructor(x, y, w = 210, h = 106) {
    super(x, y, w, h);
    this.sprite = monsterFish1Gif;
    this.angle = 0;
    this.targetAngle = 0;
    this.speed = 100;
    this.vel = 0;
    this.vx = 0;
    this.vy = 0;
    this.flipped = false;
    this.toff = random(-100, 100);
    this.damage = 15;

    this.makeCollisionMesh(
      [this.w / 2, this.h / 2],
      [this.w / 2, -this.h / 2],
      [-this.w / 2, -this.h / 2],
      [-this.w / 2, this.h / 2]
    );
  }

  followPlayer() {
    this.targetAngle = atan2(player.y - this.y, player.x - this.x);
    this.vel = this.speed;
  }

  wander() {
    const [ylow, yhigh] = getSpawnRange(this.constructor);

    if (this.y < ylow) {
      this.targetAngle = PI / 2;
      this.vel = this.speed / 2;
    } else if (this.y > yhigh) {
      this.targetAngle = -PI / 2;
      this.vel = this.speed / 2;
    } else {
      const vx = (noise(frameCount / 100 + this.toff) - 0.5) * 100;
      this.vel = Math.abs(vx);
      this.targetAngle = vx > 0 ? 0 : PI;
    }
  }

  update(dt) {
    const distToPlayer = dist(this.x, this.y, player.x, player.y);

    if (distToPlayer < 500 && distToPlayer > 50 && player.swimming) {
      this.followPlayer();
    } else {
      this.wander();
    }
    
    this.angle = lerpAngle(this.angle, this.targetAngle, 0.1);
    this.vx = cos(this.angle) * this.vel;
    this.vy = sin(this.angle) * this.vel;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vel = lerp(this.vel, 0, 0.05);

    this.flipped = this.vx > 0;

    this.updateMesh(this.x, this.y, this.angle, 1);
  }

  draw() {
    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    if (this.flipped) {
      scale(-1, 1);
      rotate(-this.angle);
    } else {
      rotate(this.angle + PI);
    }
    image(this.sprite, 0, 0);
    pop();

    // Debug collision mesh
    // this.drawMesh(window);
  }
}

class Shark extends Fish {
  constructor(x, y) {
    super(x, y, 100, 50);
    this.speed = 50;
    this.sprite = sharkGif;
    this.damage = 10;
  }
}

class Angler extends Fish {
  constructor(x, y) {
    super(x, y, 180, 180);
    this.speed = 50;
    this.sprite = bigFish1Gif;
    this.damage = 20;
  }
}

class SmallFish extends Carriable {
  constructor(x, y) {
    super(x, y);
    this.sprite = Math.random() < 0.5 ? smallFish1Gif : smallFish2Gif;
    this.angle = 0;
    this.speed = 100;
    this.vel = 0;
    this.vx = 0;
    this.vy = 0;
    this.flipSprite = false;
    this.flipped = false;
    this.toff = random(-100, 100);
    this.weight = 25;
    this.food = 30;
  }

  destroy() {
    super.destroy();
    gui.addFood(this.food);
  }

  wander() {
    const [ylow, yhigh] = getSpawnRange(this.constructor);

    if (this.y < ylow) {
      this.angle = PI / 2;
      this.vel = 50;
    } else if (this.y > yhigh) {
      this.angle = -PI / 2;
      this.vel = 50;
    } else {
      const vx = (noise(frameCount / 100 + this.toff) - 0.5) * 100;
      this.vel = Math.abs(vx);
      this.angle = vx > 0 ? 0 : PI;
    }
  }

  update(dt) {
    this.wander();
    
    this.vx = cos(this.angle) * this.vel;
    this.vy = sin(this.angle) * this.vel;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vel = lerp(this.vel, 0, 0.05);

    this.flipped = this.vx > 0;

    this.updateMesh(this.x, this.y, this.angle, 1);
  }

  draw() {
    let x = this.x;
    let y = this.y;

    if (this.carrier) {
      x = this.carrier.x;
      y = this.carrier.y;
    }

    imageMode(CENTER);
    push();
    translate(x, y);
    if (this.flipped) {
      scale(-1, 1);
      rotate(-this.angle);
    } else {
      rotate(this.angle + PI);
    }
    image(this.sprite, 0, 0);
    pop();

    // Debug collision mesh
    // this.drawMesh(window);
  }
}

class BigFish extends SmallFish {
  constructor(x, y) {
    super(x, y);
    this.sprite = bigFoodGif;
    this.weight = 75;
    this.food = 60;
  }
}

function getRandomFish(init = false, type = null) {
  const types = [Fish, SmallFish, Shark, BigFish];
  const randomIndex = Math.floor(Math.random() * types.length);
  const FishType = type ? type : types[randomIndex];
  const [ylow, yhigh] = getSpawnRange(FishType);
  let x = random(-scene.world.size, scene.world.size);
  let y = random(ylow, yhigh);
  let closest = getNearestFish(x, y);
  let i = 0;
  
  while (closest.distance < 200 && (!init && dist(player.x, player.y, x, y) > 3000)) {
    x = random(-scene.world.size, scene.world.size);
    y = random(ylow, yhigh);
    closest = getNearestFish(x, y);
    if (i++ > 40) { break; }
  }
  
  return new FishType(x, y);
}

function spawnRandomFish(init = false, type = null) {
  const fish = getRandomFish(init, type);
  scene.addFish(fish);
}

function getNearestFish(x, y) {
  let nearestFish = null;
  let nearestDistance = Infinity;
  for (let i = 0; i < scene.fish.length; i++) {
    const fish = scene.fish[i];
    const distance = dist(x, y, fish.x, fish.y);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestFish = fish;
    }
  }
  return { fish: nearestFish, distance: nearestDistance };  
}
