
let cont = document.getElementById("control");
let direction = document.getElementById("direction");

function changeDirection() {

    let dx = parseInt(direction.value.split(",")[0]);
    let dy = parseInt(direction.value.split(",")[1]);

    GALAXY.dx = dx;
    GALAXY.dy = dy;

    GALAXY.build();

    render();
}

function refreshStars(){
    GALAXY.build();
    render();
}