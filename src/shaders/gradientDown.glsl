#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

void main() {
    // Sample the texture
    outColor = texture(sourceTexture, sourceUV);

    // Get the Y coordinate (0.0 = top, 1.0 = bottom)
    float y = sourceUV.y;

    // Simple version: linear fade from top (opaque) to bottom (transparent)
    float alpha = 1.0 - y;

    // Optional: Custom fade range using uniforms
    // float alpha = 1.0 - smoothstep(fadeStart, fadeEnd, y);

    // Apply the gradient fade to the alpha channel
    outColor.a *= alpha;
}
