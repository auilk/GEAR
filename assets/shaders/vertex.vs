#version 300 es
precision mediump float;

in vec3 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat3 uModel;

void main()
{
    gl_Position = vec4(uModel * aPosition, 1.0);

    vTexCoord = aTexCoord;
}