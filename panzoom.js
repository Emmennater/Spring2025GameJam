
class PanZoom {
  constructor() {
    this.zoom = 2;
    this.xoff = 0;
    this.yoff = 0;
    this.gap = 50;
    this.mouse = { x: 0, y: 0 };
    this.pmouse = { x: 0, y: 0 };
    this.keys = {};
    this.zoomToMouse = false;
    this.ignoreInput = 0;
    this.initEvents();
  }
  
  setInView(x, y) {
    this.xoff = -x;
    this.yoff = -y;
  }
  
  trackPos(x, y) {
    const newX = lerp(-this.xoff, x, 0.1);
    const newY = lerp(-this.yoff, y, 0.1);
    this.setInView(newX, newY);
  }
  
  // Events
  initEvents() {
    function camelToSnake(input) {
      return input == " " ? "SPACE" :
        input.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
    }
    
    document.addEventListener("mousedown", e => {
      const pos = this.scaleCoordinate(mouseX, mouseY);
      this.mouse.start = pos;
    });
    
    document.addEventListener("keydown", e => {
      const k = camelToSnake(e.key);
      this.keys[k] = true;
    });
    
    document.addEventListener("keyup", e => {
      const k = camelToSnake(e.key);
      this.keys[k] = false;
    });
    
    document.addEventListener("wheel", e => {
      const ZOOM_RATE = 0.1;
      if (e.deltaY < 0) {
        this.zoomIn(0.5);
        // this.zoomIn(-e.deltaY / 100 * ZOOM_RATE)
      } else {
        this.zoomOut(0.5);
        // this.zoomOut(e.deltaY / 100 * ZOOM_RATE)
      }
    });
  }
  
  disableRightClickDropDown() {
    for (let element of document.getElementsByClassName('p5Canvas')) {
      element.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }
  
  // Functions
  scaleCoordinate(x, y) {
    return {
      x: ((x - width / 2) / this.zoom) - this.xoff,
      y: ((y - height / 2) / this.zoom) - this.yoff
    };
  }
  
  unscaleCoordinate(x, y) {
    return {
      x: (x + this.xoff) * this.zoom + width / 2,
      y: (y + this.yoff) * this.zoom + height / 2
    };
  }

  
  begin() {
    push()
    translate(width/2, height/2);
    scale(this.zoom);
    translate(this.xoff, this.yoff);
  }
  
  end() {
    pop();
  }
  
  zoomIn(amt) {
    // Store old
    let zoom = this.zoom;
    let xoff = this.xoff;
    let yoff = this.yoff;
    
    // Calculate new
    const dmx = (width / 2) - mouseX;
    const dmy = (height / 2) - mouseY;
    if (this.zoomToMouse) {
      xoff += dmx * amt / zoom
      yoff += dmy * amt / zoom
    }
    zoom /= 1 - amt
    
    // Update
    this.zoom = zoom;
    this.xoff = xoff;
    this.yoff = yoff;
  }
  
  zoomOut(amt) {
    // Store old
    let zoom = this.zoom;
    let xoff = this.xoff;
    let yoff = this.yoff;
    
    // Calculate new
    const dmx = (width / 2) - mouseX
    const dmy = (height / 2) - mouseY
    zoom *= 1 - amt
    if (this.zoomToMouse) {
      xoff -= dmx * amt / zoom
      yoff -= dmy * amt / zoom
    }
    
    // Update
    this.zoom = zoom;
    this.xoff = xoff;
    this.yoff = yoff;
  }
  
  displayLines() {
    this.begin();
    const TL = this.scaleCoordinate(0, 0);
    const BR = this.scaleCoordinate(width, height);
    const GAP = this.gap;
    const inset = 4 / this.zoom;
    
    stroke(60);
    strokeWeight(Math.min(1.5, 1 / this.zoom));
    for (let x = floor(TL.x / GAP) * GAP; x <= BR.x; x += GAP)
      line(x, TL.y, x, BR.y);
    for (let y = floor(TL.y / GAP) * GAP; y <= BR.y; y += GAP)
      line(TL.x, y, BR.x, y);
    
    this.end();
  }
  
  displayGrid() {
    this.begin();
    const TL = this.scaleCoordinate(0, 0);
    const BR = this.scaleCoordinate(width, height);
    const GAP = this.gap;
    const inset = 4 / this.zoom;
    const s = GAP;
    const ALPHA_RATIO = 1 - (1 / (this.zoom * 8)) ** 2;
    if (ALPHA_RATIO <= 0) return;
    
    let modWrap = (v, m) => ((v % m) + m) % m;
    
    noStroke();
    fill(255, 15 * ALPHA_RATIO);
    
    for (let x = floor(TL.x / GAP) * GAP; x <= BR.x; x += GAP) {
      for (let y = floor(TL.y / GAP) * GAP; y <= BR.y; y += GAP) {
        if ((modWrap(x, GAP * 2) < GAP) ^ (modWrap(y, GAP * 2) < GAP)) {
          rect(x, y, s, s);
        }
      }
    }
    
    this.end();
  }
  
  update() {
    const MOVE_RATE = 6;
    const ZOOM_RATE = 0.04;
    const dx = mouseX - pmouseX;
    const dy = mouseY - pmouseY;

    // Mouse movement
    // if (mouseIsPressed && mouseButton == RIGHT) {
    //   if (!this.ignoreInput) {
    //     this.xoff += dx / this.zoom;
    //     this.yoff += dy / this.zoom;
    //   }
    // }
    
    // Key movement
    if (!this.ignoreInput) {
      // if (this.keys.SHIFT) this.zoomIn(ZOOM_RATE);
      // if (this.keys.SPACE) this.zoomOut(ZOOM_RATE);

      const SPEED = MOVE_RATE / this.zoom;
      // if (this.keys.W) this.yoff += SPEED;
      // if (this.keys.A) this.xoff += SPEED;
      // if (this.keys.S) this.yoff -= SPEED;
      // if (this.keys.D) this.xoff -= SPEED;
    }
    
    // Update mouse
    const pos = this.scaleCoordinate(mouseX, mouseY);
    this.pmouse.x = this.mouse.x;
    this.pmouse.y = this.mouse.y;
    this.mouse.x = pos.x;
    this.mouse.y = pos.y;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*



















*/
