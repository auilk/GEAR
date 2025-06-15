#version 300 es
precision mediump float;

in vec2 vTexCoord;

out vec4 FragColor;

uniform sampler2D uTexture01;
uniform sampler2D uTexture02;
uniform int uSnippetID;

//SNIPPETS START
//SNIPPETS END

void main()
{
    //BRANCH START
    //BRANCH END
    FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
