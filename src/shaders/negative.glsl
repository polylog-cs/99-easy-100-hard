#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

uniform float strength;

void main() {
    // Sample the texture
    outColor = texture(sourceTexture, sourceUV);

    outColor.rgb = mix(texture(sourceTexture, sourceUV).rgb, vec3(1.0) - texture(sourceTexture, sourceUV).rgb, strength);
}
