#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

uniform float strength; // Controls disintegration progress (0.0 = no effect, 1.0 = fully disintegrated)

// Simple Perlin noise function
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 438.52453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Four corners of the unit square
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Fractal noise (multiple octaves)
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;

    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    return value;
}

void main() {
    // Sample the original texture
    vec4 originalColor = texture(sourceTexture, sourceUV);

    // Generate noise pattern
    vec2 noiseCoord = sourceUV * 8.0; // Scale noise pattern
    float noiseValue = fbm(noiseCoord);

    // Create disintegration threshold
    float threshold = strength;

    // Calculate disintegration factor
    float disintegrationFactor = smoothstep(threshold - 0.1, threshold + 0.1, noiseValue);

    // Create edge glow effect
    float edgeGlow = 1.0 - smoothstep(threshold - 0.2, threshold, noiseValue);
    edgeGlow *= smoothstep(threshold, threshold + 0.1, noiseValue);

    // Disintegration colors (orange/red glow)
    vec3 glowColor = vec3(1.0, 0.4, 0.1); // Orange-red glow
    vec3 ashColor = vec3(0.2, 0.2, 0.2); // Dark ash color

    // Mix original color with disintegration effects
    vec3 finalColor = originalColor.rgb;

    // Add edge glow
    finalColor = mix(finalColor, glowColor, edgeGlow * 0.8);

    // Fade to ash color as it disintegrates
    finalColor = mix(finalColor, ashColor, disintegrationFactor * 0.3);

    // Calculate final alpha (fade out disintegrated parts)
    float finalAlpha = originalColor.a * (1.0 - disintegrationFactor);

    // Add some sparkle/ember effect
    float sparkle = step(0.95, noiseValue) * edgeGlow;
    finalColor += sparkle * glowColor * 2.0;

    outColor = vec4(finalColor, finalAlpha);

    // Invert colors
    outColor.rgb *= 0.9;
    // outColor.rgb = vec3(1.0) - outColor.rgb;
}
