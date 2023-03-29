let TRAIL_BLOCK_INDEX = 0;



const trailParams = {
    "length": 0,
    "radius": 0,
    "dx": 0,
    "dy": 0,
    "alphaRange": {
        "start": 0,
        "end": 0
    },
    "bloom": false,
    "color": null
}



// gather the following elements from the DOM by their id:
// 1) colorInput, a color picker
// 2) alphaStartIn, a range slider
// 3) alphaEndIn, a range slider
// 4) lengthInput, a number input
// 5) radiusInput, a number input


function appendNewTrailBlockToDOM(trailBlock_){

    iD = trailBlock_.iD;

    let trailBlock = document.createElement("div");
    trailBlock.id = "trailBlock_" + String(iD);
    trailBlock.classList.add("trailBlock");

    let colorDiv = document.createElement("div");
    colorDiv.id = "color";

    let colorLabel = document.createElement("label");
    colorLabel.htmlFor = "color";
    colorLabel.innerText = "Color ";

    let colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.id = "colorInput";
    colorInput.name = "color";
    colorInput.value = "#000000";
    colorInput.onchange = function() {
        // console.log("colorInput changed for id: " + iD);
        trailBlock_.updateProfile();
    }

    colorDiv.appendChild(colorLabel);
    colorDiv.appendChild(colorInput);

    let alphaStartDiv = document.createElement("div");
    alphaStartDiv.id = "alphaStart";

    let alphaStartLabel = document.createElement("label");
    alphaStartLabel.htmlFor = "alpha1";
    alphaStartLabel.innerText = "Start-Alpha";

    let alphaStartInput = document.createElement("input");
    alphaStartInput.type = "range";
    alphaStartInput.classList.add("alphaStartIn");
    alphaStartInput.id = "alphaStartIn";
    alphaStartInput.name = "alphaStart";
    alphaStartInput.min = "0";
    alphaStartInput.max = "1";
    alphaStartInput.step = "0.01";
    alphaStartInput.value = "0.5";
    alphaStartInput.onchange = function() {
        // console.log("alphaStartInput changed for id: " + iD);
        trailBlock_.updateProfile();
    }

    alphaStartDiv.appendChild(alphaStartLabel);
    alphaStartDiv.appendChild(alphaStartInput);

    let alphaEndDiv = document.createElement("div");
    alphaEndDiv.id = "alphaEnd";

    let alphaEndLabel = document.createElement("label");
    alphaEndLabel.htmlFor = "alpha2";
    alphaEndLabel.innerText = "End-Alpha";

    let alphaEndInput = document.createElement("input");
    alphaEndInput.type = "range";
    alphaEndInput.classList.add("alphaEndIn");
    alphaEndInput.id = "alphaEndIn";
    alphaEndInput.name = "alphaEnd";
    alphaEndInput.min = "0";
    alphaEndInput.max = "1";
    alphaEndInput.step = "0.01";
    alphaEndInput.value = "0.5";
    alphaEndInput.onchange = function() {
        // console.log("alphaEndInput changed for id: " + iD);
        trailBlock_.updateProfile();
    }

    alphaEndDiv.appendChild(alphaEndLabel);
    alphaEndDiv.appendChild(alphaEndInput);

    let lengthDiv = document.createElement("div");
    lengthDiv.id = "length";

    let lengthLabel = document.createElement("label");
    lengthLabel.htmlFor = "length";
    lengthLabel.innerText = "Trail Length";

    let lengthInput = document.createElement("input");
    lengthInput.id = "lengthInput";
    lengthInput.type = "number";
    lengthInput.classList.add("box");
    lengthInput.name = "length";
    lengthInput.min = "0";
    lengthInput.max = "1000";
    lengthInput.value = "0";
    lengthInput.onchange = function() {
        // console.log("lengthInput changed for id: " + iD);
        trailBlock_.updateProfile();
    }

    lengthDiv.appendChild(lengthLabel);
    lengthDiv.appendChild(lengthInput);

    let radiusDiv = document.createElement("div");
    radiusDiv.id = "radius";

    let radiusLabel = document.createElement("label");
    radiusLabel.htmlFor = "radius";
    radiusLabel.innerText = "Radius Length";

    let radiusInput = document.createElement("input");
    radiusInput.id = "radiusInput";
    radiusInput.type = "number";
    radiusInput.classList.add("box");
    radiusInput.name = "length";
    radiusInput.min = "0";
    radiusInput.max = "1000";
    radiusInput.value = "0";
    radiusInput.onchange = function() {
        // console.log("radiusInput changed for id: " + iD);
        trailBlock_.updateProfile();
    }

    radiusDiv.appendChild(radiusLabel);
    radiusDiv.appendChild(radiusInput);

    let br = document.createElement("br");

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteButton");
    deleteButton.innerText = "Delete Trail";
    deleteButton.onclick = function() {
        // console.log("deleteButton clicked for id: " + iD);
    }

    trailBlock.appendChild(colorDiv);
    trailBlock.appendChild(alphaStartDiv);
    trailBlock.appendChild(alphaEndDiv);
    trailBlock.appendChild(lengthDiv);
    trailBlock.appendChild(radiusDiv);
    trailBlock.appendChild(br);
    trailBlock.appendChild(deleteButton);

    let control = document.getElementById("control");
    control.appendChild(trailBlock);


    trailBlock_.colorInput = trailBlock.querySelector("#colorInput");
    trailBlock_.alphaStartIn = trailBlock.querySelector("#alphaStartIn");
    trailBlock_.alphaEndIn = trailBlock.querySelector("#alphaEndIn");
    trailBlock_.lengthInput = trailBlock.querySelector("#lengthInput");
    trailBlock_.radiusInput = trailBlock.querySelector("#radiusInput");

}


