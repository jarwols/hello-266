function preload(){
  hello = loadSound('audio/hello.m4a');
  born = loadSound('audio/born.m4a');
  candles = loadSound('audio/candles.m4a');
  cs = loadSound('audio/CS.m4a');
  foodie = loadSound('audio/foodie.m4a');
  fun_fact = loadSound('audio/fun_fact.m4a');
  riding = loadSound('audio/riding.m4a');
  first = true; 
  second = false;
  clickedX = 0;
  clickedY = 0;
}
function setup() {
  amplitude = new p5.Amplitude();
  hello.play();
  createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background('#000');
  fill(255);
  var level = amplitude.getLevel();
  var size = map(level, 0, 1, 0, 5000);
  ellipse(width/2, height/2, size, size);

  var distance = dist(mouseX, mouseY, (width/2 + size), (height/2 + size));

  if(!first) {
    fill('#FF69B4');
  ellipse(clickedX, clickedY, size, size);
  }

  if(second && !first) {
    fill('#2980b9');
  ellipse(clickedX, clickedY, size, size);
  }
}

function mouseClicked(){
  if(!first) {
    assignSecondKey();
  }
  if(first) {
    assignFirstKey();
  }
}

function assignFirstKey() {
  clickedX = mouseX;
  clickedY = mouseY;
  first = false;
  hello.play();
  born.play();  
}

function assignSecondKey() {
  clickedX = mouseX;
  clickedY = mouseY;
  second = true;
  hello.play();
  born.play();  
  riding.play();
}
