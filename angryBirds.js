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
  newHeight, 
  fondo,
  attempts=0,
  fuente;

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
  fondo = loadImage("assets/img/Fondo.jpg");
  fuente = loadFont("assets/Fonts/angrybirds-regular.ttf");
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
}

function draw() {

  if (!gameStarted) {
    // Pantalla inicial
    background(0, 181, 226);
    image(fondo, 0, 0,1000,480);
    ground.show();
    // Mostrar el botón "Jugar"
    image(playButton, playButtonX, playButtonY,300,newHeight);
    textFont(fuente);
    textSize(32);
    fill(0);  // Texto en color negro
    textAlign(CENTER, TOP);
  
    // Título
    textSize(48);
    text("Usa Q,W,E para cambiar de pájaro", width / 2, 50);
    text("Solo puedes hacer 3 lanzamientos", width / 2, 100);
  } else {
  background(0, 181, 226);
  image(fondo, 0, 0,1000,480);
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
  for (let i = 0; i < pigs.length; i++) {
    pigs[i].update();
    pigs[i].show();
  }
  slingShot.show();
  bird.show();
  if (checkVictory()) {
    showVictoryScreen();
  }
}
}

function keyPressed() {

  if (attempts < 3) {
    if (key === " ") {
      World.remove(world, bird.body);
      bird = new Bird(150, 350, 20, "red");
      slingShot.attach(bird);      
    }
  
    if (key === "q" || key === "Q") {
      World.remove(world, bird.body);
      bird = new Bird(150, 350, 20, "red");
      slingShot.attach(bird);
    }
  
    if (key === "w" || key === "W") {
      World.remove(world, bird.body);
      bird = new Bird(150, 350, 20, "chuck");
      slingShot.attach(bird);
    }
  
    if (key === "e" || key === "E") {
      World.remove(world, bird.body);
      bird = new Bird(150, 350, 20, "bomb");
      slingShot.attach(bird);
    }
  }

  }

function checkVictory() {
  return pigs.every(pig => pig.isDestroyed);
}

function showVictoryScreen() {
  push();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("¡Victoria!", width / 2, height / 4);
  pop();
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
  resetGame(); // Reiniciar el juego
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
      pigs.push(new Pig(x, yOffset, 20, "minion"));
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
      pigs.push(new Pig(x, yOffset, 20, "corporal"));
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
      pigs.push(new Pig(x, yOffset, 20, "king"));
    }
  }

  // Fila 7 (Punta) - 3 cajas
  yOffset -= 40;
  for (let i = 0; i < 3; i++) {
    boxes.push(new Box(baseX + (i+2) * 40, yOffset, 40, 40, "steel"));
  }
}

function resetGame() {
  // Limpiar las cajas y los cerdos del array
  boxes = []; // Esto vacía el array de boxes y cerdos
  pigs = [];
  // Limpiar todos los objetos del mundo de física
  World.clear(world); // Borra todos los cuerpos del mundo

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
  attempts = 0;
}
