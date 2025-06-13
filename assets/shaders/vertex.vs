#version 300 es
precision mediump float;

in vec3 aPosition;
in vec2 aTexCoord;

out vec2 vTexCoord;

uniform mat3 uModel;
uniform mat3 uView;
uniform mat3 uProjection;

void main()
{
    gl_Position = vec4(uProjection * uView * uModel * aPosition, 1.0);

    vTexCoord = aTexCoord;
}