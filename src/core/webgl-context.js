class WebGLContext
{
    /**@type {WebGLRenderingContext} */
    static #gl = null;

    static Init(canvas)
    {
        if (!WebGLContext.#gl)
        {
            WebGLContext.#gl = canvas.getContext("webgl2");
            if (!WebGLContext.#gl)
            {
                console.error("WebGL is not supported or failed to initialise.")
            }
        }
    }

    static GetContext()
    {
        return WebGLContext.#gl;
    }
}

export default WebGLContext;