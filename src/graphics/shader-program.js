import WebGLContext from "../core/webgl-context.js";
import FragmentShader from "./fragment-shader.js";

class ShaderProgram
{
    #gl;
    #vertShader;
    #vertSrc;
    #fragShader;
    #fragSrc;
    #program;
    #fsnippetFs;
    #bsnippetFs

    constructor()
    {
        this.#gl = WebGLContext.GetContext();

        this.#vertSrc =
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

        this.#fragSrc = 
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

        this.#fsnippetFs = "";
        this.#bsnippetFs = "";

        this.#AssembleShader(); 
        
        this.#vertShader = this.#CreateShader(this.#vertSrc, this.#gl.VERTEX_SHADER);
        this.#fragShader = this.#CreateShader(this.#fragSrc, this.#gl.FRAGMENT_SHADER);

        this.#program = this.#CreateProgram(this.#vertShader, this.#fragShader);

        this.#gl.useProgram(this.#program);
    }

    GetProgram()
    {
        return this.#program;
    }
    
    Bind()
    {
        this.#gl.useProgram(this.#program);
    }

    Unbind()
    {
        this.#gl.useProgram(0);
    }

    Delete()
    {
        this.#gl.detachShader(this.#vertShader);
        this.#gl.detachShader(this.#fragShader);

        this.#gl.deleteShader(this.#vertShader);
        this.#gl.deleteShader(this.#fragShader);

        this.#gl.deleteProgram(this.#program);
    }

    #ParseFragFuncSnippet(src, id)
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

    #ParseFragBranchSnippet(id)
    {
        return `if (uSnippetID == ${id}) { COLOR = id_${id}_main(); }\n\t`;
    }

    #AssembleShader()
    {
        for (let i = 0; i < FragmentShader.frags.length; i++)
        {
            this.#fsnippetFs += this.#ParseFragFuncSnippet(FragmentShader.frags[i].src, FragmentShader.frags[i].id);
            this.#bsnippetFs += this.#ParseFragBranchSnippet(FragmentShader.frags[i].id);
        }
        this.#fragSrc = this.#fragSrc.split("//SPLIT_HERE");
        this.#fragSrc = this.#fragSrc[0] + this.#fsnippetFs + this.#fragSrc[1] + this.#bsnippetFs + this.#fragSrc[2];
    }

    #CreateShader(source, type)
    {
        const shader = this.#gl.createShader(type);
        this.#gl.shaderSource(shader, source);
        this.#gl.compileShader(shader);

        if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS))
        {
            const infoLog = this.#gl.getShaderInfoLog(shader);

            const typeName = type === this.#gl.VERTEX_SHADER ? "Vertex" : "Fragment";
            console.error(`${typeName} shader compilation has failed:\n${infoLog}`);
            
            this.#gl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    #CreateProgram(vertShader, fragShader)
    {
        const program = this.#gl.createProgram();
        this.#gl.attachShader(program, vertShader);
        this.#gl.attachShader(program, fragShader);
        this.#gl.linkProgram(program);

        if (!this.#gl.getProgramParameter(program, this.#gl.LINK_STATUS))
        {
            const infoLog = this.#gl.getProgramInfoLog(program);

            console.error(`Shader program linking has failder:\n${infoLog}`);
            
            this.#gl.deleteProgram(program);

            return null;
        }

        return program;
    }
}

export default ShaderProgram;