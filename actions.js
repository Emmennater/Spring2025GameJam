function keyPressed() {
  if (boat.canBoard() && key === "e") {
    boat.board();
  } else if (!player.swimming && key === "e") {
    boat.dismount();
  }
}