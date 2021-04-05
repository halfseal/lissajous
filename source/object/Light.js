const {mat4, mat3, vec4, vec3, vec2} = glMatrix;

export class Light {
    MAX_LIGHT = 16;
    num_lights;
    Data = class {
        pos = vec4.create();
        color = vec4.create();
    }

    data;

    constructor(numLights = 1) {
        this.num_lights = numLights;
        this.data = new Array(numLights).fill(new this.Data());
        this.data[0].pos = vec4.fromValues(5, 5, 5, 1);
        this.data[0].color = vec4.fromValues(0.8, 0.7, 0.6, 1.0);
    }

    update(delta) {

    }

    draw(prog, view_mx) {
        prog.bind();
        prog.uniform1i("num_lights", this.num_lights);
        for (let i = 0; i < this.num_lights; i++) {
            let light__ = "lights[" + i.toString() + "]";

            let pos = this.data[i].pos;
            let eye_coord_light = vec4.fromValues(
                pos[0] * view_mx[0] + pos[1] * view_mx[4] + pos[2] * view_mx[8] + pos[3] * view_mx[12],
                pos[0] * view_mx[1] + pos[1] * view_mx[5] + pos[2] * view_mx[9] + pos[3] * view_mx[13],
                pos[0] * view_mx[2] + pos[1] * view_mx[6] + pos[2] * view_mx[10] + pos[3] * view_mx[14],
                pos[0] * view_mx[3] + pos[1] * view_mx[7] + pos[2] * view_mx[11] + pos[3] * view_mx[15]
            );

            prog.uniform4fv(light__ + ".pos", eye_coord_light);
            // prog.uniform4fv(light__ + ".pos", this.data[i].pos);
            prog.uniform4fv(light__ + ".color", this.data[i].color);
        }
    }
}