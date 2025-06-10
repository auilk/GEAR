import VertexArray from "./core/vertex-array.js";
import WebGLContext from "./core/webgl-context.js";
import Shader from "./graphics/shader.js";
import Texture from "./graphics/texture.js";

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
        -1.0,  1.0, 0.0,    0.0, 1.0,
        -1.0, -1.0, 0.0,    0.0, 0.0,
         1.0, -1.0, 0.0,    1.0, 0.0,
         1.0,  1.0, 0.0,    1.0, 1.0
         
    ]);

    const indices = new Uint16Array([
        0, 1, 2,
        2, 3, 0
    ]);

    const VAO = new VertexArray();
    VAO.AddVertexBuffer("VBO", vertices);
    VAO.AddIndexBuffer("IBO", indices);
    VAO.AddAttrib("aPosition", "vec3");
    VAO.AddAttrib("aTexCoord", "vec2");
    VAO.SetLayout(shader.GetProgram());

    // Texture Source: Author: Philman401, LICNSE: CC0, URL: https://opengameart.org/content/simple-toon-wooden-crate-texture
    const texture01 = new Texture("../assets/textures/wooden-crate.png", shader, "uTexture01");

    // Texture Source: Author: xmorg; LICNSE: CC0; URL: https://opengameart.org/node/10617;
    const texture02 = new Texture("../assets/textures/brick-wall.png", shader, "uTexture02");
    
    const RenderLoop = () =>
    {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    
        requestAnimationFrame(RenderLoop);
    }
    
    requestAnimationFrame(RenderLoop);
    
    window.addEventListener("resize", ResizeCallback);
    ResizeCallback();
}

main();
