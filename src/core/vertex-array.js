import WebGLContext from "./webgl-context.js";
import VertexBuffer from "./vertex-buffer.js"
import IndexBuffer from "./index-buffer.js";

class VertexArray
{
    #id;
    #buffers;
    #gl;

    constructor()
    {
        this.#gl = WebGLContext.GetContext();

        this.#Create(this.#gl);
        this.#buffers = new Map();
    }

    AddVertexBuffer(name, data)
    {
        this.#buffers.set(name, new VertexBuffer(data, this.#gl.STATIC_DRAW));
    }

    AddIndexBuffer(name, data)
    {
        this.#buffers.set(name, new IndexBuffer(data, this.#gl.STATIC_DRAW));
    }

    GetBuffer(name)
    {
        this.#buffers.get(name);
    }

    DeleteBuffer(name)
    {
        this.#buffers.get(name).Delete();
        this.#buffers.delete(name);
    }

    Bind()
    {
        this.#gl.bindVertexArray(this.#id);
    }

    Unbind()
    {
        this.#gl.bindVertexArray(null);
    }

    #Create()
    {
        this.#id = this.#gl.createVertexArray();
        this.#gl.bindVertexArray(this.#id);
    }
}

export default VertexArray