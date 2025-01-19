class Pig {
  constructor(x, y, r, type = "minion", options = {}) {
    const pigTypes = {
      minion: {
        lifetime: 120,
        density: 0.001,
        restitution: 0.5,
        friction: 0.4,
        mass: 2,
        color: "#90EE90",
        img: minionPigImg,
      },
      corporal: {
        lifetime: 240,
        density: 0.0015,
        restitution: 0.4,
        friction: 0.5,
        mass: 3,
        color: "#228B22",
        img: corporalPigImg,
      },
      king: {
        lifetime: 360,
        density: 0.002,
        restitution: 0.3,
        friction: 0.6,
        mass: 4,
        color: "#006400",
        img: kingPigImg,
      },
    };

    const pigProps = pigTypes[type] || pigTypes.minion;

    options = {
      density: pigProps.density,
      restitution: pigProps.restitution,
      friction: pigProps.friction,
      collisionFilter: {
        category: 2,
      },
    };

    this.body = Bodies.circle(x, y, r, options);
    Body.setMass(this.body, pigProps.mass);

    this.r = r;
    this.type = type;
    this.pigProps = pigProps;
    this.img = pigProps.img;
    this.lifetime = pigProps.lifetime;
    this.maxLifetime = pigProps.lifetime;
    this.isDestroyed = false;
    this.isHit = false;
    this.hitIntensity = 0;
    this.fadeStart = 60;

    World.add(world, this.body);
  }

  show() {

    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    imageMode(CENTER);

    if (this.isHit) {
      const opacity = (this.lifetime / this.maxLifetime) * 255;

      if (this.lifetime <= this.fadeStart) {
        this.img = smokeImg;
        const smokeOpacity = map(this.lifetime, 0, this.fadeStart, 0, 255);
        tint(255, smokeOpacity);
      } else {
        switch (this.type) {
          case "minion":
            tint(255, opacity);
            break;
          case "corporal":
            if (this.hitIntensity > 5) {
              tint(100, 255, 100, opacity);
            } else {
              tint(255, opacity);
            }
            break;
          case "king":
            if (this.hitIntensity > 5) {
              tint(255, 215, 0, random(opacity * 0.8, opacity));
            } else {
              tint(255, opacity);
            }
            break;
        }
      }
    }

    image(this.img, 0, 0, 2 * this.r, 2 * this.r);
    pop();
  }

  update() {
    const currentVelocity = Math.sqrt(
      this.body.velocity.x ** 2 + this.body.velocity.y ** 2,
    );

    if (!this.isHit && currentVelocity > 2) {
      this.isHit = true;
      this.hitIntensity = currentVelocity;

      switch (this.type) {
        case "minion":
          this.lifetime = Math.max(30, this.lifetime - currentVelocity * 8);
          break;
        case "corporal":
          this.lifetime = Math.max(30, this.lifetime - currentVelocity * 5);
          break;
        case "king":
          if (currentVelocity < 4) {
            this.isHit = false;
          } else {
            this.lifetime = Math.max(30, this.lifetime - currentVelocity * 3);
          }
          break;
      }
    }

    if (this.isHit) {
      switch (this.type) {
        case "minion":
          this.lifetime -= 1.5;
          break;
        case "corporal":
          this.lifetime -= 1;
          break;
        case "king":
          this.lifetime -= 0.5;
          break;
      }
    }

    const pos = this.body.position;
    const isOffScreen =
      pos.x < -100 ||
      pos.x > width + 100 ||
      pos.y < -100 ||
      pos.y > height + 100;

    if ((this.isHit && this.lifetime <= 0) || isOffScreen) {
      this.remove();
    }
  }

  remove() {
    if (!this.isDestroyed) {
      World.remove(world, this.body);
      this.isDestroyed = true;
    }
  }
}
