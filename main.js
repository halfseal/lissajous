import {glStart} from "./source/object/GL.js"
import {status} from "./source/object/Status.js";

let canvas;
let container;

window.onload = function () {

    canvas = document.querySelector("#glCanvas");
    container = document.querySelector("#glContainer");

    window.onresize(undefined);
    console.log("screen size: " + canvas.width + " * " + canvas.height);

    glStart(canvas);
};

window.onresize = function () {
    let width = (container.clientWidth * window.devicePixelRatio);
    let height = (container.clientHeight * window.devicePixelRatio);

    canvas.width = width;
    canvas.height = height;

    status.screen_size[0] = width;
    status.screen_size[1] = height;

    const gl = canvas.getContext("webgl");
    gl.viewport(0, 0, width, height);
};



