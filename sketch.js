function preload() {
  // fishImg = loadImage('Assets/fish.png');
  greenCrate = loadImage('Assets/gamejam_crate_green.png');
  orangeCrate = loadImage('Assets/gamejam_crate_orange.png');
  redCrate = loadImage('Assets/gamejam_crate_red.png');
  scoobaSwimGif = loadImage('Assets/scooba_swim.gif');
  walkCycleGif = loadImage('Assets/walk_cycle.gif');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  noSmooth();
  panzoom = new PanZoom();
  scene = new Scene();
  gui = new GUI();
  player = new Player(0, 0);
  boat = new Boat(0, 0);
  panzoom.disableRightClickDropDown();
  keys = panzoom.keys;
  mouse = panzoom.mouse;
  scene.init();
}

function draw() {
  const DT = Math.min(1, deltaTime / 1000);
  
  panzoom.update(DT);
  scene.update(DT);
  gui.update(DT);
  
  scene.draw();
  gui.draw();
}