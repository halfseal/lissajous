// planet texture from http://planetpixelemporium.com/earth.html


export class Texture {
    gl;
    id;

    constructor(gl, path, need_flip = false) {
        this.gl = gl;

        let id = gl.createTexture();
        this.id = id;

        gl.bindTexture(gl.TEXTURE_2D, id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255]));
        gl.bindTexture(gl.TEXTURE_2D, null);

        let image = new Image();
        image.onload = e => {
            console.log("Successfully loaded " + image.src);

            gl.bindTexture(gl.TEXTURE_2D, id);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, need_flip);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            let isPowerOf2 = value => (value & (value - 1)) === 0;
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }

            gl.bindTexture(gl.TEXTURE_2D, null);
        };

        image.onerror = function () {
            alert("Failed loading " + image.src)
        };

        image.src = path;
    }
}