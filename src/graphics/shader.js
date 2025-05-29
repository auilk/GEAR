class Shader
{
    #gl;
    #vertShader;
    #fragShader;

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {string} vertSource 
     * @param {string} fragSource 
     */
    constructor(gl, vertSource, fragSource)
    {
        this.#gl = gl;

        this.#vertShader = this.#CreateShader(vertSource, gl.VERTEX_SHADER);
        this.#fragShader = this.#CreateShader(fragSource, gl.FRAGMENT_SHADER);

        this.program = this.#CreateProgram(this.#vertShader, this.#fragShader);
    }

    #CreateShader(source, type)
    {
        const shader = this.#gl.createShader(type);
        this.#gl.shaderSource(shader, source);
        this.#gl.compileShader(shader);

        if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS))
        {
            const infoLog = this.#gl.getShaderInfoLog(shader);

            const typeName = type === this.#gl.VERTEX_SHADER ? "Vertex" : "Fragment";
            console.error(`${typeName} shader compilation has failed:\n${infoLog}`);
            
            this.#gl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    #CreateProgram(vertShader, fragShader)
    {
        const program = this.#gl.createProgram();
        this.#gl.attachShader(program, vertShader);
        this.#gl.attachShader(program, fragShader);
        this.#gl.linkProgram(program);

        if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS))
        {
            const infoLog = this.#gl.getProgramInfoLog(program);

            console.error(`Shader program linking has failder:\n${infoLog}`);
            
            this.#gl.deleteProgram(program);

            return null;
        }

        return program;
    }

    Bind()
    {
        this.#gl.useProgram(this.program);
    }

    Unbind()
    {
        this.#gl.useProgram(0);
    }

    Delete()
    {
        this.#gl.detachShader(this.#vertShader);
        this.#gl.detachShader(this.#fragShader);

        this.#gl.deleteShader(this.#vertShader);
        this.#gl.deleteShader(this.#fragShader);

        this.#gl.deleteProgram(this.program);
    }
}

export default Shader;