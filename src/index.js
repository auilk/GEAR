import FragmentShader from "./graphics/fragment-shader.js";
import ShaderProgram from "./graphics/shader-program.js";
import WebGLContext from "./core/webgl-context.js";
import VertexArray from "./graphics/vertex-array.js";
import Camera from "./components/camera.js";
import Matrix3 from "./math/matrix3.js";

const canvas = document.getElementById("webgl-canvas");

WebGLContext.Init(canvas);
const gl = WebGLContext.GetContext();

async function main()
{
    const frag01 = await FragmentShader.LoadShaderSrc("./assets/shaders/red.glsl");
    const frag02 = await FragmentShader.LoadShaderSrc("./assets/shaders/green.glsl");
    const frag03 = await FragmentShader.LoadShaderSrc("./assets/shaders/yellow.glsl");
    const frag04 = await FragmentShader.LoadShaderSrc("./assets/shaders/blue.glsl");

    ShaderProgram.BuildShaderProgram();
    
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
    VAO.SetLayout(ShaderProgram.id);

    const cam = new Camera(canvas.offsetWidth, canvas.offsetHeight);

    const RenderLoop = () =>
    {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        cam.width = canvas.offsetWidth;
        cam.height = canvas.offsetHeight;
        gl.uniformMatrix3fv(gl.getUniformLocation(ShaderProgram.id, "uView"), false, cam.view.values);
        gl.uniformMatrix3fv(gl.getUniformLocation(ShaderProgram.id, "uProjection"), false, cam.projection.values);

        
        let model = new Matrix3();
        model.Translate(canvas.offsetWidth / 5, canvas.offsetHeight / 2);
        model.Scale(128, 128);
        gl.uniformMatrix3fv(gl.getUniformLocation(ShaderProgram.id, "uModel"), false, model.values);
        gl.uniform1i(gl.getUniformLocation(ShaderProgram.id, "uSnippetID"), frag01.id);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        model = new Matrix3();
        model.Translate(canvas.offsetWidth / 5 * 2, canvas.offsetHeight / 2);
        model.Scale(128, 128);
        gl.uniformMatrix3fv(gl.getUniformLocation(ShaderProgram.id, "uModel"), false, model.values);
        gl.uniform1i(gl.getUniformLocation(ShaderProgram.id, "uSnippetID"), frag02.id);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        model = new Matrix3();
        model.Translate(canvas.offsetWidth / 5 * 3, canvas.offsetHeight / 2);
        model.Scale(128, 128);
        gl.uniformMatrix3fv(gl.getUniformLocation(ShaderProgram.id, "uModel"), false, model.values);
        gl.uniform1i(gl.getUniformLocation(ShaderProgram.id, "uSnippetID"), frag03.id);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        model = new Matrix3();
        model.Translate(canvas.offsetWidth / 5 * 4, canvas.offsetHeight / 2);
        model.Scale(128, 128);
        gl.uniformMatrix3fv(gl.getUniformLocation(ShaderProgram.id, "uModel"), false, model.values);
        gl.uniform1i(gl.getUniformLocation(ShaderProgram.id, "uSnippetID"), frag04.id);
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