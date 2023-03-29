let c = document.getElementById("canvas");
let ctx = c.getContext("2d");



let CANVASWIDTH = c.width;
let CANVASHEIGHT = c.height;

let GALAXY = null;

function setup() {
    resizeCanvas();

    GALAXY = new Galaxy(300, 0, 0);
    GALAXY.build();

    render();
}

function render() {

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);

    let stars = GALAXY.STARS;
    for (let i = 0; i < stars.length; i++) {
        stars[i].draw();
    }

}