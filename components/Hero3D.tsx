"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader: 2.5D parallax depth shift combined with Metaball Liquid Trail & Velocity-based Noise (aspect ratio centered mapping)
const fragmentShader = `
  uniform sampler2D uTextureBroken;
  uniform sampler2D uTextureFixed;
  uniform sampler2D uDepthMap;
  uniform vec2 uTrail[15];
  uniform float uVelocity;
  uniform float uActiveTime;
  uniform float uViewportAspect;
  varying vec2 vUv;

  // Classic Perlin 2D Noise
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g10, g10), dot(g01, g01), dot(g11, g11)));
    g00 *= norm.x;
    g10 *= norm.y;
    g01 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    float n_x0 = mix(n00, n10, fade_xy.x);
    float n_y0 = mix(n01, n11, fade_xy.x);
    float n_xy = mix(n_x0, n_y0, fade_xy.y);
    return 2.3 * n_xy;
  }

  // 2D Rotation function
  vec2 rotate2D(vec2 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(v.x * c - v.y * s, v.x * s + v.y * c);
  }

  // Polynomial Smooth Minimum (Quadratic blending) for Metaball merging
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  void main() {
    // 1. Calculate texture UV mapped to center of the viewport (contain fit)
    // Aspect ratio of textures is 1.0 (square)
    vec2 textureUv = vUv;
    if (uViewportAspect > 1.0) {
      // Landscape: fit height, scale and center width
      textureUv.x = (vUv.x - 0.5) * uViewportAspect + 0.5;
    } else {
      // Portrait: fit width, scale and center height
      textureUv.y = (vUv.y - 0.5) / uViewportAspect + 0.5;
    }

    // Check if the current pixel is inside the square texture boundaries
    bool inBounds = (textureUv.x >= 0.0 && textureUv.x <= 1.0 && textureUv.y >= 0.0 && textureUv.y <= 1.0);

    // 2. Read depth map value (only if within bounds to avoid wrapping artifacts)
    float depth = 0.0;
    if (inBounds) {
      depth = texture2D(uDepthMap, textureUv).r;
    }

    // 3. Parallax Effect: shift the coordinates based on newest trail point (uTrail[14]) and depth
    vec2 mouseOffset = uTrail[14] - vec2(0.5);
    vec2 parallaxUv = textureUv + mouseOffset * depth * 0.015;

    // Re-check bounds for parallax UV
    bool inParallaxBounds = (parallaxUv.x >= 0.0 && parallaxUv.x <= 1.0 && parallaxUv.y >= 0.0 && parallaxUv.y <= 1.0);

    // 4. Sample default alpha
    float alpha = 0.0;
    vec4 colorBroken = vec4(0.0);
    vec4 colorFixed = vec4(0.0);
    
    if (inParallaxBounds) {
      alpha = texture2D(uTextureBroken, parallaxUv).a;
      colorBroken = texture2D(uTextureBroken, parallaxUv);
      colorFixed = texture2D(uTextureFixed, parallaxUv);
    }

    // 5. Metaball Trail Field calculation (Smooth Minimum) in canvas UV space (vUv)
    // We compute the trail using vUv directly so the trail can wander anywhere over the viewport
    float trailField = 9999.0;
    for (int i = 0; i < 15; i++) {
      float radius = 0.05 + 0.17 * (float(i) / 14.0);
      float d = distance(vUv, uTrail[i]) - radius;
      trailField = smin(trailField, d, 0.15);
    }

    // 6. Dynamic Velocity-based Noise
    float fastTime = uActiveTime * 5.0;
    vec2 noiseCoords = rotate2D(vUv, uActiveTime * 0.2) * 10.0 + fastTime;
    float n = cnoise(noiseCoords);

    float dynamicAmplitude = 0.05 + (uVelocity * 0.5);
    float distortedField = trailField + n * dynamicAmplitude;

    // 7. Smooth step to create organic liquid mask
    float mask = smoothstep(-0.03, 0.03, distortedField);

    // 8. Blending fixed (inside trail) and broken (outside)
    vec3 blendedColor = mix(colorFixed.rgb, colorBroken.rgb, mask);

    // 9. Glowing liquid border energy wave (#f26a21 orange)
    float borderGlow = smoothstep(0.0, 0.05, abs(mask - 0.5));
    borderGlow = 1.0 - borderGlow;
    vec3 glowColor = vec3(0.95, 0.42, 0.13); // #f26a21 orange
    vec3 finalColor = mix(blendedColor, glowColor, borderGlow * 0.4);

    // 10. To allow the orange glow to render outside the phone bounds (over the transparent canvas background),
    // we set the final alpha to include the border glow opacity
    float finalAlpha = max(alpha, borderGlow * 0.8 * (1.0 - mask)); // only glow inside/near trail
    if (!inParallaxBounds) {
      finalAlpha = borderGlow * 0.8 * (1.0 - mask);
    }

    // Early discard for pixel rendering efficiency
    if (finalAlpha < 0.05) discard;

    // 11. Output final color
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

interface TexturesState {
  broken: THREE.Texture;
  fixed: THREE.Texture;
  depth: THREE.Texture;
}

function DiagnosticLoader({ progress }: { progress: number }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono select-none pointer-events-none bg-background z-20">
      <div className="mb-2 text-xs uppercase tracking-widest text-primary animate-pulse">
        INITIALIZING WEBGL 2.5D SHADER
      </div>
      <div className="w-64 h-1 bg-surface-alt border border-border rounded overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-[10px] text-text-muted uppercase">
        Texture Bindings: {Math.round(progress)}%
      </div>
    </div>
  );
}

interface MagicShaderPlaneProps {
  textures: TexturesState;
  isHoveredRef: React.RefObject<boolean>;
}

function MagicShaderPlane({ textures, isHoveredRef }: MagicShaderPlaneProps) {
  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport);

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Physics tracking refs
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  
  const trailRef = useRef<THREE.Vector2[]>(
    Array.from({ length: 15 }, () => new THREE.Vector2(0.5, 0.5))
  );
  const velocityRef = useRef<number>(0);
  const activeTimeRef = useRef<number>(0);
  const prevMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));

  // Initialize uniforms
  const uniforms = useRef({
    uTextureBroken: { value: textures.broken },
    uTextureFixed: { value: textures.fixed },
    uDepthMap: { value: textures.depth },
    uTrail: { value: trailRef.current },
    uVelocity: { value: 0 },
    uActiveTime: { value: 0 },
    uViewportAspect: { value: viewportWidth / viewportHeight },
  });

  useFrame((state) => {
    if (!materialRef.current) return;

    // Get time step (clamped to avoid jumps)
    const deltaT = Math.min(state.clock.getDelta(), 0.1);

    // Sync viewport aspect dynamically (in case of resize)
    const currentAspect = viewportWidth / viewportHeight;
    materialRef.current.uniforms.uViewportAspect.value = currentAspect;

    // If pointer is hovering anywhere within the Hero canvas
    if (isHoveredRef.current) {
      // Map state.pointer [-1, 1] relative to the overall Canvas viewport directly to UV coordinates [0, 1]
      const targetX = state.pointer.x * 0.5 + 0.5;
      const targetY = state.pointer.y * 0.5 + 0.5;
      targetMouse.current.set(targetX, targetY);
    } else {
      // Reset target position to center when cursor is outside the Hero section
      targetMouse.current.set(0.5, 0.5);
    }

    // Calculate mouse velocity (delta distance) in canvas UV space
    const delta = targetMouse.current.distanceTo(prevMouseRef.current);
    
    // Smooth velocity with lerp (inertia)
    velocityRef.current = THREE.MathUtils.lerp(velocityRef.current, delta, 0.1);

    // Update active time only when the cursor is moving
    if (velocityRef.current > 0.001) {
      activeTimeRef.current += deltaT;
    }

    // Shift mouse coordinates in history trail
    for (let i = 0; i < 14; i++) {
      trailRef.current[i].copy(trailRef.current[i + 1]);
    }
    
    // Smooth the newest trail point towards the target
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, targetMouse.current.x, 0.08);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, targetMouse.current.y, 0.08);
    trailRef.current[14].copy(mouseRef.current);

    // Store target coordinates for next frame's physics check
    prevMouseRef.current.copy(targetMouse.current);

    // Sync references to uniforms
    materialRef.current.uniforms.uVelocity.value = velocityRef.current;
    materialRef.current.uniforms.uActiveTime.value = activeTimeRef.current;
    materialRef.current.uniforms.uTrail.value = trailRef.current;
  });

  return (
    <mesh scale={[viewportWidth, viewportHeight, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
}

export default function Hero3D() {
  const [textures, setTextures] = useState<TexturesState | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);

    let brokenTex: THREE.Texture;
    let fixedTex: THREE.Texture;
    let depthTex: THREE.Texture;

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setProgress((itemsLoaded / itemsTotal) * 100);
    };

    manager.onLoad = () => {
      // Ensure textures use linear filtering for smooth rendering
      brokenTex.minFilter = THREE.LinearFilter;
      fixedTex.minFilter = THREE.LinearFilter;
      depthTex.minFilter = THREE.LinearFilter;

      // Set state to trigger Canvas mount
      setTextures({
        broken: brokenTex,
        fixed: fixedTex,
        depth: depthTex,
      });
    };

    brokenTex = loader.load("/images/iphone-broken.png");
    fixedTex = loader.load("/images/iphone-fixed.png");
    depthTex = loader.load("/images/iphone-depth.png");
  }, []);

  return (
    <div 
      className="w-full h-full relative overflow-hidden select-none cursor-none"
      onPointerOver={() => { isHoveredRef.current = true; }}
      onPointerMove={() => { isHoveredRef.current = true; }}
      onPointerOut={() => { isHoveredRef.current = false; }}
      onPointerLeave={() => { isHoveredRef.current = false; }}
    >
      {!textures ? (
        <DiagnosticLoader progress={progress} />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 1], fov: 90 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <MagicShaderPlane textures={textures} isHoveredRef={isHoveredRef} />
        </Canvas>
      )}
    </div>
  );
}
