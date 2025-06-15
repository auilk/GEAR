import FragmentShader from "./graphics/fragment-shader.js";
import ShaderProgram from "./graphics/shader-program.js";
import WebGLContext from "./core/webgl-context.js";
import VertexArray from "./graphics/vertex-array.js";

const canvas = document.getElementById("webgl-canvas");

WebGLContext.Init(canvas);
const gl = WebGLContext.GetContext();

async function LoadShaderSrc(path)
{
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load shader: ${response.statusText}`)
    return await response.text();
}

async function main()
{
    const vert01 = await FragmentShader.LoadShaderSrc("./assets/shaders/test01.shdr");
    const vert02 = await FragmentShader.LoadShaderSrc("./assets/shaders/test02.shdr");

    const vertSrc = await LoadShaderSrc("./assets/shaders/vertex.vs");
    const fragSrc = await LoadShaderSrc("./assets/shaders/fragment.fs");

    const shader = new ShaderProgram(vertSrc, fragSrc);

    const vertices = new Float32Array([
        -1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
         1.0,  1.0         
    ]);

    const indices = new Uint16Array([
        0, 1, 2,
        2, 3, 0
    ]);

    const VAO = new VertexArray();
    VAO.AddVertexBuffer("VBO", vertices);
    VAO.AddIndexBuffer("IBO", indices);
    VAO.AddAttrib("aPosition", "vec2");
    VAO.SetLayout(shader.GetProgram());

    const RenderLoop = () =>
    {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    
        requestAnimationFrame(RenderLoop);
    }
    requestAnimationFrame(RenderLoop);

    const ResizeCallback = () =>
    {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    ResizeCallback();

    window.addEventListener("resize", ResizeCallback);
}

main();