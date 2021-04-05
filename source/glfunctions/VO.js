const {mat4, mat3, vec3, vec2} = glMatrix;

export class Vertex {
    pos;
    norm;
    tc;
    tan = vec3.create();

    constructor(pos = vec3.create(), norm = vec3.create(), tc = vec2.create()) {
        this.pos = pos;
        this.norm = norm;
        this.tc = tc;
    }
}

export class VO {
    id = 0;
    gl;

    constructor(gl, prog, vertices, indices, indexType) {
        this.gl = gl;

        let tan1 = new Array(vertices.length).fill(vec3.create());

        for (let i = 0; i < indices.length; i += 3) {
            let v0 = vertices[indices[i + 0]].pos;
            let v1 = vertices[indices[i + 1]].pos;
            let v2 = vertices[indices[i + 2]].pos;

            let u0 = vertices[indices[i + 0]].tc;
            let u1 = vertices[indices[i + 1]].tc;
            let u2 = vertices[indices[i + 2]].tc;

            let dv1 = vec3.subtract(vec3.create(), v1, v0);
            let dv2 = vec3.subtract(vec3.create(), v2, v0);

            let du1 = vec2.subtract(vec2.create(), u1, u0);
            let du2 = vec2.subtract(vec2.create(), u2, u0);

            // r : determinant
            // https://learnopengl.com/Advanced-Lighting/Normal-Mapping
            let r = 1.0 / (du1[0] * du2[1] - du2[0] * du1[1]);
            let tan = vec3.scale(
                vec3.create(),
                vec3.subtract(vec3.create(),
                    vec3.scale(vec3.create(), dv1, du2[1]),
                    vec3.scale(vec3.create(), dv2, du1[1])
                ),
                r
            );

            tan1[indices[i + 0]] = vec3.add(vec3.create(), tan1[indices[i + 0]], tan);
            tan1[indices[i + 1]] = vec3.add(vec3.create(), tan1[indices[i + 1]], tan);
            tan1[indices[i + 2]] = vec3.add(vec3.create(), tan1[indices[i + 2]], tan);
        }

        for (let i = 0; i < vertices.length; i++) {
            let n = vertices[i].norm;
            let t = tan1[i];

            let dotTN = vec3.dot(t, n);
            let nDotTN = vec3.scale(vec3.create(), n, dotTN);
            vec3.subtract(nDotTN, t, nDotTN);
            vec3.normalize(vertices[i].tan, nDotTN);
        }

        let data = [];
        for (let i = 0; i < indices.length; i++) {
            let pos = vertices[indices[i]].pos;
            let norm = vertices[indices[i]].norm;
            let tex = vertices[indices[i]].tc;
            let tan = vertices[indices[i]].tan;

            data.push(pos[0], pos[1], pos[2]);
            data.push(norm[0], norm[1], norm[2]);
            data.push(tex[0], tex[1]);
            data.push(tan[0], tan[1], tan[2]);
        }

        prog.bind();
        this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    bind(prog) {
        let gl = this.gl;

        prog.bind();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);

        let pos = gl.getAttribLocation(prog.id, "position");
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 11 * 4, 0);
        gl.enableVertexAttribArray(pos);

        pos = gl.getAttribLocation(prog.id, "normal");
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 11 * 4, 3 * 4);
        gl.enableVertexAttribArray(pos);

        pos = gl.getAttribLocation(prog.id, "texcoord");
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 11 * 4, 6 * 4);
        gl.enableVertexAttribArray(pos);

        pos = gl.getAttribLocation(prog.id, "tangent");
        gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 11 * 4, 8 * 4);
        gl.enableVertexAttribArray(pos);
    }

    unbind() {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.disableVertexAttribArray(0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.disableVertexAttribArray(3);
    }
}

/**
 example :

 let vertices =
 [
 [1.0, 1.0, 0.0],
 [-1.0, 1.0, 0.0],
 [-1.0, -1.0, 0.0],
 [1.0, -1.0, 0.0],
 ];

 let normal =
 [
 [0.0, 0.0, 1.0],
 [0.0, 0.0, 1.0],
 [0.0, 0.0, 1.0],
 [0.0, 0.0, 1.0],
 ];

 let texcoord =
 [
 [1.0, 1.0],
 [0.0, 1.0],
 [0.0, 0.0],
 [1.0, 0.0]
 ];

 let indices = [0, 1, 2, 0, 2, 3];

 vao = new VO(gl, program, vertices, normal, texcoord, indices);
 */