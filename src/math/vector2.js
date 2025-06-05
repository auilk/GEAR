class Vector2
{
    static UP = new Vector2(0, 1);
    static RIGHT = new Vector2(1, 0);

    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }

    Add(other)
    {
        if (other instanceof Vector2)
        {
            const x = this.x + other.x;
            const y = this.y + other.y;
            return new Vector2(x, y);
        }
        else if (typeof other === "number")
        {
            const x = this.x + other;
            const y = this.y + other;
            return new Vector2(x, y);
        }
    }

    Subtract(other)
    {
        if (other instanceof Vector2)
        {
            const x = this.x - other.x;
            const y = this.y - other.y;
            return new Vector2(x, y);
        }
        else if (typeof other === "number")
        {
            const x = this.x - other;
            const y = this.y - other;
            return new Vector2(x, y);
        }
    }

    Multiply(other)
    {
        if (other instanceof Vector2)
        {
            const x = this.x * other.x;
            const y = this.y * other.y;
            return new Vector2(x, y);
        }
        else if (typeof other === "number")
        {
            const x = this.x * other;
            const y = this.y * other;
            return new Vector2(x, y);
        }
    }

    Divide(other)
    {
        if (other instanceof Vector2)
        {
            const x = this.x / other.x;
            const y = this.y / other.y;
            return new Vector2(x, y);
        }
        else if (typeof other === "number")
        {
            const x = this.x / other;
            const y = this.y / other;
            return new Vector2(x, y);
        }
    }

    Length()
    {
        const len = Math.sqrt(this.x * this.x + this.y * this.y);
        return len;
    }

    Normalise()
    {
        const len = this.Length();
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(this.x / len, this.y / len);
    }

    Clone(other)
    {
        return new Vector2(other.x, other.y);
    }
    
}

export default Vector2