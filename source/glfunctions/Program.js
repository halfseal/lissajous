export class Program {
    gl;
    id;

    constructor(gl, vs, fs) {
        this.gl = gl;

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vs);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(vertexShader));
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fs);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(fragmentShader));
        }

        this.id = gl.createProgram();
        gl.attachShader(this.id, vertexShader);
        gl.attachShader(this.id, fragmentShader);
        gl.linkProgram(this.id);
        gl.detachShader(this.id, vertexShader);
        gl.detachShader(this.id, fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
            const linkErrLog = gl.getProgramInfoLog(this.id);
            gl.useProgram(null);
            if (this.id)
                gl.deleteProgram(this.id);
            console.log(
                "Shader program did not link successfully. " + "Error log: " + linkErrLog
            );

            throw new Error("something went wrong");
        }
    }

    bind() {
        this.gl.useProgram(this.id);
    }

    unbind() {
        this.gl.useProgram(null);
    }

    uniform1f(name, f0) {
        this.bind();
        this.gl.uniform1f(this.gl.getUniformLocation(this.id, name), f0);
    }

    uniform2f(name, f0, f1) {
        this.bind();
        this.gl.uniform2f(this.gl.getUniformLocation(this.id, name), f0, f1);
    }

    uniform3f(name, f0, f1, f2) {
        this.bind();
        this.gl.uniform3f(this.gl.getUniformLocation(this.id, name), f0, f1, f2);
    }

    uniform4f(name, f0, f1, f2, f3) {
        this.bind();
        this.gl.uniform4f(this.gl.getUniformLocation(this.id, name), f0, f1, f2, f3);
    }

    uniform1i(name, i0) {
        this.bind();
        this.gl.uniform1i(this.gl.getUniformLocation(this.id, name), i0);
    }

    uniform2i(name, i0, i1) {
        this.bind();
        this.gl.uniform2i(this.gl.getUniformLocation(this.id, name), i0, i1);
    }

    uniform3i(name, i0, i1, i2) {
        this.bind();
        this.gl.uniform3i(this.gl.getUniformLocation(this.id, name), i0, i1, i2);
    }

    uniform4i(name, i0, i1, i2, i3) {
        this.bind();
        this.gl.uniform4i(this.gl.getUniformLocation(this.id, name), i0, i1, i2, i3);
    }

    uniform1ui(name, ui0) {
        this.bind();
        this.gl.uniform1ui(this.gl.getUniformLocation(this.id, name), ui0);
    }

    uniform2ui(name, ui0, ui1) {
        this.bind();
        this.gl.uniform2ui(this.gl.getUniformLocation(this.id, name), ui0, ui1);
    }

    uniform3ui(name, ui0, ui1, ui2) {
        this.bind();
        this.gl.uniform3ui(this.gl.getUniformLocation(this.id, name), ui0, ui1, ui2);
    }

    uniform4ui(name, ui0, ui1, ui2, ui3) {
        this.bind();
        this.gl.uniform4ui(this.gl.getUniformLocation(this.id, name), ui0, ui1, ui2, ui3);
    }

    uniform1fv(name, count, vec) {
        this.bind();
        this.gl.uniform1fv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniform2fv(name, count, vec) {
        this.bind();
        this.gl.uniform2fv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniform3fv(name, count, vec) {
        this.bind();
        this.gl.uniform3fv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniform4fv(name, vec) {
        this.bind();
        this.gl.uniform4fv(this.gl.getUniformLocation(this.id, name), vec);
    }

    uniform1iv(name, count, vec) {
        this.bind();
        this.gl.uniform1iv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniform2iv(name, count, vec) {
        this.bind();
        this.gl.uniform2iv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniform3iv(name, count, vec) {
        this.bind();
        this.gl.uniform3iv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniform4iv(name, count, vec) {
        this.bind();
        this.gl.uniform4iv(this.gl.getUniformLocation(this.id, name), count, vec);
    }

    uniformMat3(name, transpose, mat) {
        this.bind();
        this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.id, name), transpose, mat.valueOf());
    }

    uniformMat4(name, transpose, mat) {
        this.bind();
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.id, name), transpose, mat);
    }

}