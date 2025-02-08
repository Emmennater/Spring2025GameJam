
class CollisionObject extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.makeCollisionMesh();
  }

  // Points must be defined in a counterclockwise order
  makeCollisionMesh(...pointArrays) {
    const pointObjects = pointArrays.map((points) => {
      return { x: points[0], y: points[1] };
    })

    this.collisionMesh = new CollisionMesh(pointObjects);
  }

  drawMesh(ctx) {
    this.collisionMesh.draw(ctx, color(0, 0), color(255, 0, 0));
  }

  collides(other) {
    return this.collisionMesh.collides(other.collisionMesh);
  }

  containsPoint(x, y) {
    return this.collisionMesh.boundaryContainsPoint(x, y);
  }

  intersectsLine(x1, y1, x2, y2) {
    return this.collisionMesh.intersectsLine(x1, y1, x2, y2);
  }

  updateMesh(x, y, r) {
    if (x !== undefined) this.collisionMesh.setPosition(x, y);
    if (r !== undefined) this.collisionMesh.setRotation(r);
    this.collisionMesh.updateTransform();
  }
}
