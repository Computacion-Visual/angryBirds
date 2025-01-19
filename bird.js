class Bird {
  constructor(x, y, r, type = "red", options = {}) {
    const birdTypes = {
      red: {
        lifetime: 180,
        density: 0.001,
        restitution: 0.5,
        friction: 0.4,
        mass: 2,
        color: "#FF0000",
        img: redBirdImg,
      },
      chuck: {
        lifetime: 150,
        density: 0.0008,
        restitution: 0.7,
        friction: 0.3,
        mass: 1.5,
        color: "#FFD700",
        img: chuckBirdImg,
      },
      bomb: {
        lifetime: 240,
        density: 0.0015,
        restitution: 0.3,
        friction: 0.5,
        mass: 3,
        color: "#000000",
        img: bombBirdImg,
      },
    };

    const birdProps = birdTypes[type] || birdTypes.red;

    options = {
      ...options,
      density: birdProps.density,
      restitution: birdProps.restitution,
      friction: birdProps.friction,
      collisionFilter: {
        category: 2,
      },
    };

    this.body = Bodies.circle(x, y, r, options);
    Body.setMass(this.body, birdProps.mass);

    this.r = r;
    this.type = type;
    this.birdProps = birdProps;
    this.img = birdProps.img;
    this.lifetime = birdProps.lifetime;
    this.maxLifetime = birdProps.lifetime;
    this.isDestroyed = false;
    this.isShot = false;
    this.hitIntensity = 0;
    this.fadeStart = 60;

    World.add(world, this.body);
  }

  show() {
    if (this.isDestroyed) return;

    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    imageMode(CENTER);

    if (this.isShot) {
      const opacity = (this.lifetime / this.maxLifetime) * 255;

      if (this.lifetime <= this.fadeStart) {
        this.img = smokeImg;
        const smokeOpacity = map(this.lifetime, 0, this.fadeStart, 0, 255);
        tint(255, smokeOpacity);
      } else {
        switch (this.type) {
          case "red":
            tint(255, opacity);
            break;
          case "chuck":
            if (this.hitIntensity > 5) {
              tint(255, 255, 0, random(opacity * 0.8, opacity));
            } else {
              tint(255, opacity);
            }
            break;
          case "bomb":
            if (this.hitIntensity > 5) {
              tint(40, 40, 40, random(opacity * 0.8, opacity));
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
    if (!this.isShot) {
      const currentVelocity = Math.sqrt(
        this.body.velocity.x ** 2 + this.body.velocity.y ** 2,
      );

      if (currentVelocity > 2) {
        this.isShot = true;
        this.hitIntensity = currentVelocity;

        switch (this.type) {
          case "chuck":
            Body.setVelocity(this.body, {
              x: this.body.velocity.x * 1.2,
              y: this.body.velocity.y * 1.2,
            });
            break;
          case "bomb":
            Body.setMass(this.body, this.body.mass * 1.5);
            break;
        }
      }
    }

    if (this.isShot) {
      switch (this.type) {
        case "chuck":
          this.lifetime -= 1.2;
          break;
        case "bomb":
          this.lifetime -= 0.8;
          break;
        default:
          this.lifetime--;
          break;
      }
    }

    const pos = this.body.position;
    const isOffScreen =
      pos.x < -100 ||
      pos.x > width + 100 ||
      pos.y < -100 ||
      pos.y > height + 100;

    if ((this.isShot && this.lifetime <= 0) || isOffScreen) {
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
