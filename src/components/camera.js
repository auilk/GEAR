import Matrix3 from "../math/matrix3.js";
import Vector2 from "../math/vector2.js";

class Camera
{
    constructor(position = new Vector2(0.0, 0.0), rotAngle = 0, zoom = 1)
    {
        this.position = position;
        this.rotAngle = rotAngle;
        this.zoom = zoom;

        this.view = this.#UpdateView();

        this.projection = null;
    }

    #UpdateView()
    {
        const view = new Matrix3();
        view.Translate(-this.position.x, -this.position.y);
        view.Rotate(this.rotAngle);
        return view;
    }

    OrthoProjection(canvas, zoom = 1)
    {
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        const sx = (2 / width) * zoom;
        const sy = (-2 / height) * zoom;
        const tx = -1;
        const ty = 1;

        this.projection = new Matrix3(new Float32Array([sx, 0, 0, 0, sy, 0, tx, ty,  1]));
    }
}

export default Camera;