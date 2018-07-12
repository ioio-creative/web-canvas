//Inspired from Color Smoke by Konstantin Makhmutov

var totalSize = 2048;
var siz = totalSize - 1;
var si = totalSize - 2;

var centerW,
  centerH;
var px = [];
var py = [];

var vx = [];
var vy = [];
var ax = [];
var ay = [];

var tension = 0.5;
var sympathy = 0.25;

var vr = 0,
  vg = 0,
  vb = 0;

var r = 192;
var g = 192;
var b = 192;
function setup() {
  createCanvas(windowWidth, windowHeight);

  background(255);
  noFill();
  strokeWeight(0.025);

  centerW = windowWidth / 2;
  centerH = windowHeight / 2;

  for (var i = 0; i < totalSize; i++) {
    var angle = TAU * i / totalSize;
    px[i] = centerW + cos(angle) * centerH;
    py[i] = centerH + sin(angle) * centerH;
    vx[i] = 0;
    vy[i] = 0;
    ax[i] = 0;
    ay[i] = 0;
  }

}
var a = 255 / 2;
var sw = 0.05;
function draw() {

  console.log(frameRate());
  //sympathy = map(mouseX, 0, windowWidth, 0.01, 0.25);
  if (mouseX > centerW) {
    a = int(map(mouseX, centerW, windowWidth, 255 / 20, 255));
  } else {
    a = int(map(mouseX, 0, centerW, 255, 255 / 20));
  }
  if (mouseY > centerH) {
    sw = map(mouseY, centerH, windowHeight, 0.025, 0.5);
  } else {
    sw = map(mouseY, 0, centerH, 0.5,  0.025);
  }

  background(255, 255, 255, a);
  strokeWeight(sw);


  for (var i = 1; i < siz; i++) {
    ax[i] = (px[i - 1] + px[i + 1] - px[i] - px[i]) * tension + (vx[i - 1] + vx[i + 1] - vx[i] - vx[i]) * sympathy;
    ay[i] = (py[i - 1] + py[i + 1] - py[i] - py[i]) * tension + (vy[i - 1] + vy[i + 1] - vy[i] - vy[i]) * sympathy;
  }
  ax[0] = (px[siz] + px[1] - px[0] - px[0]) * tension + (vx[siz] + vx[1] - vx[0] - vx[0]) * sympathy;
  ay[0] = (py[siz] + py[1] - py[0] - py[0]) * tension + (vy[siz] + vy[1] - vy[0] - vy[0]) * sympathy;

  ax[siz] = (px[si] + px[0] - px[siz] - px[siz]) * tension + (vx[si] + vx[0] - vx[siz] - vx[siz]) * sympathy;
  ay[siz] = (py[si] + py[0] - py[siz] - py[siz]) * tension + (vy[si] + vy[0] - vy[siz] - vy[siz]) * sympathy;

  var randomNode = int(random(totalSize));
  var speed = abs(mouseX - pmouseX) + abs(mouseY - pmouseY);

  speed = constrain(speed, 0, 400);
  //var s = map(speed, 0, 400, 0.001, 0.01)
  var mX,
    mY;
  var outOfScreenFactor = 0.96;
  if (mouseX >= windowWidth * outOfScreenFactor || mouseX <= windowWidth * (1 - outOfScreenFactor)) {
    mX = centerW;
    //  console.log("Out of Screen")
  } else {
    mX = mouseX;
  }
  if (mouseY >= windowHeight * outOfScreenFactor || mouseY <= windowHeight * (1 - outOfScreenFactor)) {
    mY = centerH;
    //  console.log("Out of Screen")
  } else {
    mY = mouseY;
  }

  var distance = dist(mouseX, mouseY, px[randomNode], py[randomNode])

  var s = map(distance, 0, windowWidth, 0.001, 0.01)
  ax[randomNode] = (mX - px[randomNode]) * s + randomGaussian() * 5;
  ay[randomNode] = (mY - py[randomNode]) * s + randomGaussian() * 5;

  for (var i = 0; i < totalSize; i++) {
    vx[i] += ax[i];
    vy[i] += ay[i];
    px[i] += vx[i];
    py[i] += vy[i];
    px[i] = constrain(px[i], 0, windowWidth);
    py[i] = constrain(py[i], 0, windowHeight);
  }

  vr = vr * 0.995 + randomGaussian() * 0.04;
  vg = vg * 0.995 + randomGaussian() * 0.04;
  vb = vb * 0.995 + randomGaussian() * 0.04;

  r += vr;
  g += vg;
  b += vb;

  if ((r < 128 && vr < 0) || (r > 255 && vr > 0)) {
    vr = -vr;
  }
  if ((g < 128 && vg < 0) || (g > 255 && vg > 0)) {
    vg = -vg;
  }
  if ((b < 128 && vb < 0) || (b > 255 && vb > 0)) {
    vb = -vb;
  }

  stroke(color(r, g, b));

  beginShape();
  for (var i = 0; i < totalSize; i++) {
    vertex(px[i], py[i]);
  }
  endShape(CLOSE);



}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
