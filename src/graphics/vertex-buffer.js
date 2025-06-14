import WebGLContext from "../core/webgl-context.js";

class VertexBuffer
{
    #gl;
    #buffer;

    constructor(data, draw)
    {
        this.#gl = WebGLContext.GetContext();

        this.#buffer = this.#CreateBuffer(data, draw);
    }

    Bind()
    {
       this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#buffer);
    }

    Unbind()
    {
        this.#gl.bindBuffer(null);
    }

    Delete()
    {
        this.#gl.deleteBuffer(this.#buffer);
    }

    #CreateBuffer(data, draw)
    {
        const buffer = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, buffer);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, data, draw);
        
        return buffer;
    }
}

export default VertexBuffer;