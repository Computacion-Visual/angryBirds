class Ground {
  constructor(x, y, w, h, img, options = { isStatic: true }) {
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.img = img;
    World.add(world, this.body);
  }
  show() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    imageMode(CENTER);
    image(this.img, 0, 0, this.w, this.h);
    pop();
  }
}
