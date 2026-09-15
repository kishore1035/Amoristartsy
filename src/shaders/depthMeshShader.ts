export const depthVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;
    
    // Subtle physical mesh bulge towards camera on hover based on proximity
    float dist = distance(vUv, vec2(0.5) + uMouse * 0.5);
    float bulge = smoothstep(0.8, 0.0, dist) * uHover * 0.15;
    pos.z += bulge;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const depthFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;        // Normalized mouse position (-1 to 1)
  uniform float uHover;       // Hover state transition (0.0 to 1.0)
  uniform vec2 uResolution;   // Texture aspect ratio / resolution
  uniform float uIntensity;   // Depth displacement intensity scaling
  uniform float uTime;        // Time variable for subtle ambient motion

  varying vec2 vUv;

  void main() {
    // Sample grayscale depth map luminance (0.0 = background/far, 1.0 = foreground/near)
    vec4 depthTex = texture2D(uDepthMap, vUv);
    float depth = (depthTex.r + depthTex.g + depthTex.b) / 3.0;

    // Calculate dynamic 3D spatial parallax offset based on uMouse vector & depth luminance
    vec2 maxDisplacement = vec2(0.045, 0.045) * uIntensity;
    vec2 parallaxOffset = uMouse * depth * maxDisplacement * uHover;

    // Apply offset to UV coordinates
    vec2 displacedUv = vUv - parallaxOffset;

    // Clamp UVs to avoid edge distortion clamping
    displacedUv = clamp(displacedUv, 0.001, 0.999);

    // RGB Split / Chromatic Aberration effect on fast mouse movements
    float caOffset = length(uMouse) * depth * 0.008 * uHover;
    float colorR = texture2D(uTexture, displacedUv + vec2(caOffset, 0.0)).r;
    float colorG = texture2D(uTexture, displacedUv).g;
    float colorB = texture2D(uTexture, displacedUv - vec2(caOffset, 0.0)).b;
    float alpha = texture2D(uTexture, displacedUv).a;

    vec3 finalColor = vec3(colorR, colorG, colorB);

    // Subtle edge vignette
    vec2 uvVignette = vUv * (1.0 - vUv.yx);
    float vignette = uvVignette.x * uvVignette.y * 15.0;
    vignette = pow(vignette, 0.25);
    finalColor *= vignette;

    // Subtle specular shine sheen sweeping across canvas on hover
    float sheenPos = sin(uTime * 1.5 + vUv.x * 3.0 + vUv.y * 2.0) * 0.5 + 0.5;
    float sheen = pow(sheenPos, 6.0) * 0.12 * uHover * depth;
    finalColor += vec3(sheen * 0.8, sheen * 0.9, sheen * 1.0);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
