function setup() {
  createCanvas(windowWidth, windowHeight);
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
  const DT = deltaTime / 1000;
  
  panzoom.update(DT);
  panzoom.trackPos(player.x, player.y);
  scene.update(DT);
  gui.update(DT);
  
  scene.draw();
  gui.draw();
}