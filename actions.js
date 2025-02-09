function keyPressed() {
  if (boat.canBoard() && key === "e") {
    if (player.carrying) {
      player.dropoff();
    } else {
      boat.board();
    }
  } else if (!player.swimming && key === "e") {
    boat.dismount();
  } else if (player.carrying && key === "e") {
    player.drop();
  } else if (!player.carrying && player.canPickup && key === "e") {
    player.carrying = player.canPickup;
    player.carrying.carry();
    player.canPickup = null;
  }

  if (key == " ") {
    player.speedUp();
  }
}