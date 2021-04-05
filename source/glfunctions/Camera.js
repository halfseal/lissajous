const oneDegRad = Math.PI / 180.0;

function toRad(num) {
    return num * oneDegRad;
}

class Camera {
    eye = glMatrix.vec3.fromValues(0.0, 0.0, 10.0);
    up = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);

    yaw = -90.0;
    pitch = 0.0;

    aspect = 1.0;
    fov = 45.0;
    dNear = 1.0;
    dFar = 1000.0;

    xyz_to_rhc = glMatrix.mat4.fromValues(
        0, 1, 0, 0,
        0, 0, 1, 0,
        1, 0, 0, 0,
        0, 0, 0, 1
    );

    get_front() {
        let x = Math.cos(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
        let y = Math.sin(toRad(this.pitch));
        let z = Math.sin(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
        let xyz = glMatrix.vec3.fromValues(x, y, z);
        xyz = glMatrix.vec3.normalize(glMatrix.vec3.create(), xyz);
        return xyz;
    }

    get_view() {
        return glMatrix.mat4.lookAt(
            glMatrix.mat4.create(),
            this.eye,
            glMatrix.vec3.add(glMatrix.vec3.create(), this.eye, this.get_front()),
            this.up
        );
    }

    get_proj() {
        return glMatrix.mat4.perspective(
            glMatrix.mat4.create(),
            toRad(this.fov),
            this.aspect,
            this.dNear,
            this.dFar
        );
    }
}

class Mouse {
    isClicked = false;
    firstMouse = true;
    lastX = 0.0;
    lastY = 0.0;

    start() {
        this.isClicked = true;
        this.firstMouse = true;
    }

    move(x, y, cam) {
        if (!this.isClicked) return;

        if (this.firstMouse) {
            this.lastX = x;
            this.lastY = y;
            this.firstMouse = false;
        }

        let xOffset = x - this.lastX;
        let yOffset = this.lastY - y;
        this.lastX = x;
        this.lastY = y;

        let sensitivity = 0.1;
        xOffset *= sensitivity;
        yOffset *= sensitivity;

        cam.yaw += xOffset;
        cam.pitch += yOffset;

        if (cam.pitch > 89.0) cam.pitch = 89.0;
        if (cam.pitch < -89.0) cam.pitch = -89.0;
    }

    end() {
        this.isClicked = false;
    }
}

class Keyboard {
    is_w_pressed = false;
    is_a_pressed = false;
    is_s_pressed = false;
    is_d_pressed = false;

    is_down_pressed = false;
    is_up_pressed = false;

    usingKeyboard = false;

    reset() {
        this.is_w_pressed = false;
        this.is_a_pressed = false;
        this.is_s_pressed = false;
        this.is_d_pressed = false;

        this.is_down_pressed = false;
        this.is_up_pressed = false;
    }

    changeStatus(button, status) {
        if (button === "w") {
            key.is_w_pressed = status;
        } else if (button === "a") {
            key.is_a_pressed = status;
        } else if (button === "s") {
            key.is_s_pressed = status;
        } else if (button === "d") {
            key.is_d_pressed = status;
        } else if (button === "ArrowDown") {
            key.is_down_pressed = status;
        }else if (button === "ArrowUp") {
            key.is_up_pressed = status;
        }
    }

    update(delta, cam) {
        const efficient = 10 * delta;
        if (this.is_w_pressed || this.is_s_pressed) {
            let adder = glMatrix.vec3.scale(glMatrix.vec3.create(), cam.get_front(), efficient);

            if (this.is_w_pressed)
                cam.eye = glMatrix.vec3.add(glMatrix.vec3.create(), cam.eye, adder);
            if (this.is_s_pressed)
                cam.eye = glMatrix.vec3.subtract(glMatrix.vec3.create(), cam.eye, adder);

        }
        if (this.is_a_pressed || this.is_d_pressed) {
            let vec = glMatrix.vec3.normalize(glMatrix.vec3.create(),
                glMatrix.vec3.cross(glMatrix.vec3.create(), cam.get_front(), cam.up));
            let adder = glMatrix.vec3.scale(glMatrix.vec3.create(), vec, efficient);

            if (this.is_a_pressed)
                cam.eye = glMatrix.vec3.subtract(glMatrix.vec3.create(), cam.eye, adder);
            if (this.is_d_pressed)
                cam.eye = glMatrix.vec3.add(glMatrix.vec3.create(), cam.eye, adder);
        }
        if (this.is_down_pressed)
            cam.eye[1] -= efficient;
        if (this.is_up_pressed)
            cam.eye[1] += efficient;
    }
}

export let cam = new Camera();
export let mouse = new Mouse();
export let key = new Keyboard();