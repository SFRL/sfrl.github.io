var counter = 0;
var boxsize = 30;
var boxframe = 8;
var speed = 4;
var amount = 4;
var trail = 10;

var canvasWidth = 500;
var canvasHeight = 500;


var boxes = [];
var cube = [];



function setup() {

  var canvas = createCanvas(canvasWidth, canvasHeight, WEBGL);
    background(0);

  canvas.parent('cubes');
    

    
  for (var i=0; i<amount; i++)
  {
    var velX = 0;
    var velY = 1;
    var velZ = 0;
        
    if (i==0) {
      velX=1;
      velY=0;
      velZ=0;
    } else if (i==1) {
      velX=0;
      velY=1;
      velZ=0;
    } else if (i==2) {
      velX=0;
      velY=0;
      velZ=1;
    }
    else if (i==3) {
      velX=-1;
      velY=0;
      velZ=0;
    }
    else if (i==4) {
      velX=0;
      velY=-1;
      velZ=0;
    }
    else if (i==5) {
      velX=0;
      velY=0;
      velZ=-1;
    }
    
    cube.push(new Box(boxframe/2, boxframe/2, boxframe/2, velX, velY, velZ));
  }

  stroke(255);
  strokeWeight(2);

}


function draw() {
    
        if (counter < speed) {
      counter++;
        }
    else {
      counter = 0;

  background(0);
  //lights();
  
  
  for (i=0; i<amount; i++)
    {
    cube[i].update();
    }
    
    
  for (var a = 0; a<=boxframe; a++) {
    for (var b = 0; b<=boxframe; b++) {
      for (var c = 0; c<=boxframe; c++) {
                
        if (boxes[(c*(boxframe+1)+b)*(boxframe+1)+a]>0) {
          push();
          fill(int(boxes[(c*(boxframe+1)+b)*(boxframe+1)+a]/trail) * 255);
                    //noFill();
          stroke(255);
          translate(boxsize*(a-boxframe/2), boxsize*(b-boxframe/2), boxsize*(c-boxframe/2));
          box(boxsize);
          pop(); 
                    boxes[(c*(boxframe+1)+b)*(boxframe+1)+a]--;
        }
                
      }
    }
  }
            
        }
        
}


class Box {

  constructor(x, y, z, startX, startY, startZ) {
        
    var flag = false;
        this.flag = flag;
    var velocity = createVector(startX, startY, startZ);
        this.velocity = velocity;
    this.x = x;
    this.y = y;
    this.z = z;
  }

    update() {
            
            var sign = 0;
        

      sign = int(random(2));
      if (sign == 0) {
        sign = -1;
            }
        

            
            
      if ((this.x==boxframe || this.x==0 || this.flag==true) && this.velocity.x!=0) 
      {
        this.velocity.x=0;
        if (random(1)>0.5)
          this.velocity.y=sign;
        else
          this.velocity.z=sign;
      }  else if ((this.y==boxframe || this.y==0 || this.flag==true) && this.velocity.y!=0) 
      {
        this.velocity.y=0;
        if (random(1)>0.5)
          this.velocity.z=sign;
        else
          this.velocity.x=sign;
      } else if ((this.z==boxframe || this.z==0 || this.flag==true)  && this.velocity.z!=0) 
      {
        this.velocity.z=0;
        if (random(1)>0.5)
          this.velocity.x=sign;
        else
          this.velocity.y=sign;
      }
            
            

      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.z += this.velocity.z;
            
            
            
      if (this.x>boxframe) {
        this.x=boxframe - 1;
        this.velocity.x *= -1;
      } else if (this.x<0) {
        this.x = 1;
        this.velocity.x *= -1;
      }

      if (this.y>boxframe) {
        this.y=boxframe - 1;
        this.velocity.y *= -1;
      } else if (this.y<0) {
        this.y = 1;
        this.velocity.y *= -1;
      }

      if (this.z>boxframe) {
        this.z=boxframe - 1;
        this.velocity.z *= -1;
      } else if (this.z<0) {
        this.z = 1;
        this.velocity.z *= -1;
      }
            
            var a = this.x;
            var b = this.y;
            var c = this.z;
            
            
      if (boxes[(c*(boxframe+1)+b)*(boxframe+1)+a] > 0)
      {
        this.flag = true;
        this.x -= this.velocity.x;
        this.y -= this.velocity.y;
        this.z -= this.velocity.z;
                
      }
      else
      {
        this.flag = false; 
        boxes[(c*(boxframe+1)+b)*(boxframe+1)+a] = trail;
      }

        }     
  
}