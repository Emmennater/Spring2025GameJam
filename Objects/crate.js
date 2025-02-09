
class Crate extends Carriable {
  constructor(x, y) {
    super(x, y, 35, 35);
    this.t = random(0, 2 * Math.PI);
    this.period = random(0.5, 2);
    this.carrier = null;
    this.weight = 100;

    this.makeCollisionMesh(
      [this.w / 2, this.h / 2],
      [this.w / 2, -this.h / 2],
      [-this.w / 2, -this.h / 2],
      [-this.w / 2, this.h / 2]
    );
  }

  getRandomLoot(probabilities, minItems, maxItems) {
    const itemCount = Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;
    let loot = { coin: 0, food: 0 };
    
    for (let i = 0; i < itemCount; i++) {
      const roll = Math.random();
      if (roll < probabilities.coin) {
        loot.coin += 1;
      } else if (roll < probabilities.coin + probabilities.food) {
        loot.food += 1;
      } // Otherwise, it's trash (nothing is added)
    }

    return loot;
  }

  update(dt) {
    this.t += dt;
    
    // Sinusoidal vertical oscillation
    this.y += Math.sin(this.t * this.period) * 0.2;

    this.updateMesh(this.x, this.y, 0);
  }

  draw() {
    imageMode(CENTER);
    
    if (this.carrier) {
      const [x, y] = this.carrier.getHoldPos();
      image(this.sprite, x, y);
    } else {
      image(this.sprite, this.x, this.y);
    }

    // Debug
    // this.drawMesh(window);
  }
}

class GreenCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "green";
    this.sprite = greenCrate;
    this.weight = 25;
  }

  destroy() {
    super.destroy();
    const loot = this.getRandomLoot({ coin: 0.3, food: 0.5, trash: 0.2 }, 1, 2);
    gui.addMoney(loot.coin * 10);
    gui.addFood(loot.food * 10);
  }
}

class OrangeCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "orange";
    this.sprite = orangeCrate;
    this.weight = 30;
  }

  destroy() {
    super.destroy();
    const loot = this.getRandomLoot({ coin: 0.4, food: 0.35, trash: 0.25 }, 2, 3);
    gui.addMoney(loot.coin * 10);
    gui.addFood(loot.food * 10);
  }
}

class RedCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "red";
    this.sprite = redCrate;
    this.weight = 75;
  }

  destroy() {
    super.destroy();
    const loot = this.getRandomLoot({ coin: 0.5, food: 0.2, trash: 0.1 }, 4, 6);
    gui.addMoney(loot.coin * 10);
    gui.addFood(loot.food * 10);
  }
}

function getRandomCrate(init = false, type = null) {
  const types = [GreenCrate, OrangeCrate, RedCrate];
  const randomIndex = Math.floor(Math.random() * types.length);
  const CrateType = type ? type : types[randomIndex];
  const [ylow, yhigh] = getSpawnRange(CrateType);

  let x = scene.world.getRandomBiomeX(getSpawnBiome(CrateType));
  // let x = random(-scene.world.size, scene.world.size);
  let y = random(ylow, yhigh);
  let closest = getNearestCrate(x, y);
  let i = 0;
  
  while (closest.distance < 100 && (!init && dist(player.x, player.y, x, y) > 3000)) {
    x = random(-scene.world.size, scene.world.size);
    y = random(ylow, yhigh);
    closest = getNearestCrate(x, y);
    if (i++ > 40) { break; }
  }

  return new CrateType(x, y);
}

function spawnRandomCrate(init = false, type = null) {
  const crate = getRandomCrate(init, type);
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
