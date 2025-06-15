import FragmentShader from "./graphics/fragment-shader.js";

async function main()
{
    const vert01 = await FragmentShader.LoadShaderSrc("./assets/shaders/test01.shdr");
    const vert02 = await FragmentShader.LoadShaderSrc("./assets/shaders/test02.shdr");
}

main();