import WebGLContext from "../core/webgl-context.js";

class ShaderProgram
{
    static id;
    static frags = [];

    
    static BuildShaderProgram()
    {
        let vertSrc =
        `#version 300 es
        #pragma vscode_glsllint_stage : vert
        precision mediump float;
    
        in vec2 aPosition;
    
        uniform mat3 uModel;
        uniform mat3 uView;
        uniform mat3 uProjection;
    
        void main()
        {
            gl_Position = vec4(uProjection * uView * uModel * vec3(aPosition, 1.0), 1.0);
        }`;
        
        let fragSrc = 
        `#version 300 es
        #pragma vscode_glsllint_stage : frag
        precision mediump float;
    
        out vec4 FragColor;
    
        uniform sampler2D uTexture01;
        uniform sampler2D uTexture02;
        uniform int uSnippetID;
    
        //SPLIT_HERE
    
        void main()
        {
            vec4 COLOR = vec4(1.0);
            //SPLIT_HERE
            FragColor = COLOR;
        }`;

        let fsnippetFs = "";
        let bsnippetFs = "";
        
        for (let i = 0; i < ShaderProgram.frags.length; i++)
        {
            fsnippetFs += ShaderProgram.#ParseFragFuncSnippet(ShaderProgram.frags[i].src, ShaderProgram.frags[i].id);
            bsnippetFs += ShaderProgram.#ParseFragBranchSnippet(ShaderProgram.frags[i].id);
        }
        fragSrc = fragSrc.split("//SPLIT_HERE");
        fragSrc = fragSrc[0] + fsnippetFs + fragSrc[1] + bsnippetFs + fragSrc[2];

        const vertShader = ShaderProgram.#CreateShader(vertSrc, WebGLContext.GetContext().VERTEX_SHADER);
        const fragShader = ShaderProgram.#CreateShader(fragSrc, WebGLContext.GetContext().FRAGMENT_SHADER);

        ShaderProgram.id = ShaderProgram.#CreateProgram(vertShader, fragShader);

        WebGLContext.GetContext().useProgram(ShaderProgram.id);
    }

    static #ParseFragFuncSnippet(src, id)
    {
        let start = src.indexOf("void main()");
        let end = 0;
        if (start !== -1)
        {
            start = src.indexOf('{', start);
            end = src.indexOf('}', end);
        }

        return `vec4 id_${id}_main()\n{\n\tvec4 COLOR;` + src.slice(start + 1, end) + '\treturn COLOR;\n}\n';
    }

    static #ParseFragBranchSnippet(id)
    {
        return `if (uSnippetID == ${id}) { COLOR = id_${id}_main(); }\n\t`;
    }

    static #CreateShader(source, type)
    {
        const shader = WebGLContext.GetContext().createShader(type);
        WebGLContext.GetContext().shaderSource(shader, source);
        WebGLContext.GetContext().compileShader(shader);

        if (!WebGLContext.GetContext().getShaderParameter(shader, WebGLContext.GetContext().COMPILE_STATUS))
        {
            const infoLog = WebGLContext.GetContext().getShaderInfoLog(shader);

            const typeName = type === WebGLContext.GetContext().VERTEX_SHADER ? "Vertex" : "Fragment";
            console.error(`${typeName} shader compilation has failed:\n${infoLog}`);
            
            WebGLContext.GetContext().deleteShader(shader);

            return null;
        }

        return shader;
    }

    static #CreateProgram(vertShader, fragShader)
    {
        const program = WebGLContext.GetContext().createProgram();
        WebGLContext.GetContext().attachShader(program, vertShader);
        WebGLContext.GetContext().attachShader(program, fragShader);
        WebGLContext.GetContext().linkProgram(program);

        if (!WebGLContext.GetContext().getProgramParameter(program, WebGLContext.GetContext().LINK_STATUS))
        {
            const infoLog = WebGLContext.GetContext().getProgramInfoLog(program);

            console.error(`Shader program linking has failder:\n${infoLog}`);
            
            WebGLContext.GetContext().deleteProgram(program);

            return null;
        }

        return program;
    }
}

export default ShaderProgram;