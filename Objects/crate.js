
class Crate extends CollisionObject {
  constructor(x, y) {
    super(x, y, 35, 35);
    this.t = random(0, 2 * Math.PI);
    this.period = random(0.5, 2);

    this.makeCollisionMesh(
      [this.w / 2, this.h / 2],
      [this.w / 2, -this.h / 2],
      [-this.w / 2, -this.h / 2],
      [-this.w / 2, this.h / 2]
    );
  }

  update(dt) {
    this.t += dt;
    
    // Sinusoidal vertical oscillation
    this.y += Math.sin(this.t * this.period) * 0.2;

    this.updateMesh(this.x, this.y, 0);
  }

  draw() {
    image(this.sprite, this.x, this.y);

    // Debug
    // this.drawMesh(window);
  }
}

class GreenCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "green";
    this.sprite = greenCrate;
  }

  destroy() {
    super.destroy();
    gui.addMoney(10);
  }
}

class OrangeCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "orange";
    this.sprite = orangeCrate;
  }

  destroy() {
    super.destroy();
    gui.addFood(10);
  }
}

class RedCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "red";
    this.sprite = redCrate;
  }

  destroy() {
    super.destroy();
    gui.addHealth(10);
  }
}

function getRandomCrate(init = false, type = null) {
  const types = [GreenCrate, OrangeCrate, RedCrate];
  const randomIndex = Math.floor(Math.random() * types.length);
  let x = random(-1200, 1200);
  let y = random(100, 1200);
  let closest = getNearestCrate(x, y);
  let i = 0;
  
  while (closest.distance < 200 && (!init && dist(player.x, player.y, x, y) > 1000)) {
    x = random(-1000, 1000);
    y = random(100, 800);
    closest = getNearestCrate(x, y);
    if (i++ > 40) { break; }
  }

  const CrateType = type ? type : types[randomIndex];
  return new CrateType(x, y);
}

function spawnRandomCrate() {
  const crate = getRandomCrate();
  scene.addCrate(crate);
}

function getNearestCrate(x, y) {
  let nearestCrate = null;
  let nearestDistance = Infinity;
  for (let i = 0; i < scene.crates.length; i++) {
    const crate = scene.crates[i];
    const distance = dist(x, y, crate.x, crate.y);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestCrate = crate;
    }
  }
  return { crate: nearestCrate, distance: nearestDistance };  
}