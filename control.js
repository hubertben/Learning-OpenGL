
let cont = document.getElementById("control");
let direction = document.getElementById("direction");
let numUnits = document.getElementById("numUnitsBox");
let maxStarSize = document.getElementById("maxStarSizeBox");

let GLOBAL_DX = 0;
let GLOBAL_DY = 0;

function buildAndRender() {
    GALAXY.build();
    render();
}

function changeDirection() {

    let dx = parseInt(direction.value.split(",")[0]);
    let dy = parseInt(direction.value.split(",")[1]);

    GLOBAL_DX = dx;
    GLOBAL_DY = dy;

    GALAXY.dx = dx;
    GALAXY.dy = dy;

    buildAndRender();
}

function refreshStars(){
    buildAndRender();
}

function changeNumUnits() {
    GALAXY.numStars = parseInt(numUnits.value);

    console.log(GALAXY.numStars);
    buildAndRender();
}

function changeMaxStarSize() {
    GALAXY.radiusmaxBound = parseInt(maxStarSize.value);
    buildAndRender();
}

