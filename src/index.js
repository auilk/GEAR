import IndexBuffer from "./core/index-buffer.js";
import VertexArray from "./core/vertex-array.js";
import VertexBuffer from "./core/vertex-buffer.js";
import WebGLContext from "./core/webgl-context.js";
import Shader from "./graphics/shader.js";

const canvas = document.getElementById("webgl-canvas");

WebGLContext.Init(canvas);
const gl = WebGLContext.GetContext();

async function LoadShaderSrc(path)
{
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load shader: ${response.statusText}`)
    return await response.text();
}

function ResizeCallback()
{
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

async function main()
{
    const vertSrc = await LoadShaderSrc("./assets/shaders/vertex.vs");
    const fragSrc = await LoadShaderSrc("./assets/shaders/fragment.fs");

    const shader = new Shader(vertSrc, fragSrc);

    const vertices = new Float32Array([
         0.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0
    ]);

    const indices = new Uint32Array([
        0, 1, 2
    ]);

    const VAO = new VertexArray();
    VAO.AddVertexBuffer("VBO", vertices);
    VAO.AddIndexBuffer("IBO", indices);

    const aPosLoc = gl.getAttribLocation(shader.GetProgram(), "aPosition")
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosLoc);

    const RenderLoop = () =>
    {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_INT, 0);
    
        requestAnimationFrame(RenderLoop);
    }
    
    requestAnimationFrame(RenderLoop);
    
    window.addEventListener("resize", ResizeCallback);
    ResizeCallback();
}

main();
