
class World {
  constructor() {
    this.randOff = random(-100, 100);
    this.tileW = 512;
    this.tileH = 864;
    this.generateTilemaps();
    this.size = this.tileW * (this.tilemaps[0][0].length - 4) / 2;
  }

  generateTilemaps() {
    const sizex = 20;
    const sizey = 4;
    const layers = [];
    const biomes = Array(sizex);

    // Initialize
    for (let k = 0; k < 3; k++) {
      layers[k] = [];
      for (let j = 0; j < sizey; j++) {
        layers[k][j] = [];
        for (let i = 0; i < sizex; i++) {
          layers[k][j][i] = 0;
        }
      }
    }

    // Sky
    for (let i = 0; i < sizex; i++) {
      layers[0][0][i] = 4;
    }

    // Middle
    for (let i = 0; i < sizex; i++) {
      layers[0][1][i] = 2;
    }

    // Top water
    for (let i = 0; i < sizex; i++) {
      layers[1][1][i] = 5;
    }

    // Depths 1
    for (let i = 0; i < sizex; i++) {
      layers[0][2][i] = this.getRandomDepth();
    }

    // Depths 2
    for (let i = 0; i < sizex; i++) {
      layers[0][3][i] = this.getRandomDepth();
    }

    // Biomes
    for (let i = 0; i < sizex; i++) {
      const choices = [0, 1, 2];
      biomes[i] = choices[floor(random(choices.length))];
    }

    // Biomes
    for (let i = 0; i < sizex; i++) {
      const biome = biomes[i];

      switch (biome) {
        case 0:
          layers[2][1][i] = this.getRandomCoral();
          break;
        case 1:
          layers[2][1][i] = this.getRandomShipwreck();
          break;
        case 2:
          layers[2][1][i] = this.getRandomSpike();
          break;
      }

      switch (biome) {
        case 0:
          if (Math.random() < 0.5)
            layers[0][2][i] = 34;
          break;
        case 1:
          if (i < sizex - 1 && biomes[i + 1] === biome && layers[2][2][i] !== 35 && Math.random() < 0.5) {
            layers[0][2][i] = 36;
            layers[0][2][i + 1] = 35;
          }
      }
      
    }

    this.tilemaps = layers;
    this.biomes = biomes;
  }

  getRandomDepth() {
    const choices = [1, 3, 6, 6];
    return choices[floor(random(choices.length))];
  }

  getRandomCoral() {
    const choices = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    return choices[floor(random(choices.length))];
  }

  getRandomShipwreck() {
    const choices = [22, 23, 24, 25, 26, 27];
    return choices[floor(random(choices.length))];
  }

  getRandomSpike() {
    const choices = [28, 29, 30, 31, 32, 33];
    return choices[floor(random(choices.length))];
  }

  getTileImage(i) {
    switch (i) {
      case 0: return null;
      case 1: return bg.cave_depth;
      case 2: return bg.middle_depth;
      case 3: return bg.skull_depth;
      case 4: return bg.sky;
      case 5: return bg.water_surface;
      case 6: return bg.blank_depth;

      // Coral
      case 7: return bg.coral.back_fire_coral_1;
      case 8: return bg.coral.back_fire_coral_2;
      case 9: return bg.coral.back_fire_coral_3;
      case 10: return bg.coral.front_fire_coral_1;
      case 11: return bg.coral.front_fire_coral_2;
      case 12: return bg.coral.front_fire_coral_3;
      case 13: return bg.coral.back_fire_coral_1;
      case 14: return bg.coral.back_fire_coral_2;
      case 15: return bg.coral.back_fire_coral_3;
      case 16: return bg.coral.front_tube_coral_1;
      case 17: return bg.coral.front_tube_coral_2;
      case 18: return bg.coral.front_tube_coral_3;
      case 19: return bg.coral.back_tube_coral_1;
      case 20: return bg.coral.back_tube_coral_2;
      case 21: return bg.coral.back_tube_coral_3;

      // Shipwreck
      case 22: return bg.shipwreck.back_part_1;
      case 23: return bg.shipwreck.back_part_2;
      case 24: return bg.shipwreck.back_part_3;
      case 25: return bg.shipwreck.front_part_1;
      case 26: return bg.shipwreck.front_part_2;
      case 27: return bg.shipwreck.front_part_3;

      // Spike
      case 28: return bg.spike.back_spike_1;
      case 29: return bg.spike.back_spike_2;
      case 30: return bg.spike.back_spike_3;
      case 31: return bg.spike.front_spike_1;
      case 32: return bg.spike.front_spike_2;
      case 33: return bg.spike.front_spike_3;

      // Background
      case 34: return bg.coral_shelves;
      case 35: return bg.sunken_sub_right;
      case 36: return bg.sunken_sub_left;
    }
  }

  getBiomeAt(x) {
    const xoff = -this.tilemaps[0][0].length * this.tileW * 0.5;

    for (let i = 0; i < this.biomes.length; i++) {
      const biome = this.biomes[i];
      const biomeLeft = i * this.tileW + xoff;
      const biomeRight = i * this.tileW + this.tileW + xoff;

      if (x >= biomeLeft && x <= biomeRight) {
        return biome;
      }
    }
  }

  getRandomBiomeX(biomeIdxs) {
    // Pick random idx
    const biomeIdx = biomeIdxs[floor(random(biomeIdxs.length))];
    const xoff = -this.tilemaps[0][0].length * this.tileW * 0.5;
    let sliceIdx = 0;
    let its = 0;

    while (its++ < 50) {
      sliceIdx = floor(random(3, this.biomes.length - 3));

      if (this.biomes[sliceIdx] === biomeIdx) {
        break;
      }
    }
    
    const biomeLeft = sliceIdx * this.tileW + xoff;
    const biomeRight = sliceIdx * this.tileW + this.tileW + xoff;

    return random(biomeLeft, biomeRight);
  }

  drawTilemap(tilemap, level = 0) {
    const xoff = -tilemap[0].length * this.tileW * 0.5;
    const yoff = -this.tileH * 1.05;
 
    imageMode(CORNER);
    rectMode(CORNER);
    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
        const i = tilemap[y][x];
        const img = this.getTileImage(i);
        if (!img) continue;
        const x1 = x * (this.tileW - 1) + xoff;
        const y1 = y * (this.tileH - 1) + yoff;
        image(img, x1, y1);

        if (level == 0 && (x <= 1 || x >= tilemap[y].length - 2)) {
          fill(0, 0, 0, 100);
          rect(x1, y1, this.tileW, this.tileH);
        }
      }
    }
  }

  draw(level = 0) {
    this.drawTilemap(this.tilemaps[level], level);
  }
}
