class FragmentShader
{
    static count = 1;
    static fsnippet = "";
    static bsnippet = "";

    static async LoadShaderSrc(path)
    {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to load shader: ${response.statusText}`)
        const data =  await response.text();
        return new FragmentShader(data);
    }

    constructor(src)
    {
        this.src = src;
        this.lines = this.#CountLines();
        this.id = FragmentShader.count++;
        
        FragmentShader.fsnippet += this.#ParseFuncSnippet();
        FragmentShader.bsnippet += this.#ParseBranchSnippet();
    }

    #ParseFuncSnippet()
    {
        let start = this.src.indexOf("void main()");
        let end = 0;
        if (start !== -1)
        {
            start = this.src.indexOf('{', start);
            end = this.src.indexOf('}', end);
        }

        return `vec4 id_${this.id}_main()\n{\n\tvec4 COLOR;` + this.src.slice(start + 1, end) + '\treturn COLOR;\n}\n';
    }

    #ParseBranchSnippet()
    {
        return `if (uSnippetID == ${this.id}) { COLOR = id_${this.id}_main(); }\n\t`;
    }

    #CountLines()
    {
        let position = this.src.indexOf('\n', 0);
        let lines = 1;
        while (position >= 0)
        {
            position = this.src.indexOf('\n', ++position);
            lines++;
        }
        return lines;
    }
}

export default FragmentShader;