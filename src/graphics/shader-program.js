import WebGLContext from "../core/webgl-context.js";

class ShaderProgram
{
    #gl;
    #vertShader;
    #fragShader;
    #program;

    constructor(vertSource, fragSource)
    {
        this.#gl = WebGLContext.GetContext();
        
        this.#vertShader = this.#CreateShader(vertSource, this.#gl.VERTEX_SHADER);
        this.#fragShader = this.#CreateShader(fragSource, this.#gl.FRAGMENT_SHADER);

        this.#program = this.#CreateProgram(this.#vertShader, this.#fragShader);

        this.#gl.useProgram(this.#program);
    }

    GetProgram()
    {
        return this.#program;
    }
    
    Bind()
    {
        this.#gl.useProgram(this.#program);
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

        this.#gl.deleteProgram(this.#program);
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
}

export default ShaderProgram;