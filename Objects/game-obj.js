
class GameObject {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.destroyed = false;
  }

  destroy() {
    this.destroyed = true;
  }
}
