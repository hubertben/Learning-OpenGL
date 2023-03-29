
let STARS = [];




class Galaxy {

    constructor(numStars, dx, dy){
        this.numStars = numStars;
        this.dx = dx;
        this.dy = dy;

        this.STARS = [];

        this.xminBound = -100;
        this.xmaxBound = CANVASWIDTH + 100;
        this.yminBound = -100;
        this.ymaxBound = CANVASHEIGHT + 100;

        this.radiusminBound = 0;
        this.radiusmaxBound = 5;
    }

    build () {
        this.generateStars();
        this.generateAmbientStars();
    }


    generateStars(){
        this.STARS = [];

        for (let i = 0; i < this.numStars; i++) {

            let x = Math.random() * (this.xmaxBound - this.xminBound) + this.xminBound;
            let y = Math.random() * (this.ymaxBound - this.yminBound) + this.yminBound;
            let r = mapValue(Math.random(), 0, 1, this.radiusminBound, this.radiusmaxBound);
            
            let __color__1 = new COLOR(0, 0, 0).randomColor();
            let __color__2 = new COLOR(0, 0, 0).randomColor();
            let __color__3 = new COLOR(0, 0, 0).randomColor();
            
            let STAR = new Star(x, y, r, new COLOR(1, 1, 1));

            // STAR.addTrail(700, r * 2    , this.dx, this.dy, {"start":.25  , "end":0}, true, new COLOR(45, 93, 115));
            // STAR.addTrail(400, r * 1    , this.dx, this.dy, {"start":0.5  , "end":0}, true, new COLOR(64, 137, 63));
            // STAR.addTrail(100, r / 2    , this.dx, this.dy, {"start":1.0  , "end":1}, true, new COLOR(1, 1, 1));
            
            STAR.addTrail(700, r * 2    , this.dx, this.dy, {"start":.25  , "end":0}, true, __color__1);
            STAR.addTrail(400, r * 1    , this.dx, this.dy, {"start":0.5  , "end":0}, true, __color__2);
            STAR.addTrail(100, r / 2    , this.dx, this.dy, {"start":1.0  , "end":1}, true, __color__3);
            
            this.STARS.push(STAR);
        }

    }

    generateAmbientStars(count = -1){
        
        if (count == -1) {
            count = this.numStars;
        }

        for (let i = 0; i < count; i++) {
        
            let x = Math.random() * CANVASWIDTH;
            let y = Math.random() * CANVASHEIGHT;
            let r = mapValue(Math.random(), 0, 1, 0, 2);

            let col = mapValue(Math.random(), 0, 1, .75, 1);

            let __color__ = new COLOR(col, col, col);
            let STAR = new Star(x, y, r, __color__);

            this.STARS.push(STAR);
        }
    }
}
