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
  playButton = loadImage("assets/img/play.png");
  homeButton = loadImage("assets/img/home-btn.png");
  backgroundImg = loadImage("assets/img/background.jpg");
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
    
  // Crear la pirámide
  createPyramid();


  bird = new Bird(150, 350, 20, "red");
  slingShot = new SlingShot(bird, slingShotImg);
  pig = new Pig(700, 450, 20, "minion");
  pigs.push(pig);

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
    image(backgroundImg, 0, 0, width, height); // Mostrar fondo
    frameRate(60);

  // Mostrar el botón "Volver"
  image(homeButton, homeButtonX, homeButtonY);

  Engine.update(engine);
  slingShot.fly(mc);
  ground.show();
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].update();
    boxes[i].show();
  }
  slingShot.show();
  bird.show();
  /*
  if (checkVictory()) {
    showVictoryScreen();
  }*/
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
    if (
      mouseX > playButtonX &&
      mouseX < playButtonX + 300 &&
      mouseY > playButtonY &&
      mouseY < playButtonY + playButton.height * (300 / playButton.width)
    ) {
      startGame(); // Iniciar el juego
    }
  } else {
    // Verificar si el clic está sobre el botón "Volver"
    if (
      mouseX > homeButtonX &&
      mouseX < homeButtonX + 55 &&
      mouseY > homeButtonY &&
      mouseY < homeButtonY + 55
    ) {
      goHome(); // Volver a la pantalla inicial
      return;
    }

    // Restringir interacciones al slingshot
    const distToBird = dist(mouseX, mouseY, bird.body.position.x, bird.body.position.y);
    if (distToBird > 50) {
      return; // Ignorar clics fuera del rango del slingshot
    }

    // Ignorar clics en pigs y cajas
    for (const pig of pigs) {
      const pigPos = pig.body.position;
      const pigSize = 50; // Suponiendo un tamaño aproximado
      if (
        mouseX > pigPos.x - pigSize &&
        mouseX < pigPos.x + pigSize &&
        mouseY > pigPos.y - pigSize &&
        mouseY < pigPos.y + pigSize
      ) {
        return; // Ignorar clics sobre un pig
      }
    }

    for (const box of boxes) {
      const boxPos = box.body.position;
      const boxWidth = box.w;
      const boxHeight = box.h;
      if (
        mouseX > boxPos.x - boxWidth / 2 &&
        mouseX < boxPos.x + boxWidth / 2 &&
        mouseY > boxPos.y - boxHeight / 2 &&
        mouseY < boxPos.y + boxHeight / 2
      ) {
        return; // Ignorar clics sobre una caja
      }
    }
  }
}



function startGame() {
  gameStarted = true; // Cambiar a la pantalla del juego
}

function goHome() {
  gameStarted = false; // Volver a la pantalla inicial
}


function createPyramid() {
  const baseX = 500; // La X inicial de la base
  const baseY = height - 40; // La Y en la base (en la parte inferior de la pantalla)

  // Fila 1 (Base) - 7 cajas
  for (let i = 0; i < 7; i++) {
    boxes.push(new Box(baseX + i * 40, baseY, 40, 40, "wood"));
  }

  // Fila 2 - Caja, Cerdo, Caja, Cerdo, Caja, Cerdo, Caja
  let yOffset = baseY - 40; // Desplazamiento en Y para la siguiente fila
  for (let i = 0; i < 7; i++) {
    const x = baseX + i * 40;
    if (i % 2 === 0) {
      boxes.push(new Box(x, yOffset, 40, 40, "ice"));
    } else {
      boxes.push(new Pig(x, yOffset, 20, "minion"));
    }
  }

  // Fila 3 - 7 cajas
  yOffset -= 40;
  for (let i = 0; i < 7; i++) {
    boxes.push(new Box(baseX + i * 40, yOffset, 40, 40, "wood"));
  }

  // Fila 4 - Caja, Cerdo, Caja, Cerdo, Caja
  yOffset -= 40;
  for (let i = 0; i < 5; i++) {
    const x = baseX + (i+1) * 40;
    if (i % 2 === 0) {
      boxes.push(new Box(x, yOffset, 40, 40, "ice"));
    } else {
      boxes.push(new Pig(x, yOffset, 20, "corporal"));
    }
  }

  // Fila 5 - 5 cajas
  yOffset -= 40;
  for (let i = 0; i < 5; i++) {
    boxes.push(new Box(baseX + (i+1) * 40, yOffset, 40, 40, "wood"));
  }

  // Fila 6 - Caja, Cerdo, Caja
  yOffset -= 40;
  for (let i = 0; i < 3; i++) {
    const x = baseX + (i+2) * 40;
    if (i % 2 === 0) {
      boxes.push(new Box(x, yOffset, 40, 40, "steel"));
    } else {
      boxes.push(new Pig(x, yOffset, 20, "king"));
    }
  }

  // Fila 7 (Punta) - 3 cajas
  yOffset -= 40;
  for (let i = 0; i < 3; i++) {
    boxes.push(new Box(baseX + (i+2) * 40, yOffset, 40, 40, "steel"));
  }
}