function addTrail() {
    // console.log("addTrail() called");
    let trailBlock = new TrailBlock(TRAIL_BLOCK_INDEX);
    appendNewTrailBlockToDOM(trailBlock);
    TRAIL_BLOCK_INDEX++;
    TRAIL_MANAGER.trailBlocks.push(trailBlock);
}


class TrailBlock {

    constructor(iD) {
        this.iD = iD;

        this.div = document.getElementById("trailBlock_" + String(this.iD));

        this.colorInput = null;
        this.alphaStartIn = null;
        this.alphaEndIn = null;
        this.lengthInput = null;
        this.radiusInput = null;

        this.profile = {
            "length": 0,
            "radius": 0,
            "dx": 0,
            "dy": 0,
            "alphaRange": {
                "start": 0,
                "end": 0
            },
            "bloom": false,
            "color": null
        }
    }

    updateProfile() {
        this.profile.length = parseInt(this.lengthInput.value);
        this.profile.radius = parseFloat(this.radiusInput.value);

        this.profile.dx = GLOBAL_DX;
        this.profile.dy = GLOBAL_DY;

        this.profile.alphaRange.start = this.alphaStartIn.value;
        this.profile.alphaRange.end = this.alphaEndIn.value;

        this.profile.bloom = false;

        let COL = new COLOR();
        COL.setHex(this.colorInput.value);
        this.profile.color = COL;
    }

    buildTrailFromProfile(){

        let trail = new Trail(
            parseInt(this.profile.length),
            parseFloat(this.profile.radius),
            parseFloat(this.profile.dx),
            parseFloat(this.profile.dy),
                {
                    "start": parseFloat(this.profile.alphaRange.start),
                    "end": parseFloat(this.profile.alphaRange.end)
                },
            this.profile.bloom,
            this.profile.color
        );
        return trail;
    }

    getTrail() {
        this.updateProfile();
        return this.buildTrailFromProfile();
    }
}



class TrailManager {


    constructor() {
        this.trailBlocks = [];
    }

    applyToGalaxy(galaxy){
        for (let i = 0; i < galaxy.STARS.length; i++) {
            const star = galaxy.STARS[i];
            this.applyToStar(star);
        }
    }

    applyToStars(stars){
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            this.applyToStar(star);
        }
    }

    applyToStar(star){
        for (let i = 0; i < this.trailBlocks.length; i++) {
            const trailBlock = this.trailBlocks[i];
            let trail = trailBlock.getTrail();
            let prof = trailBlock.profile;
            star.addTrailProfile(prof);
        }
    }

    

}