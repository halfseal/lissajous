import {VO, Vertex} from "../glfunctions/VO.js";
import {Program} from "../glfunctions/Program.js";

const {mat4, mat3, vec3, vec2} = glMatrix;

export class Skybox {
    texID = null;
    gl;
    prog;
    vo;

    scale_mx = mat4.create();
    rotate_mx = mat4.create();
    trans_mx = mat4.create();

    vertices = [];
    indices = [];

    getSRT() {
        let res = glMatrix.mat4.multiply(mat4.create(), this.scale_mx, mat4.create());
        res = glMatrix.mat4.multiply(mat4.create(), this.rotate_mx, res);
        return glMatrix.mat4.multiply(mat4.create(), this.trans_mx, res);
    }

    update(delta) {
        mat4.rotate(this.rotate_mx, this.rotate_mx, delta / 30,
            vec3.normalize(vec3.create(), vec3.fromValues(0.0, 10.0, 3.0)));
    }

    constructor(gl, path, faces) {
        this.prog = new Program(gl,
            document.querySelector("#skybox_vert").innerHTML,
            document.querySelector("#skybox_frag").innerHTML
        );

        this.gl = gl;

        let id = gl.createTexture();
        this.texID = id;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, id);
        for (let i = 0; i < 6; i++) {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        let isLoaded = new Array(6).fill(false);
        let setTexParam = () => {
            if (isLoaded[0] && isLoaded[1] && isLoaded[2] && isLoaded[3] && isLoaded[4] && isLoaded[5]) {
                console.log("Successfully loaded skybox");
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, id);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
        }

        for (let i = 0; i < faces.length; i++) {
            faces[i] = path + faces[i];

            let image = new Image();
            image.onload = e => {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, id);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, image);
                isLoaded[i] = true;
                setTexParam();
                gl.bindTexture(gl.TEXTURE_2D, null);
            }

            image.onerror = () => {
                alert("Failed loading " + image.src)
            }

            image.src = faces[i];
        }

        this.vertices = [
            new Vertex(vec3.fromValues(20, 20, 20)),
            new Vertex(vec3.fromValues(20, 20, -20)),
            new Vertex(vec3.fromValues(20, -20, 20)),
            new Vertex(vec3.fromValues(20, -20, -20)),
            new Vertex(vec3.fromValues(-20, 20, 20)),
            new Vertex(vec3.fromValues(-20, 20, -20)),
            new Vertex(vec3.fromValues(-20, -20, 20)),
            new Vertex(vec3.fromValues(-20, -20, -20))
        ];

        this.indices = [
            5, 7, 3, 3, 1, 5,
            6, 7, 5, 5, 4, 6,
            3, 2, 0, 0, 1, 3,
            6, 4, 0, 0, 2, 6,
            5, 1, 0, 0, 4, 5,
            7, 6, 3, 3, 6, 2
        ];

        this.vo = new VO(gl, this.prog, this.vertices, this.indices);
    }
}