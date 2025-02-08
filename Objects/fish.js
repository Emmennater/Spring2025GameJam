
class Fish extends CollisionObject {
  constructor(x, y, size) {
    super(x, y, size, size);
  }

  draw() {
    image(fishImg, this.x, this.y, this.size, this.size);
  }
}