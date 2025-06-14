import WebGLContext from "../core/webgl-context.js";
import Matrix3 from "../math/matrix3.js";
import Vector2 from "../math/vector2.js";

class Camera
{
    #position;
    #rotation;
    #zoom;
    #view;
    #projection;
    #width;
    #height;

    constructor(width = 512, height = 512, position = new Vector2(0.0, 0.0), rotation = 0, zoom = 1)
    {
        this.#position = position;
        this.#rotation = rotation;
        this.#zoom = zoom;
        this.#width = width;
        this.#height = height;

        this.#view = this.#UpdateView();
        this.#projection = this.#UpdateProjection();
    }

    set position(newPos)
    {
        this.#position = newPos;
        this.#view = this.#UpdateView();
    }

    set rotation(newRot)
    {
        this.#rotation = newRot;
        this.#view = this.#UpdateView();
    }

    set zoom(newZoom)
    {
        this.#zoom = newZoom;
        this.#projection = this.#UpdateProjection();
    }

    set width(newWidth)
    {
        this.#width = newWidth;
        this.#projection = this.#UpdateProjection();
    }

    set height(newHeight)
    {
        this.#height = newHeight;
        this.#projection = this.#UpdateProjection();
    }

    get position() { return this.#position; }
    get rotation() { return this.#rotation; }
    get zoom() { return this.#zoom; }
    get width() { return this.#width; }
    get height() { return this.#height; }
    get view() { return this.#view; }
    get projection() { return this.#projection; }

    #UpdateView()
    {
        const view = new Matrix3();
        view.Translate(-this.#position.x, -this.#position.y);
        view.Rotate(this.#rotation);
        return view;
    }

    #UpdateProjection()
    {
        const sx = (2 / this.#width) * this.#zoom;
        const sy = (-2 / this.#height) * this.#zoom;
        const tx = -1;
        const ty = 1;

        return new Matrix3(new Float32Array([sx, 0, 0, 0, sy, 0, tx, ty,  1]));
    }
}

export default Camera;