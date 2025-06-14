import WebGLContext from "../core/webgl-context.js";
import VertexBuffer from "./vertex-buffer.js"
import IndexBuffer from "./index-buffer.js";
import VertexAttrib from "./vertex-attrib.js";

class VertexArray
{
    #id;
    #buffers;
    #gl;
    #attribs

    constructor()
    {
        this.#gl = WebGLContext.GetContext();

        this.#Create(this.#gl);
        this.#buffers = new Map();
        this.#attribs = [];

        this.stride = 0;
    }

    AddVertexBuffer(name, data)
    {
        this.#buffers.set(name, new VertexBuffer(data, this.#gl.STATIC_DRAW));
    }

    AddIndexBuffer(name, data)
    {
        this.#buffers.set(name, new IndexBuffer(data, this.#gl.STATIC_DRAW));
    }

    AddAttrib(name, type)
    {
        const attrib = new VertexAttrib(name, type);
        attrib.offset = this.stride;
        this.stride += attrib.size;
        this.#attribs.push(attrib);
    }

    SetLayout(shader)
    {
        for (let i = 0; i < this.#attribs.length; i++)
        {
            const location = this.#gl.getAttribLocation(shader, this.#attribs[i].name);
            this.#gl.vertexAttribPointer(location, this.#attribs[i].count, this.#attribs[i].dataType, this.#attribs[i].normalised, this.stride, this.#attribs[i].offset);
            this.#gl.enableVertexAttribArray(location);
        }
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