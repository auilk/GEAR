const canvas = document.getElementById("webgl-canvas");

/**@type {WebGL2RenderingContext} */
const gl = canvas.getContext("webgl2");
if (!gl)
{
    console.error("WebGL2 not supported: Update your browser or use a compatible device.");
}

const vertSource = 
`   #version 300 es
    precision mediump float;

    in vec3 aPosition;

    void main()
    {
        gl_Position = vec4(aPosition, 1.0);
    }
`;

const fragSource =
`   #version 300 es
    precision mediump float;

    out vec4 FragColor;

    void main()
    {
        FragColor = vec4(1.0);
    }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertSource);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
{
    const infoLog = gl.getShaderInfoLog(vertexShader);
    console.error("Vertex Shader Compilation Error: " + infoLog);
}

const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragSource);
gl.compileShader(fragShader);

if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
{
    const infoLog = gl.getShaderInfoLog(fragShader);
    console.error("Fragment Shader Compilation Error: " + infoLog);
}

const shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
{
    const infoLog = gl.getProgramInfoLog(shaderProgram);
    console.error("Shader Program Linking Error: " + infoLog);
}

gl.detachShader(shaderProgram, vertexShader);
gl.detachShader(shaderProgram, fragShader);

gl.deleteShader(vertexShader);
gl.deleteShader(fragShader);

gl.useProgram(shaderProgram);

function RenderLoop()
{
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(RenderLoop);
}

requestAnimationFrame(RenderLoop);