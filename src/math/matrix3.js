class Matrix3
{
    constructor(values = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]))
    {
        this.values = values;
    }

    Translate(x, y)
    {
        this.values[6] += x * this.values[0] + y * this.values[3];
        this.values[7] += x * this.values[1] + y * this.values[4];
    }

    Rotate(deg) 
    {
        const rad = deg * (Math.PI / 180);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const a = this.values[0];
        const b = this.values[1];
        const c = this.values[3];
        const d = this.values[4];

        this.values[0] = a * cos + b * sin;
        this.values[1] = -a * sin + b * cos;

        this.values[3] = c * cos + d * sin;
        this.values[4] = -c * sin + d * cos;
    }

    Scale(x, y)
    {
        this.values[0] *= x;
        this.values[1] *= y;

        this.values[3] *= x;
        this.values[4] *= y;
    }

    Clone()
    {
        const matrix = new Matrix3d();
        matrix.values.set(this.values);
        return matrix;
    }
}

export default Matrix3;