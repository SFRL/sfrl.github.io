let angVel; 
let increment;
let limit;
let play;
let speed;

let imgDim;
let waveform;
let segments;

let startingDate; 

function preload() {
  //scoreImg = loadImage('graphic_score.png');
  segments = new Array(6);
  segments[0] = loadImage('Images/segment-0.png');
  segments[1] = loadImage('Images/segment-1.png');
  segments[2] = loadImage('Images/segment-2.png');
  segments[3] = loadImage('Images/segment-3.png');
  segments[4] = loadImage('Images/segment-4.png');
  segments[5] = loadImage('Images/segment-5.png');
  waveform = loadImage('Images/bowls-and-score-hidpi.png');
 
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  //define variables
  angVel = [0.00220264317, 0.132158590298, 0.000001360000, 0.000310751705, 0.074580484778, 0.017351461904];
  increment = 0;
  limit = 262974960;
  speed = 1;
  play = false;

  startingDate = new Date(1999, 11, 31, 24);

  frameRate(60);

  adjustImageSize();
}


function draw() {
  if (play) {
    //Update timer
    if (increment < limit) {
      increment += speed;
    } else { 
      increment = limit;
      playState();
    }
  }

  translate(width/2, height/2);
  background(255);
  imageMode(CENTER);
  for (let i=0; i<segments.length; i++) {
    push();
    rotate(getAngle(i));
    image(segments[i], 0, 0, imgDim, imgDim);
    pop();
  }
  image(waveform, 0, 0, imgDim, imgDim);

  let displayDate = newDate(increment * 120000);
  timePassed(displayDate);

  document.getElementById("currentDate").innerHTML = "Date: " + displayDate[2] + "/" + displayDate[1] + "/" + displayDate[0] + " Time: " + displayDate[3] + ":" + displayDate[4];
}

function getAngle(i) {

  let angle = Math.PI*(angVel[i]*increment/180);
  return angle;
}


function playState() {

  play = !play;

  if (play) {
    if (increment >= limit) {
      increment = 0;
    }

    document.getElementById("play").value = "Stop";
  } else {
    document.getElementById("play").value = "Start";
  }
}

function changeSpeed() {
  let exp = document.getElementById("speed").value;
  speed = Math.pow(10, exp);
}


function newDate(milli) {
  let currentDate;
  let parseDate = new Array(5);
  currentDate = new Date(startingDate.getTime() + milli);
  parseDate[0] = currentDate.getYear() + 1900;
  parseDate[1] = currentDate.getMonth() + 1;
  parseDate[2] = currentDate.getDate();
  parseDate[3] = currentDate.getHours();
  parseDate[4] = currentDate.getMinutes();
  return parseDate;
}

function timePassed(date) {
  let years = date[0] - 2000;
  let months = date[1] - 1;
  let days = date[2] - 1;
  let hours = date[3];
  let minutes= date[4];

  document.getElementById("timePassed").innerHTML = " Time Passed:" + years + " Years " + months + " Months " + days + " Days " + hours + " Hours " + minutes + " Minutes";
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  adjustImageSize();
}

function adjustImageSize() {
  if (width<=height) {
    imgDim = width;
  } else if (width>height) {
    imgDim = height;
  } else {
    imgDim = 0;
  }
}
