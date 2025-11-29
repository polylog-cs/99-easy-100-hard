#version 300 es
precision highp float;

// use default inputs (called 'uniforms')
#include "@motion-canvas/core/shaders/common.glsl"

void main() {
    // sample the color at the UV of the current run of the shader
    outColor = texture(sourceTexture, sourceUV);

    // lighten colors everywhere
    outColor.rgb = mix(outColor.rgb, vec3(1.0), 0.3);
}
