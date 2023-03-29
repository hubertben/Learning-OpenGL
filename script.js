let c = document.getElementById("canvas");
let ctx = c.getContext("2d");



let CANVASWIDTH = c.width;
let CANVASHEIGHT = c.height;

let GALAXY = null;
let TRAIL_MANAGER = null;

function setup() {
    resizeCanvas();

    GALAXY = new Galaxy(300, 0, 0);
    GALAXY.build();

    TRAIL_MANAGER = new TrailManager();

    render();
}

function render() {

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    TRAIL_MANAGER.applyToGalaxy(GALAXY);

    let stars = GALAXY.STARS;
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
    }

    let ambient = GALAXY.AMBIENT_STARS;
    for (let i = 0; i < ambient.length; i++) {
        ambient[i].draw();
    }


}