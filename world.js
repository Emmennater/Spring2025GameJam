
class World {
  constructor() {
    this.tilemaps = this.generateTilemaps();

    this.tileW = 512;
    this.tileH = 864;
    this.size = this.tileW * (this.tilemaps[0][0].length - 4) / 2;
  }

  generateTilemaps() {
    const sizex = 16;
    const sizey = 4;
    const layers = [];

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

    // Coral
    for (let i = 0; i < sizex; i++) {
      layers[2][1][i] = this.getRandomCoral();
    }

    return layers;
  }

  getRandomDepth() {
    const choices = [1, 3, 6, 6];
    return choices[floor(random(choices.length))];
  }

  getRandomCoral() {
    const choices = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
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
    }
  }

  drawTilemap(tilemap) {
    const xoff = (width - (tilemap[0].length + 3) * this.tileW) / 2;
    const yoff = -this.tileH * 1.05;

    imageMode(CORNER);
    for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
        const i = tilemap[y][x];
        const img = this.getTileImage(i);
        if (!img) continue;
        image(img, x * (this.tileW - 1) + xoff, y * (this.tileH - 1) + yoff);
      }
    }
  }

  draw(level = 0) {
    this.drawTilemap(this.tilemaps[level]);
  }
}
