const canvas = document.getElementById("webgl-canvas");

/**@type {WebGL2RenderingContext} */
const gl = canvas.getContext("webgl2");
if (!gl)
{
    console.error("WebGL2 not supported: Update your browser or use a compatible device.");
}

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
    
    console.log(vertSrc);
    console.log(fragSrc);
    
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertSrc);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        const infoLog = gl.getShaderInfoLog(vertexShader);
        console.error("Vertex Shader Compilation Error: " + infoLog);
    }
    
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragSrc);
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

    const vertices = new Float32Array([
         0.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0
    ]);

    const indices = new Uint32Array([
        0, 1, 2
    ]);

    const VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);

    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const aPosLoc = gl.getAttribLocation(shaderProgram, "aPosition")
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
