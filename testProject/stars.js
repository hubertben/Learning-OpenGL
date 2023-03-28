
c = document.getElementById("canvas");
let GL = c.getContext("webgl");

if (!GL) {
  console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
}

let width = c.width;
let height = c.height;

// Helper functions //

class COLOR {

    constructor(r = 0, g = 0, b = 0, copy_ = null) {

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
    }

    _get(normalize = true){
        if (normalize) {
            return {
                "r": this.r / 255,
                "g": this.g / 255,
                "b": this.b / 255
            }
        }else{
            return {
                "r": this.r,
                "g": this.g,
                "b": this.b
            }
        }
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


function coords(x, y) {
    
    let x_ = (x / GL.canvas.clientWidth) * 2 - 1;
    let y_ = (y / GL.canvas.clientHeight) * 2 - 1;

    const aspectRaitio = GL.canvas.clientWidth / GL.canvas.clientHeight;

    x_ *= aspectRaitio;
    y_ *= -1;

    return {"x": x_, "y": y_};
}



// OpenGL functions //

function clearCanvas(color = null) {
    
    if (color == null) {
        GL.clearColor(0, 0, 0, 1);
    } else {
        normalColor = color._get();
        GL.clearColor(normalColor.r, normalColor.g, normalColor.b, 1);
    }

    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
}

function setViewPort(x, y, width, height) {
    GL.viewport(x, y, width, height);
}


// function returnSampleVertexShader() {
//     return `
//     precision mediump float;
//     attribute vec2 a_position;
//     attribute vec3 a_color;
    
//     varying vec3 v_color;
    
//     void main() {
//         v_color = a_color;
//         gl_Position = vec4(a_position, 0.0, 1.0);
//     }
//     `;
// }

// function returnSampleFragmentShader() {
//     return `
//     precision mediump float;

//     varying vec3 v_color;

//     void main() {
//         gl_FragColor = vec4(v_color, 1.0);
//     }
//     `;
// }

// function returnSampleVertexShader2() {
//     return `
//     precision mediump float;

//     attribute vec2 a_position;

//     void main() {
//         gl_Position = vec4(a_position, 0.0, 1.0);
//     }
//     `;
// }

// function returnSampleFragmentShader2() {
//     return `
//     precision mediump float;

//     void main() {
//         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//     }
//     `;
// }

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

function createProgram_(vs, fs) {

    if (typeof vs == "string") {
        vs = vertexShader(vs);
    }

    if (typeof fs == "string") {
        fs = fragmentShader(fs);
    }

    errorChecking(vs, fs);

    let program = GL.createProgram();
    GL.attachShader(program, vs);
    GL.attachShader(program, fs);
    GL.linkProgram(program);
    GL.useProgram(program);

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

function render(program, type = GL.TRIANGLE_FAN, count = 3, offset = 0) {
    setViewPort(0, 0, GL.canvas.width, GL.canvas.height);
    GL.enable(GL.BLEND);
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    GL.useProgram(program);
    GL.drawArrays(type, offset, count);
}










function setup() {
    resizeCanvas();
    clearCanvas(new COLOR(0, 0, 0));


    circles = []
    num = 500
    xvariance = GL.canvas.width
    yvariance = GL.canvas.height

    for (let i = 0; i < num; i++) {
        XV = mapValue(Math.random(), 0, 1, 0, xvariance)
        YV = mapValue(Math.random(), 0, 1, 0, yvariance)
        x = XV
        y = YV
        C = coords(x, y)
        let __COLOR__ = new COLOR(
            mapValue(Math.random(), 0, 1, 200, 255),
            mapValue(Math.random(), 0, 1, 200, 255),
            mapValue(Math.random(), 0, 1, 200, 255),
        )
        circle_ = circle(C.x, C.y, mapValue(Math.random(), 0, 1, .001, .005), __COLOR__, 20, 0.95)
        circles.push(circle_)
    }

}












function circle(x, y, r, color, segmentCount, alpha){

    const vs = `
    attribute vec2 a_position;
    uniform float u_aspect;
    void main() {
        gl_Position = vec4(a_position.xy / vec2(u_aspect, 1.0), 0.0, 1.0);
    }
    `;

    // Fragment shader source code
    const fs = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        if (u_color.a == 0.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        } else {
            gl_FragColor = u_color;
        }
    }
    `;

    const program_ = createProgram_(vs, fs);

    // make an internal function to generate the vertex posotions

    function generateCircleVertices(x, y, r, segmentCount) {
        const vertices = [];
        for (let i = 0; i < segmentCount; i++) {
            const theta = (i / segmentCount) * Math.PI * 2;
            vertices.push(x + r * Math.cos(theta), y + r * Math.sin(theta));
        }
        return vertices;
    }

    const buffer = createBuffer(generateCircleVertices(x, y, r, segmentCount));

    createAttribute(buffer, program_, "a_position", 2, GL.FLOAT, false, 0, 0);

    const aspectUniformLocation = GL.getUniformLocation(program_, "u_aspect");
    GL.uniform1f(aspectUniformLocation, GL.canvas.width / GL.canvas.height);

    const colorUniformLocation = GL.getUniformLocation(program_, "u_color");
    
    COL = color._get()
    GL.uniform4f(colorUniformLocation, COL.r, COL.g, COL.b, alpha);

    // GL.polygonMode(GL.FRONT_AND_BACK, GL.FILL);

    render(program_, GL.TRIANGLE_FAN, segmentCount, 0);

    return {
        x: x,
        y: y,
        r: r,
        color: color,
        segmentCount: segmentCount,
        program: program_,
        buffer: buffer,
        alpha: alpha
    }
}


