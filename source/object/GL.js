import {Program} from "../glfunctions/Program.js"
import {status} from "./Status.js";

const {mat4, mat3, vec3, vec2} = glMatrix;

let gl;
let prog;

let id = 0;

export function glStart(canvas) {
    gl = canvas.getContext("webgl");
    initGLSetting();
    initVariables();
    initDrawFunc();
    window.requestAnimationFrame(loop);
}

const rad = Math.PI / 180.0;

let model_mx1 = mat4.create();
let model_mx2 = mat4.create();
let model_mx3 = mat4.create();

function update(delta) {
    let x = document.getElementById("Phi");

    let phi = x.value * rad;
    model_mx1[12] = 0.5 * (Math.cos(t));
    model_mx2[13] = 0.5 * (Math.cos(t + phi));

    model_mx3[12] = 0.5 * (Math.cos(t));
    model_mx3[13] = 0.5 * (Math.cos(t + phi));
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    prog.bind();

    let aspect = 1.0;
    let changeable_aspect = status.screen_size[0] / status.screen_size[1];
    let aspect_matrix =
        mat4.fromValues(Math.min(1.0 / changeable_aspect, 1.0 / aspect), 0, 0, 0,
            0, Math.min(changeable_aspect / aspect, 1.0), 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    prog.uniformMat4("aspect_mx", false, aspect_matrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, id);
    let pos = gl.getAttribLocation(prog.id, "position");
    gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos);

    prog.uniform1f("point_size", 10.0);

    prog.uniformMat4("model_mx", false, model_mx1);
    prog.uniform3fv("color", vec3.fromValues(0.2, 0.2, 1.0));
    gl.drawArrays(gl.POINTS, 0, 1);

    prog.uniformMat4("model_mx", false, model_mx2);
    prog.uniform3fv("color", vec3.fromValues(1.0, 0.2, 0.2));
    gl.drawArrays(gl.POINTS, 0, 1);

    prog.uniform1f("point_size", 20.0);

    prog.uniformMat4("model_mx", false, model_mx3);
    prog.uniform3fv("color", vec3.fromValues(0.2, 0.2, 0.2));
    gl.drawArrays(gl.POINTS, 0, 1);
}

function initGLSetting() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.lineWidth(1.0);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
}

function initVariables() {
    // mountain.readFile("./source/model/BaseSpiderMan.obj")

    prog = new Program(gl,
        document.querySelector("#h_vert").innerHTML,
        document.querySelector("#h_frag").innerHTML
    );

    let data = [0.0, 0.0, 0.0];

    id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, id);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
}

function initDrawFunc() {
}

let t = 0.0, t0 = 0.0;

function loop(time) {
    time *= 0.001;  // convert millisecond to second

    let t1 = time;
    let delta = t1 - t0;
    t += delta;

    update(delta);
    if (delta > 1.0 / 60.0) {
        render();
        t0 = t1;
    }
    window.requestAnimationFrame(loop);
}
