class FragmentShader
{
    static count = 0;
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

        return `void id_${this.id}_main()\n` + this.src.slice(start, end + 1) + '\n';
    }

    #ParseBranchSnippet()
    {
        return `if (uSnippetID == ${this.id}) { id_${this.id}_main(); }\n\t`;
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