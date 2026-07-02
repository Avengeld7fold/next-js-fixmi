"use client";

import { useRef, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useProgress, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader: 2.5D parallax depth shift combined with Fruit Ninja style Liquid Slash Masking & full-screen aspect-ratio contain correction
const fragmentShader = `
  uniform sampler2D uTextureBroken;
  uniform sampler2D uTextureFixed;
  uniform sampler2D uDepthMap;
  uniform vec2 uTrail[15];
  uniform float uTime;
  uniform float uReveal;
  uniform vec2 uResolution;
  uniform vec2 uImageRes;
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

  // Signed Distance to Line Segment function
  float sdLine( vec2 p, vec2 a, vec2 b ) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
  }

  // Polynomial Smooth Minimum (Quadratic blending)
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  void main() {
    // 1. Calculate texture UV mapped to center of the viewport (contain fit aspect ratio correction)
    vec2 screenAspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 imageAspect = vec2(uImageRes.x / uImageRes.y, 1.0);
    vec2 scale = vec2(1.0);
    if (screenAspect.x > imageAspect.x) {
      // Screen is wider than image (landscape) - scale width
      scale = vec2(screenAspect.x / imageAspect.x, 1.0);
    } else {
      // Screen is taller than image (portrait) - scale height
      scale = vec2(1.0, imageAspect.x / screenAspect.x);
    }
    vec2 newUv = (vUv - 0.5) * scale + 0.5;

    // Boundary Check: prevent texture tiling by checking UV coordinates [0.0, 1.0] bounds
    float alphaBounds = (newUv.x < 0.0 || newUv.x > 1.0 || newUv.y < 0.0 || newUv.y > 1.0) ? 0.0 : 1.0;

    // 2. Read depth map value (only if within bounds to avoid wrapping artifacts)
    float depthValue = 0.0;
    if (alphaBounds > 0.5) {
      depthValue = texture2D(uDepthMap, newUv).r;
    }

    // 3. Parallax Effect: shift the coordinates based on newest mouse position (uTrail[0]) and depth
    float depthIntensity = screenAspect.x > imageAspect.x ? 0.02 : 0.012;
    vec2 mouseOffset = uTrail[0] - vec2(0.5);
    vec2 parallaxOffset = mouseOffset * depthValue * depthIntensity;
    vec2 distortedUv = newUv + parallaxOffset;

    // Re-check bounds for parallax UV
    float parallaxAlphaBounds = (distortedUv.x < 0.0 || distortedUv.x > 1.0 || distortedUv.y < 0.0 || distortedUv.y > 1.0) ? 0.0 : 1.0;

    // 4. Sample broken and fixed textures using parallax-displaced UVs
    vec4 colorBroken = vec4(0.0);
    vec4 colorFixed = vec4(0.0);
    
    if (parallaxAlphaBounds > 0.5) {
      colorBroken = texture2D(uTextureBroken, distortedUv);
      colorFixed = texture2D(uTextureFixed, distortedUv);
    }

    // 5. Calculate Fruit Ninja style Liquid Slash Masking (using vUv directly to draw full-screen trail)
    float slashDist = 100.0;
    for (int i = 0; i < 14; i++) {
      // Tapering radius: index 0 (newest pointer position) is thickest (0.12), index 14 is sharpest (0.0)
      float radius = mix(0.12, 0.0, float(i) / 14.0);
      float d = sdLine(vUv, uTrail[i], uTrail[i+1]) - radius;
      slashDist = smin(slashDist, d, 0.05);
    }

    // Add fast-moving organic liquid noise on te tebasan edges
    slashDist += cnoise(vUv * 5.0 - vec2(uTime * 3.0)) * 0.04;

    // Sharp but anti-aliased smoothstep boundary mask
    float mask = 1.0 - smoothstep(0.0, 0.02, slashDist);

    // Combine with uReveal for hover state visibility control
    mask *= uReveal;

    // 6. Global Slash Visibility (Warna Tebasan)
    // Draw ice-blue / glowing white sword slash color
    vec4 slashColor = vec4(0.9, 0.95, 1.0, mask * 0.8);

    // Blend texture color of iPhone fixed & broken, multiplied by viewport boundary
    vec4 texColor = mix(colorBroken, colorFixed, mask) * parallaxAlphaBounds;

    // Combine output: phone layer + glowing sword trail on top
    vec4 finalColor = texColor + slashColor;

    // 7. Logika Alpha Discard to support background transparency (only render if image or slash is visible)
    if (finalColor.a < 0.05) discard;

    // Output final color
    gl_FragColor = finalColor;
  }
`;

function DiagnosticLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center font-mono select-none pointer-events-none w-64 bg-background/80 p-6 rounded-lg border border-border/50 backdrop-blur-md">
        <div className="mb-2 text-xs uppercase tracking-widest text-primary animate-pulse">
          INITIALIZING WEBGL 2.5D SHADER
        </div>
        <div className="w-full h-1 bg-surface-alt border border-border rounded overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] text-text-muted uppercase">
          Texture Bindings: {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

interface MagicShaderPlaneProps {
  isHoveredRef: React.RefObject<boolean>;
}

const TRAIL_LENGTH = 15;

function MagicShaderPlane({ isHoveredRef }: MagicShaderPlaneProps) {
  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport);

  // Load textures using Drei's useTexture hook to guarantee sync loading inside Suspense
  const [brokenTex, fixedTex, depthTex] = useTexture([
    "/images/iphone-broken.png",
    "/images/iphone-fixed.png",
    "/images/iphone-depth.png",
  ]);

  // Ensure textures use linear filtering and clamp-to-edge wrapping to avoid texture unit bleed
  useEffect(() => {
    brokenTex.minFilter = THREE.LinearFilter;
    fixedTex.minFilter = THREE.LinearFilter;
    depthTex.minFilter = THREE.LinearFilter;

    brokenTex.wrapS = THREE.ClampToEdgeWrapping;
    brokenTex.wrapT = THREE.ClampToEdgeWrapping;
    fixedTex.wrapS = THREE.ClampToEdgeWrapping;
    fixedTex.wrapT = THREE.ClampToEdgeWrapping;
    depthTex.wrapS = THREE.ClampToEdgeWrapping;
    depthTex.wrapT = THREE.ClampToEdgeWrapping;
  }, [brokenTex, fixedTex, depthTex]);

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // R3F mesh overlay hover tracking
  const isHovered = useRef(false);

  // Mobile Device orientation tilt values (retained from gyroscope implementation for smooth fallback)
  const deviceTilt = useRef(new THREE.Vector2(0, 0));

  // Initialize unique Vector2 objects in the trail history buffer
  const trailRef = useRef<THREE.Vector2[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector2(0.5, 0.5))
  );

  // Listen to mobile gyroscope tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        const tiltX = e.gamma / 30.0;
        const tiltY = (e.beta - 60.0) / 30.0;
        deviceTilt.current.set(
          Math.max(-1.0, Math.min(1.0, tiltX)),
          Math.max(-1.0, Math.min(1.0, tiltY))
        );
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // Use useMemo for uniforms to ensure textures are correctly registered and mapped in WebGL
  const uniforms = useMemo(() => ({
    uTextureBroken: { value: brokenTex },
    uTextureFixed: { value: fixedTex },
    uDepthMap: { value: depthTex },
    uTrail: { value: trailRef.current },
    uTime: { value: 0 },
    uReveal: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(viewportWidth, viewportHeight) },
    uImageRes: { value: new THREE.Vector2(1000, 1000) }, // Square texture aspect 1.0
  }), [brokenTex, fixedTex, depthTex, viewportWidth, viewportHeight]);

  useFrame((state) => {
    if (!materialRef.current) return;

    // Enforce active texture unit bindings every frame to avoid WebGL state mapping mismatch
    materialRef.current.uniforms.uTextureBroken.value = brokenTex;
    materialRef.current.uniforms.uTextureFixed.value = fixedTex;
    materialRef.current.uniforms.uDepthMap.value = depthTex;

    // Update time uniform continuously
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    // Sync viewport resolution dynamically
    materialRef.current.uniforms.uResolution.value.set(viewportWidth, viewportHeight);

    // Combine pointer states
    const activeHover = isHovered.current || isHoveredRef.current;

    // Lerp visibility uReveal smoothly
    materialRef.current.uniforms.uReveal.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uReveal.value,
      activeHover ? 1.0 : 0.0,
      0.05
    );

    // Shift trail values in array buffer: index i takes the value of index i-1
    for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
      trailRef.current[i].copy(trailRef.current[i - 1]);
    }

    // Map pointer position NDC [-1, 1] to UV space [0, 1] relative to Canvas, or use Gyro fallback
    if (activeHover) {
      const targetX = state.pointer.x * 0.5 + 0.5;
      const targetY = state.pointer.y * 0.5 + 0.5;
      trailRef.current[0].set(targetX, targetY);
    } else {
      // Gyroscope/inertia fallback: if phone tilt is active, shift coordinate, else drift back to (0.5, 0.5)
      if (deviceTilt.current.length() > 0.01) {
        const targetX = deviceTilt.current.x * 0.5 + 0.5;
        const targetY = deviceTilt.current.y * 0.5 + 0.5;
        trailRef.current[0].lerp(new THREE.Vector2(targetX, targetY), 0.05);
      } else {
        trailRef.current[0].lerp(new THREE.Vector2(0.5, 0.5), 0.05);
      }
    }

    // Sync reference to uniform
    materialRef.current.uniforms.uTrail.value = trailRef.current;
  });

  return (
    <mesh 
      scale={[viewportWidth, viewportHeight, 1]}
      onPointerOver={() => { isHovered.current = true; }}
      onPointerOut={() => { isHovered.current = false; }}
      onPointerDown={() => { isHovered.current = true; }}
      onPointerUp={() => { isHovered.current = false; }}
      onPointerCancel={() => { isHovered.current = false; }}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

export default function Hero3D() {
  const isHoveredRef = useRef<boolean>(false);

  return (
    <div 
      className="w-full h-full relative overflow-hidden select-none cursor-none touch-pan-y"
      onPointerOver={() => { isHoveredRef.current = true; }}
      onPointerMove={() => { isHoveredRef.current = true; }}
      onPointerOut={() => { isHoveredRef.current = false; }}
      onPointerLeave={() => { isHoveredRef.current = false; }}
      onPointerDown={() => { isHoveredRef.current = true; }}
      onPointerUp={() => { isHoveredRef.current = false; }}
      onPointerCancel={() => { isHoveredRef.current = false; }}
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 90 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full touch-pan-y"
      >
        <Suspense fallback={<DiagnosticLoader />}>
          <MagicShaderPlane isHoveredRef={isHoveredRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
