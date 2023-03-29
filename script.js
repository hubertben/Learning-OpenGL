let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

let CANVASWIDTH = c.width;
let CANVASHEIGHT = c.height;


class COLOR {

    constructor(r = 0, g = 0, b = 0, a = 1, copy_ = null) {

        if (copy_ !== null && copy_ instanceof COLOR) {
            this.r = copy_.r;
            this.g = copy_.g;
            this.b = copy_.b;

        }else if (r <= 1 && g <= 1 && b <= 1) {
            this.r = parseInt(r * 255);
            this.g = parseInt(g * 255);
            this.b = parseInt(b * 255);

        } else {
            this.r = r;
            this.g = g;
            this.b = b;
        }

        this.a = a;
    }

    _get(normalize = true){
        if (normalize) {
            return {
                "r": this.r / 255,
                "g": this.g / 255,
                "b": this.b / 255,
                "a": this.a
            }
        }else{
            return {
                "r": this.r,
                "g": this.g,
                "b": this.b,
                "a": this.a
            }
        }
    }

    set(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        let bigint = parseInt(hex.slice(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;

        return {
            "r": r,
            "g": g,
            "b": b
        };
    }

    setHex(hex) {
        let rgb = this.hexToRgb(hex);
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
    }

    getHex() {
        return this.rgbToHex(this.r, this.g, this.b);
    }

    getHexAlpha() {
        return this.rgbToHex(this.r, this.g, this.b) + (this.a * 255).toString(16);
    }

}

function mapValue(val, low, high, range_low, range_high) {
    let inc = (range_high - range_low) / (high - low)
    return range_low + ((val - low) * inc)
}

function resizeCanvas(width = null, height = null) {

    if (width == null || height == null) {
        c.width = window.innerWidth - 100;
        CANVASWIDTH = c.width
        c.height = window.innerHeight - 100;
        CANVASHEIGHT = c.height        
    }else{
        c.width = width;
        c.height = height;
    }
}



function lineAlphaGradient(x, y, x2, y2, color, startAlpha = 1, endAlpha = 0) {
    let gradient = ctx.createLinearGradient(x, y, x2, y2);

    startA = (parseInt(startAlpha * 255)).toString(16)
    if (startA.length == 1) { startA = "0" + startA; }
    endA = (parseInt(endAlpha * 255)).toString(16)
    if (endA.length == 1) { endA = "0" + endA; }

    console.log(x, y, x2, y2, color.getHex() + startA, color.getHex() + endA)

    gradient.addColorStop(0, color.getHex() + startA);
    gradient.addColorStop(1, color.getHex() + endA);
    return gradient;
}



function findNormalVector(x, y, x2, y2) {
    const dx = x2 - x;
    const dy = y2 - y;
    const length = Math.sqrt(dx*dx + dy*dy);
    
    // normalize the vector
    const nx = dy / length;
    const ny = -dx / length;
    
    return {
      "n1_x": nx,
      "n1_y": ny,
      "n2_x": -nx,
      "n2_y": -ny
    };
}


function trailShape(trail) {

    const path = new Path2D();

    const trailX = trail.sx;
    const trailY = trail.sy;
    const trailDX = trail.dx;
    const trailDY = trail.dy;
    const trailLength = trail.trailLength;

    const angle = Math.atan2(trailDY, trailDX);
    const normals = findNormalVector(0, 0, trailDX, trailDY);

    const C = trail.trailWidth * 1.5;
    const normal1X = trailX + (normals.n1_x * C);
    const normal1Y = trailY + (normals.n1_y * C);
    const endX = trailX + trailLength * -trailDX;
    const endY = trailY + trailLength * -trailDY;
    
    path.arc(trailX, trailY, C, angle, angle + Math.PI/2, false);   
    path.lineTo(endX, endY);
    path.lineTo(normal1X, normal1Y);
    path.moveTo(trailX, trailY);
    
    path.arc(trailX, trailY, C, angle - Math.PI/2, angle, false);
    path.closePath();
    

    return path;
}




    // const path = new Path2D();
  
    // const endX = x + lineLength * dx;
    // const endY = y + lineLength * dy;

    // const angle = Math.atan2(dy, dx);
  
    // const tangentX = x + radius * Math.cos(angle);
    // const tangentY = y + radius * Math.sin(angle);
  
    // path.arc(x, y, radius, Math.PI - angle, Math.PI + angle, false);
  
    // path.lineTo(endX, endY);
  
    // path.lineTo(tangentX, tangentY);
  
    // path.arc(x, y, radius, angle, -angle, false);
  
    // path.closePath();
  
    // return path, {
    //     "x": endX,
    //     "y": endY
    // };



class Trail {

    constructor(star, trailLength, trailWidth, dx, dy, alphaRange = {}, bloom = false) {
        this.star = star;
        this.trailLength = trailLength;
        this.trailWidth = trailWidth;
        this.sx = star.x;
        this.sy = star.y;
        this.dx = dx;
        this.dy = dy;
        this.alphaRange = alphaRange;
        this.bloom = bloom;
        this.color = this.star.color
    }

    draw() {
        ctx.beginPath();

        let path = trailShape(this);

        ctx.fillStyle = lineAlphaGradient(
            this.star.x,
            this.star.y,
            this.star.x + (this.dx * this.trailLength),
            this.star.y + (this.dy * this.trailLength),
            this.color,
            this.alphaRange.start,
            this.alphaRange.end
        );

        ctx.fill(path);

    }
}


class Star {

    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.trails = [];
    }

    draw() {

        if (this.trails != []) {
            for (let i = 0; i < this.trails.length; i++) {
                this.trails[i].draw();
            }
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = this.color.getHexAlpha();
        ctx.fill();

    }

    addTrail(trailLength, trailWidth, dx, dy, alphaRange = {}, bloom = false, color = this.color) {
        let trail = new Trail(this, trailLength, trailWidth, dx, dy, alphaRange, bloom);
        trail.color = color;
        this.trails.push(trail);
    }

}


function generateStars(numStars = 1000){
    let STARS = [];

    for (let i = 0; i < numStars; i++) {
        let x = Math.random() * CANVASWIDTH;
        let y = Math.random() * CANVASHEIGHT;
        let r = mapValue(Math.random(), 0, 1, 0, 5);
        
        let __color__1 = new COLOR(
            parseInt(mapValue(Math.random(), 0, 1, 100, 255)),
            parseInt(mapValue(Math.random(), 0, 1, 50, 200)),
            parseInt(mapValue(Math.random(), 0, 1, 150, 255))
        );

        let __color__2 = new COLOR(
            parseInt(mapValue(Math.random(), 0, 1, 175, 255)),
            parseInt(mapValue(Math.random(), 0, 1, 100, 200)),
            parseInt(mapValue(Math.random(), 0, 1, 200, 255))
        );

        let __color__3 = new COLOR(
            parseInt(mapValue(Math.random(), 0, 1, 200, 255)),
            parseInt(mapValue(Math.random(), 0, 1, 200, 255)),
            parseInt(mapValue(Math.random(), 0, 1, 200, 255))
        );
        
        let STAR = new Star(x, y, r, __color__3);

        // STAR.addTrail(500, r * 5    , 1, 1, {"start":.35  , "end":0}, true, new COLOR(45, 93, 115));
        // STAR.addTrail(400, r * 1    , 1, 1, {"start":0.5  , "end":0}, true, new COLOR(64, 137, 063));
        // STAR.addTrail(100, r / 3    , 1, 1, {"start":1.0  , "end":1}, true, new COLOR(1, 1, 1));
        
        STAR.addTrail(500, r * 2    , 1, -1, {"start":.25  , "end":0}, true, __color__1);
        STAR.addTrail(300, r * 1    , 1, -1, {"start":0.5  , "end":0}, true, __color__2);
        STAR.addTrail(100, r / 3    , 1, -1, {"start":1.0  , "end":1}, true, __color__3);
        
        STARS.push(STAR);

        let _x = Math.random() * CANVASWIDTH;
        let _y = Math.random() * CANVASHEIGHT;
        let _r = mapValue(Math.random(), 0, 1, 0, 2);
        let ___color__ = new COLOR(1, 1, 1);
        let _STAR = new Star(_x, _y, _r, ___color__);

        STARS.push(_STAR);
    }

    return STARS;
}


let STARS = [];

function setup() {
    resizeCanvas();

    STARS = generateStars(200);

    render();
}

function render() {

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    for (let i = 0; i < STARS.length; i++) {
        STARS[i].draw();
    }

}