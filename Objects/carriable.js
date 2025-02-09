
class Carriable extends CollisionObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.carrier = null;
  }

  carry() {
    this.carrier = player;
  }

  dropoff() {
    this.destroy();
  }

  drop() {
    const [x, y] = this.carrier.getHoldPos();
    this.x = x;
    this.y = y;
    this.carrier = null;
    this.updateMesh(this.x, this.y, 0);
  }
}
