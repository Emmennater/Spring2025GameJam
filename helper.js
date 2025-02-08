
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
