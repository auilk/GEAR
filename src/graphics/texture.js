import WebGLContext from "../core/webgl-context.js"

class Texture
{
    static SHARP = { min: 0x2600, mag: 0x2600, mipmap: false, anisotropy: false };
    static SMOOTH = { min: 0x2601, mag: 0x2601, mipmap: false, anisotropy: false };

    static SHARP_MIPMAP = { min: 0x2702, mag: 0x2600, mipmap: true, anisotropy: false };
    static SMOOTH_MIPMAP = { min: 0x2703, mag: 0x2601, mipmap: true, anisotropy: false };

    static SHARP_MIPMAP_ANISO = { min: 0x2702, mag: 0x2600, mipmap: true, anisotropy: true };
    static SMOOTH_MIPMAP_ANISO = { min: 0x2703, mag: 0x2601, mipmap: true, anisotropy: true };

    static REPEAT = 0x2901;
    static CLAMP = 0x812F;
    static MIRRORED = 0x8370;

    static #count = 0;

    #gl;
    #id;
    #texture;
    #filter;
    #wrap;

    constructor(path, shader, uName, wrap = Texture.CLAMP, filter = Texture.SMOOTH)
    {
        this.#gl = WebGLContext.GetContext();
        this.#id = Texture.#count;
        this.#wrap = wrap;
        this.#filter = filter;

        const image = new Image();
        image.src = path;
        image.onload = () =>
        {
            this.#texture = this.#CreateTexture();
            this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGBA, this.#gl.RGBA, this.#gl.UNSIGNED_BYTE, image);
            this.#SetParams();
            this.#gl.uniform1i(this.#gl.getUniformLocation(shader.GetProgram(), uName), this.#id);
        };
        image.onerror = () =>
        {
            this.#texture = this.#CreateTexture();
            this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGB, 1, 1, 0, this.#gl.RGB,this.#gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 255]));
            this.#SetParams();
            this.#gl.uniform1i(this.#gl.getUniformLocation(shader.GetProgram(), uName), this.#id);
        }

        Texture.#count++;
    }

    SetFilter(filter)
    {
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#filter.min);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#filter.mag);
    }

    SetWrap(wrap)
    {
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#wrap);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#wrap);
    }


    Bind()
    {
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#texture);
    }

    Unbind()
    {
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, 0);
    }

    Delete()
    {
        this.#gl.deleteTexture(this.#gl.texture);
    }

    #CreateTexture()
    {
        const texture = this.#gl.createTexture();
        this.#gl.activeTexture(this.#gl.TEXTURE0 + this.#id);
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, texture);
        return texture;
    }

    #SetParams()
    {
        if (this.#filter.mipmap)
        {
            this.#gl.generateMipmap(this.#gl.TEXTURE_2D);
        }

        if (this.#filter.anisotropy)
        {
            const ext = this.#gl.getExtension("EXT_texture_filter_anisotropic") || this.#gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || this.#gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
            if (ext)
            {
                const max = this.#gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                this.#gl.texParameterf(this.#gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
            }
        }

        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#wrap);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#wrap);

        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#filter.min);
        this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#filter.mag);
    }
}

export default Texture;