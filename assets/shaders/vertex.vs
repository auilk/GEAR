#version 300 es
precision mediump float;

in vec2 aPosition;

uniform mat3 uModel;
uniform mat3 uView;
uniform mat3 uProjection;

void main()
{
    gl_Position = vec4(aPosition * 0.5, 0.0, 1.0);
}