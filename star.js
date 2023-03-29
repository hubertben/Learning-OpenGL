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


function lineAlphaGradient(x, y, x2, y2, color, startAlpha = 1, endAlpha = 0) {
    let gradient = ctx.createLinearGradient(x, y, x2, y2);

    startA = (parseInt(startAlpha * 255)).toString(16)
    if (startA.length == 1) { startA = "0" + startA; }
    endA = (parseInt(endAlpha * 255)).toString(16)
    if (endA.length == 1) { endA = "0" + endA; }

    // console.log(x, y, x2, y2, color.getHex() + startA, color.getHex() + endA)

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