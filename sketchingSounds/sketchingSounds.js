let dots = new Array();
let decay = 0;


function setup() {
  createCanvas(500, 500);
  background(0);
}


function draw() {


  for (let i =0; i<dots.length; i++) {
    dots[i].update();
    dots[i].display();
    //if (dots.length > 1 && i < dots.length - 1) {
      //stroke(255);
      //line(dots[i].x,dots[i].y,dots[i+1].x,dots[i+1].y);
    //}
  }
}

function changeDecay() {
  decay = document.getElementById("myRange").value/500;
  console.log("Decay: " + decay);

  for (let i =0; i<dots.length; i++) {
    dots[i].life = 0;
  }
}

function mouseDragged() {
  dots.push(new dot(millis(), mouseX, mouseY, 2, decay));
}

class dot {

  constructor(time, x, y, diameter, decay) {
    this.birthTime = time;
    this.x = x;
    this.y = y;
    this.decay = decay;
    this.d = diameter;
    this.life = 1;
  }

  update() {
    if (this.life > 0) {
      this.life -= this.decay;
    } else {
      this.life = 0;
    }
  }

  display() {
    fill(this.life * 255);
    circle(this.x, this.y, this.d);
  }
}
