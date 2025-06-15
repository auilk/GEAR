class FragmentShader
{
    static frags = [];

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

        FragmentShader.frags.push(this);
        this.id = FragmentShader.frags.length;
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