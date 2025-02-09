function keyPressed() {
  scenes.scene.typed(key);

  let KEY = key.toUpperCase();

  if (boat.canBoard() && KEY === "E") {
    if (player.carrying) {
      player.dropoff();
    } else {
      boat.board();
    }
  } else if (!player.swimming && KEY === "E") {
    boat.dismount();
  } else if (player.carrying && KEY === "E") {
    player.drop();
  } else if (!player.carrying && player.canPickup && KEY === "E") {
    player.carrying = player.canPickup;
    player.carrying.carry();
    player.canPickup = null;
  }

  if (KEY == " ") {
    player.speedUp();
  }

  if (KEY == "P") {
    if (scenes.scene instanceof GameScene) {
      scenes.scene.pause();
    }
  }
}