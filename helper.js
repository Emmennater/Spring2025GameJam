
function setAlpha(c, alpha) {
  return color(red(c), green(c), blue(c), alpha);
}

function setBrightness(c, amount) {
  return color(
    red(c) * amount,
    green(c) * amount,
    blue(c) * amount
  );
}

function angleDiff(a, b) {
  let delta = ((b - a + PI) % TWO_PI + TWO_PI) % TWO_PI - PI; // Find shortest path
  return delta;
}

function lerpAngle(a, b, t) {
  let delta = ((b - a + PI) % TWO_PI + TWO_PI) % TWO_PI - PI; // Find shortest path
  return a + delta * t;
}
