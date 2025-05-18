const canvas = document.getElementById("webgl-canvas");

/**@type {WebGL2RenderingContext} */
const gl = canvas.getContext("webgl2");
if (!gl)
{
    console.error("WebGL2 not supported: Update your browser or use a compatible device.");
}

function RenderLoop()
{
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(RenderLoop);
}

requestAnimationFrame(RenderLoop);