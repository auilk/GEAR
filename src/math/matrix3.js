class Matrix3d
{
    constructor()
    {
        this.values = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    Translate(position)
    {
        this.values[6] += position.x * this.values[0] + position.y * this.values[3];
        this.values[7] += position.x * this.values[1] + position.y * this.values[4];
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

    Scale(scale)
    {
        this.values[0] *= scale.x;
        this.values[1] *= scale.y;

        this.values[3] *= scale.x;
        this.values[4] *= scale.y;
    }

    Clone()
    {
        const matrix = new Matrix3d();
        matrix.values.set(this.values);
        return matrix;
    }
}

export default Matrix3d;