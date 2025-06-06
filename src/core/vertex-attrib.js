class VertexAttrib
{
    constructor(name, type, normalised = false)
    {
        this.name = name;
        this.normalised = normalised;
        this.offset = 0;

        switch (type)
        {
            case "float":
                this.size = 4;
                this.count = 1;
                this.dataType = 0x1406;
                break;
            case "vec2":
                this.size = 8;
                this.count = 2;
                this.dataType = 0x1406;
                break;
            case "vec3":
                this.size = 12;
                this.count = 3;
                this.dataType = 0x1406;
                break;
            case "vec4":
                this.size = 16;
                this.count = 4;
                this.dataType = 0x1406;  
                break;
        }
    }
}

export default VertexAttrib;