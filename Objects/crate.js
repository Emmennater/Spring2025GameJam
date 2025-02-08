
class Crate extends CollisionObject {
  constructor(x, y) {
    super(x, y, 50, 50);
  }

  draw() {
    image(this.sprite, this.x, this.y, this.w, this.h);
  }
}

class GreenCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "green";
    this.sprite = greenCrate;
  }
}

class OrangeCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "orange";
    this.sprite = orangeCrate;
  }
}

class RedCrate extends Crate {
  constructor(x, y) {
    super(x, y);
    this.type = "red";
    this.sprite = redCrate;
  }
}