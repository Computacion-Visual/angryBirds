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
  grassImg,
  pigs = [],
  playButton,
  homeButton,
  playButtonX, 
  playButtonY,
  homeButtonX,
  homeButtonY,
  gameStarted = false,
  aspectRatio,
  newHeight;

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
  playButton = loadImage("assets/img/play.png")
  homeButton = loadImage("assets/img/home-btn.png")
}

function setup() {
  const canvas = createCanvas(1000, 480);

  // Posiciones de los botones
  aspectRatio = playButton.width / playButton.height;
  newHeight = 300 / aspectRatio;

  playButtonX = width / 2 - 300 / 2;
  playButtonY = height / 2 - newHeight / 2;
  
  homeButtonX = 10;  // Esquina superior izquierda
  homeButtonY = 10;

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
  pigs.push(new Pig(350, 450, 20, "corporal"));
  pigs.push(new Pig(400, 450, 20, "king"));
}

function draw() {

  if (!gameStarted) {
    // Pantalla inicial
    background(0, 181, 226);
    ground.show();
    // Mostrar el botón "Jugar"
    image(playButton, playButtonX, playButtonY,300,newHeight);
  } else {
  background(0, 181, 226);
  frameRate(60);

  // Mostrar el botón "Volver"
  image(homeButton, homeButtonX, homeButtonY);

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
  
  if (checkVictory()) {
    showVictoryScreen();
  }
}
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

function checkVictory() {
  return pigs.every(pig => pig.isDestroyed);
}

function showVictoryScreen() {
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("¡Victoria!", width / 2, height / 2);
  pop();
  noLoop(); // Detiene el bucle de dibujo
}

// Detectar si el ratón ha hecho clic en el botón "Jugar"
function mousePressed() {
  if (!gameStarted) {
    // Verificar si el clic está sobre el botón "Jugar"
    if (mouseX > playButtonX && mouseX < playButtonX + 300 &&  // Ancho de la imagen redimensionada (300 px)
        mouseY > playButtonY && mouseY < playButtonY + playButton.height * (300 / playButton.width)) {  // Alto proporcional
      startGame();  // Iniciar el juego
    }
  } else {
    // Verificar si el clic está sobre el botón "Volver"
    if (mouseX > homeButtonX && mouseX < homeButtonX + 55 &&  // Ancho de homeButton (55 px)
      mouseY > homeButtonY && mouseY < homeButtonY + 55) {  // Alto de homeButton (55 px)
    goHome();  // Volver a la pantalla inicial
  }
  }
}

function startGame() {
  gameStarted = true; // Cambiar a la pantalla del juego
}

function goHome() {
  gameStarted = false; // Volver a la pantalla inicial
}
