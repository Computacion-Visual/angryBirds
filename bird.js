class Bird {
  constructor(x, y, r, mass, img) {
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.5,
      collisionFilter: {
        category: 2,
      },
    });
    this.img = img;
    Body.setMass(this.body, mass);
    World.add(world, this.body);
  }

  show() {
    /*ellipse(this.body.position.x,
            this.body.position.y,
            2*this.body.circleRadius,
            2*this.body.circleRadius
        );*/
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    imageMode(CENTER);
    image(
      this.img,
      0,
      0,
      2 * this.body.circleRadius,
      2 * this.body.circleRadius,
    );
    pop();
  }
}
