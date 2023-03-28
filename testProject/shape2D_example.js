let c = document.getElementById("canvas");
let GL = c.getContext("webgl");

let width = c.width;
let height = c.height;

// Helper functions //

class COLOR {

    constructor(r = 0, g = 0, b = 0, copy_ = null) {

        if (copy_ !== null && copy_ instanceof COLOR) {
            this.r = copy_.r;
            this.g = copy_.g;
            this.b = copy_.b;
            return;
        }

        if (r <= 1 && g <= 1 && b <= 1) {
            this.r = parseInt(r * 255);
            this.g = parseInt(g * 255);
            this.b = parseInt(b * 255);
            return;
        }

        this.r = r;
        this.g = g;
        this.b = b;

        console.log(this.r, this.g, this.b);
    }

    get_0_1() {
        return [this.r / 255, this.g / 255, this.b / 255];
    }

    get_255() {
        return [this.r, this.g, this.b];
    }

    set(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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

}

function mapValue(val, low, high, range_low, range_high) {
    let inc = (range_high - range_low) / (high - low)
    return range_low + ((val - low) * inc)
}

function resizeCanvas(width = null, height = null) {

    if (width == null || height == null) {
        c.width = window.innerWidth - 100;
        width = c.width
        c.height = window.innerHeight - 100;
        height = c.height        
    }else{
        c.width = width;
        c.height = height;
    }

    GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);

}

function getPixel(i) {
    let data = ctx.getImageData(i * (width / 45) + 2, 1, 3, 3).data;
    console.log(data[0], data[1], data[2]);
    return rgbToHex(data[0], data[1], data[2]);
}







// OpenGL functions //

function clearCanvas(color = null) {
    
    if (color == null) {
        GL.clearColor(0, 0, 0, 1);
    } else {
        normalColor = color.get_0_1();
        GL.clearColor(normalColor[0], normalColor[1], normalColor[2], 1);
    }

    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
}


function returnSampleVertexShader() {
    return `
    precision mediump float;
    attribute vec2 a_position;
    attribute vec3 a_color;
    
    varying vec3 v_color;
    
    void main() {
        v_color = a_color;
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `;
}

function returnSampleFragmentShader() {
    return `
    precision mediump float;

    varying vec3 v_color;

    void main() {
        gl_FragColor = vec4(v_color, 1.0);
    }
    `;
}

function returnSampleVertexShader2() {
    return `
    precision mediump float;

    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `;
}

function returnSampleFragmentShader2() {
    return `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `;
}

function errorChecking(vertexShader = null, fragmentShader = null, program = null) {

    if (vertexShader == null && fragmentShader == null && program == null) {
        console.error("No shader was passed to errorChecking function");
    }

    if (vertexShader != null && !GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
        console.error(GL.getShaderInfoLog(vertexShader));
    }

    if (fragmentShader != null && !GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
        console.error(GL.getShaderInfoLog(fragmentShader));
    }

    if (program != null && !GL.getProgramParameter(program, GL.LINK_STATUS)) {
        console.error(GL.getProgramInfoLog(program));
    }
}

function vertexShader(shader){
    let vertexShader = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vertexShader, shader);
    GL.compileShader(vertexShader);

    return vertexShader;
}

function fragmentShader(shader){
    let fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fragmentShader, shader);
    GL.compileShader(fragmentShader);

    return fragmentShader;
}

function createProgram(vertexShader, fragmentShader) {

    if (typeof vertexShader == "string") {
        vertexShader = vertexShader(vertexShader);
    }

    if (typeof fragmentShader == "string") {
        fragmentShader = fragmentShader(fragmentShader);
    }

    let program = GL.createProgram();
    GL.attachShader(program, vertexShader);
    GL.attachShader(program, fragmentShader);
    GL.linkProgram(program);

    return program;
}


function createBuffer(data, type = GL.ARRAY_BUFFER, usage = GL.STATIC_DRAW) {
    let buffer = GL.createBuffer();
    GL.bindBuffer(type, buffer);
    GL.bufferData(type, new Float32Array(data), usage);
    
    return buffer;
}

function createAttribute(buffer, program, name, size, type = GL.FLOAT, normalize = false, stride = 0, offset = 0) {
    let attribute = GL.getAttribLocation(program, name);
    GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
    GL.vertexAttribPointer(attribute, size, type, normalize, stride, offset);
    GL.enableVertexAttribArray(attribute);

    return attribute;
} 

function render(program, type = GL.TRIANGLES, count = 3, offset = 0) {
    GL.useProgram(program);
    GL.drawArrays(type, offset, count);
}


function setup() {
    resizeCanvas();
    clearCanvas(new COLOR(.1, .1, .1));

    VSh = vertexShader(returnSampleVertexShader());
    FSh = fragmentShader(returnSampleFragmentShader());

    program = createProgram(VSh, FSh);

    errorChecking(VSh, FSh, program);

    pointNum = 4;
    totalNum = 5;

    data = [
        -0.7,    0.7,    1.0, 0.0, 0.0,
         0.7,    0.7,    0.5, 1.0, 0.0,
         0.7,   -0.7,    0.0, 0.5, 1.0,
        -0.7,   -0.7,    0.0, 0.0, 5.0,
    ];

    let positionBuffer = createBuffer(data);

    createAttribute(positionBuffer, program, "a_position", 2, GL.FLOAT, false, totalNum * Float32Array.BYTES_PER_ELEMENT, 0);
    createAttribute(positionBuffer, program, "a_color", 3, GL.FLOAT, false, totalNum * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    render(program, GL.TRIANGLE_FAN, pointNum, 0);

}




