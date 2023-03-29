

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

    randomColor(rLow = 0, rHigh = 255, gLow = 0, gHigh = 255, bLow = 0, bHigh = 255) {
        this.r = parseInt(mapValue(Math.random(), 0, 1, rLow, rHigh));
        this.g = parseInt(mapValue(Math.random(), 0, 1, gLow, gHigh));
        this.b = parseInt(mapValue(Math.random(), 0, 1, bLow, bHigh));
        return this;   
    }
    

}

function mapValue(val, low, high, range_low, range_high) {
    let inc = (range_high - range_low) / (high - low)
    return range_low + ((val - low) * inc)
}

function resizeCanvas(width = null, height = null) {

    if (width == null || height == null) {
        c.width = window.innerWidth - 100 - (cont.clientWidth);
        CANVASWIDTH = c.width
        c.height = window.innerHeight - 30;
        CANVASHEIGHT = c.height        
    }else{
        c.width = width;
        c.height = height;
    }
}

