class Box {
  constructor(x, y, w, h, material = "wood", options = {}) {
    const materials = {
      wood: {
        lifetime: 180, // 3 seconds
        density: 0.001,
        restitution: 0.4,
        friction: 0.6,
        color: "#8B4513",
        img: woodImg,
      },
      ice: {
        lifetime: 120, // 2 seconds
        density: 0.0008,
        restitution: 0.7,
        friction: 0.2,
        color: "#ADD8E6",
        img: iceImg,
      },
      steel: {
        lifetime: 420, // 7 seconds
        density: 0.002,
        restitution: 0.2,
        friction: 0.8,
        color: "#708090",
        img: steelImg,
      },
    };

    const materialProps = materials[material] || materials.wood;
    options = {
      ...options,
      density: materialProps.density,
      restitution: materialProps.restitution,
      friction: materialProps.friction,
    };

    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    this.img = materialProps.img;
    this.material = material;
    this.materialProps = materialProps;
    this.lifetime = materialProps.lifetime;
    this.maxLifetime = materialProps.lifetime;
    this.isDestroyed = false;
    this.isHit = false;
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

    if (this.isHit) {
      const opacity = (this.lifetime / this.maxLifetime) * 255;
      if (this.lifetime <= this.fadeStart) {
        this.img = smokeImg;

        const smokeOpacity = map(this.lifetime, 0, this.fadeStart, 0, 255);
        tint(255, smokeOpacity);
      } else {
        switch (this.material) {
          case "ice":
            tint(255, (this.lifetime / this.maxLifetime) * 255);
            break;
          case "wood":
            if (this.lifetime < 60) {
              tint(
                map(this.lifetime, 0, 60, 100, 255),
                map(this.lifetime, 0, 60, 50, 255),
                map(this.lifetime, 0, 60, 0, 255),
              );
            }
            break;
          case "steel":
            if (this.hitIntensity > 5) {
              tint(255, 255, 255, random(200, 255));
            }
            break;
        }
      }
    }

    image(this.img, 0, 0, this.w, this.h);
    pop();
  }

  update() {
    const currentVelocity = Math.sqrt(
      this.body.velocity.x ** 2 + this.body.velocity.y ** 2,
    );

    if (!this.isHit && currentVelocity > 2) {
      this.isHit = true;
      this.hitIntensity = currentVelocity;

      switch (this.material) {
        case "ice":
          this.lifetime = Math.max(30, this.lifetime - currentVelocity * 10);
          break;
        case "steel":
          if (currentVelocity < 5) {
            this.isHit = false;
          }
          break;
      }
    }

    if (this.isHit) {
      switch (this.material) {
        case "ice":
          this.lifetime -= 2;
          break;
        case "steel":
          this.lifetime -= 0.5;
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
