#version 300 es
precision mediump float;

in vec2 vTexCoord;

out vec4 FragColor;

uniform sampler2D uTexture01;
uniform sampler2D uTexture02;

void main()
{
    FragColor = mix(texture(uTexture01, vTexCoord), texture(uTexture02, vTexCoord), 0.5);
}
