export const acrylicCanvasVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  uniform vec2 uMouse;
  uniform float uHover;

  void main() {
    vUv = uv;
    vNormal = normal;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;

    vec3 pos = position;
    
    // Physical canvas corner flex on cursor hover
    float dist = distance(vUv, vec2(0.5) + uMouse * 0.4);
    float flex = smoothstep(0.7, 0.0, dist) * uHover * 0.12;
    pos.z += flex;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const acrylicCanvasFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;        // Normalized mouse position (-1 to 1)
  uniform float uHover;       // Hover transition (0.0 to 1.0)
  uniform float uIntensity;   // Depth displacement intensity
  uniform float uTime;        // Animation clock

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    // 1. Read depth map for spatial parallax displacement
    vec4 depthTex = texture2D(uDepthMap, vUv);
    float depth = (depthTex.r + depthTex.g + depthTex.b) / 3.0;

    vec2 maxDisplacement = vec2(0.04, 0.04) * uIntensity;
    vec2 parallaxOffset = uMouse * depth * maxDisplacement * uHover;
    vec2 displacedUv = clamp(vUv - parallaxOffset, 0.001, 0.999);

    // 2. Sample artwork texture
    vec4 colorTex = texture2D(uTexture, displacedUv);

    // 3. Tactile Woven Acrylic Canvas Grain Bump Effect
    float canvasGrainX = sin(displacedUv.x * 450.0);
    float canvasGrainY = sin(displacedUv.y * 450.0);
    float canvasTexture = (canvasGrainX * canvasGrainY) * 0.045;

    // 4. Subtle paint stroke impasto height bump
    float strokeBump = sin(displacedUv.x * 60.0 + displacedUv.y * 80.0 + uTime * 0.2) * 0.035;

    // Combine tactile lighting
    vec3 finalColor = colorTex.rgb + vec3(canvasTexture + strokeBump);

    // 5. Directional Light Reflection from mouse cursor
    vec3 lightDir = normalize(vec3(uMouse.x * 2.0, uMouse.y * 2.0, 1.5));
    float diff = max(dot(vNormal, lightDir), 0.0);
    finalColor += vec3(0.06 * diff * uHover);

    // 6. RGB Split / Chromatic Aberration on movement
    float caOffset = length(uMouse) * depth * 0.006 * uHover;
    float colorR = texture2D(uTexture, displacedUv + vec2(caOffset, 0.0)).r;
    float colorB = texture2D(uTexture, displacedUv - vec2(caOffset, 0.0)).b;
    finalColor.r = mix(finalColor.r, colorR, 0.5);
    finalColor.b = mix(finalColor.b, colorB, 0.5);

    // Subtle edge vignette
    vec2 uvVignette = vUv * (1.0 - vUv.yx);
    float vignette = pow(uvVignette.x * uvVignette.y * 15.0, 0.2);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, colorTex.a);
  }
`;
