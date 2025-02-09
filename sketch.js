function preload() {
  greenCrate = loadImage('Assets/gamejam_crate_green.png');
  orangeCrate = loadImage('Assets/gamejam_crate_orange.png');
  redCrate = loadImage('Assets/gamejam_crate_red.png');
  scoobaSwimGif = loadImage('Assets/scooba_swim.gif');
  walkCycleGif = loadImage('Assets/walk_cycle.gif');
  boatImg = loadImage('Assets/boat.png');
  
  // Fish
  monsterFish1Gif = loadImage('Assets/monsterfish1.gif');
  sharkGif = loadImage('Assets/shark.gif');
  smallFish1Gif = loadImage('Assets/food1.gif');
  smallFish2Gif = loadImage('Assets/food2.gif');
  bigFish1Gif = loadImage('Assets/bigfish.gif');
  bigFoodGif = loadImage('Assets/BigFood.gif');

  bg = {};
  bg.blank_depth = loadImage('Assets/Background/blank_depth.png');
  bg.cave_depth = loadImage('Assets/Background/cave_depth.png');
  bg.middle_depth = loadImage('Assets/Background/middle_depth.png');
  bg.skull_depth = loadImage('Assets/Background/skull_depth.png');
  bg.sky = loadImage('Assets/Background/sky.png');
  bg.water_surface = loadImage('Assets/Background/water_surface.png');

  // Coral
  bg.coral = {};
  bg.coral.back_fire_coral_1 = loadImage('Assets/Background/Coral/back_fire_coral_1.png');
  bg.coral.back_fire_coral_2 = loadImage('Assets/Background/Coral/back_fire_coral_2.png');
  bg.coral.back_fire_coral_3 = loadImage('Assets/Background/Coral/back_fire_coral_3.png');
  bg.coral.front_fire_coral_1 = loadImage('Assets/Background/Coral/front_fire_coral_1.png');
  bg.coral.front_fire_coral_2 = loadImage('Assets/Background/Coral/front_fire_coral_2.png');
  bg.coral.front_fire_coral_3 = loadImage('Assets/Background/Coral/front_fire_coral_3.png');
  bg.coral.back_tube_coral_1 = loadImage('Assets/Background/Coral/back_tube_coral_1.png');
  bg.coral.back_tube_coral_2 = loadImage('Assets/Background/Coral/back_tube_coral_2.png');
  bg.coral.back_tube_coral_3 = loadImage('Assets/Background/Coral/back_tube_coral_3.png');
  bg.coral.front_tube_coral_1 = loadImage('Assets/Background/Coral/front_tube_coral_1.png');
  bg.coral.front_tube_coral_2 = loadImage('Assets/Background/Coral/front_tube_coral_2.png');
  bg.coral.front_tube_coral_3 = loadImage('Assets/Background/Coral/front_tube_coral_3.png');

  // Shipwreck
  bg.shipwreck = {};
  bg.shipwreck.back_part_1 = loadImage('Assets/Background/Shipwreck/back_part_1.png');
  bg.shipwreck.back_part_2 = loadImage('Assets/Background/Shipwreck/back_part_2.png');
  bg.shipwreck.back_part_3 = loadImage('Assets/Background/Shipwreck/back_part_3.png');
  bg.shipwreck.front_part_1 = loadImage('Assets/Background/Shipwreck/front_part_1.png');
  bg.shipwreck.front_part_2 = loadImage('Assets/Background/Shipwreck/front_part_2.png');
  bg.shipwreck.front_part_3 = loadImage('Assets/Background/Shipwreck/front_part_3.png');

  // Spike
  bg.spike = {};
  bg.spike.back_spike_1 = loadImage('Assets/Background/Spike/back_spike_1.png');
  bg.spike.back_spike_2 = loadImage('Assets/Background/Spike/back_spike_2.png');
  bg.spike.back_spike_3 = loadImage('Assets/Background/Spike/back_spike_3.png');
  bg.spike.front_spike_1 = loadImage('Assets/Background/Spike/front_spike_1.png');
  bg.spike.front_spike_2 = loadImage('Assets/Background/Spike/front_spike_2.png');
  bg.spike.front_spike_3 = loadImage('Assets/Background/Spike/front_spike_3.png');

  titlescreen = loadImage('Assets/titlescreen.png');
  gameoverGif = loadImage('Assets/gameover.gif');
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  noSmooth();
  panzoom = new PanZoom();
  scenes = new SceneManager();
  scene = new GameScene();
  gui = new GUI();
  player = new Player(0, 0);
  boat = new Boat(0, 0);
  panzoom.disableRightClickDropDown();
  keys = panzoom.keys;
  mouse = panzoom.mouse;
}

function draw() {
  const DT = Math.min(1, deltaTime / 1000);
  
  panzoom.update(DT);
  scenes.update(DT);
  scenes.draw();
}