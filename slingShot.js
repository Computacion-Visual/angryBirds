class SlingShot {
  constructor(bird, img) {
    this.sling = Constraint.create({
      pointA: {
        x: bird.body.position.x,
        y: bird.body.position.y,
      },
      bodyB: bird.body,
      stiffness: 0.05,
      length: 5,
    });
    this.img = img;

    World.add(world, this.sling);
  }

  show() {
    if (this.sling.bodyB) {
      line(
        this.sling.pointA.x,
        this.sling.pointA.y + 20,
        this.sling.bodyB.position.x,
        this.sling.bodyB.position.y,
      );

      push();
      translate(this.sling.pointA.x - 20, this.sling.pointA.y);
      image(this.img, 0, 0, 40, 116);
      pop();
    }
  }

  fly(mc) {
    if (
      this.sling.bodyB &&
      mc.mouse.button == -1 &&
      this.sling.bodyB.position.x > this.sling.pointA.x + 20
    ) {
      this.sling.bodyB.collisionFilter.category = 1;
      this.sling.bodyB = null;
    }
  }
  attach(bird) {
    this.sling.bodyB = bird.body;
  }
}
