const { Engine, World, Bodies, Body, Constraint, MouseConstraint, Mouse } =
  Matter;

let engine,
  world,
  ground,
  bird,
  slingShot,
  boxes = [],
  mc,
  redImg,
  crateImg,
  grassImg;

function preload() {
  redBirdImg = loadImage("assets/img/redBird.png");
  chuckBirdImg = loadImage("assets/img/chuckBird.png");
  bombBirdImg = loadImage("assets/img/bombBird.png");
  woodImg = loadImage("assets/img/crate.png");
  steelImg = loadImage("assets/img/steel.png");
  iceImg = loadImage("assets/img/ice.png");
  grassImg = loadImage("assets/img/grass.jpg");
  minionPigImg = loadImage("assets/img/minionPig.png");
  kingPigImg = loadImage("assets/img/kingPig.png");
  corporalPigImg = loadImage("assets/img/corporalPig.png");
  slingShotImg = loadImage("assets/img/slingshot.png");
  smokeImg = loadImage("assets/img/smoke.png");
}

function setup() {
  const canvas = createCanvas(640, 480);

  engine = Engine.create();
  world = engine.world;

  const mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();

  mc = MouseConstraint.create(engine, {
    mouse: mouse,
    collisionFilter: {
      mask: 2,
    },
  });

  World.add(world, mc);

  ground = new Ground(width / 2, height - 10, width, 20, grassImg);
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 10; i++) {
      const box = new Box(400 + 50 * j, height - 40 * i, 40, 40, "wood");
      boxes.push(box);
    }
  }
  bird = new Bird(150, 350, 20, "red");
  slingShot = new SlingShot(bird, slingShotImg);
  pig = new Pig(300, 450, 20, "minion");
}

function draw() {
  background(0, 181, 226);
  frameRate(60);

  Engine.update(engine);
  slingShot.fly(mc);
  ground.show();
  for (let i = 0; i < 4 * 10; i++) {
    boxes[i].update();
    boxes[i].show();
  }
  slingShot.show();
  bird.show();
  pig.show();
  pig.update();
}

function keyPressed() {
  if (key === " ") {
    World.remove(world, bird.body);
    bird = new Bird(150, 350, 20, "red");
    slingShot.attach(bird);
  }

  if (key === "q") {
    World.remove(world, bird.body);
    bird = new Bird(150, 350, 20, "red");
    slingShot.attach(bird);
  }

  if (key === "w") {
    World.remove(world, bird.body);
    bird = new Bird(150, 350, 20, "chuck");
    slingShot.attach(bird);
  }

  if (key === "e") {
    World.remove(world, bird.body);
    bird = new Bird(150, 350, 20, "bomb");
    slingShot.attach(bird);
  }
}
