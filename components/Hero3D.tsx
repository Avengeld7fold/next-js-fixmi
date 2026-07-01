"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

// Vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader: 2.5D parallax depth shift combined with liquid magic repair brush
const fragmentShader = `
  uniform sampler2D uTextureBroken;
  uniform sampler2D uTextureFixed;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;

  // 2D Noise function for the liquid transition edge wave
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    // 1. Read depth map value at current UV coordinates
    float depth = texture2D(uDepthMap, vUv).r;

    // 2. Parallax Effect: shift the UV coordinates based on mouse position and depth
    // uMouse goes from 0.0 (bottom-left) to 1.0 (top-right). Center is 0.5.
    vec2 mouseOffset = uMouse - vec2(0.5);
    
    // Parallax displacement intensity (0.015 gives a subtle 2.5D depth movement)
    vec2 parallaxUv = vUv + mouseOffset * depth * 0.015;
    parallaxUv = clamp(parallaxUv, 0.0, 1.0);

    // 3. Magic Repair Brush (Distance tracking in UV space)
    float dist = distance(parallaxUv, uMouse);

    // 4. Liquid Transition / Magic Wave effect using noise
    float noiseFactor = noise(parallaxUv * 12.0 + uTime * 2.0);
    
    // Base brush size with dynamic wavy distortion
    float brushRadius = 0.22;
    float distortedRadius = brushRadius + noiseFactor * 0.04;

    // Smooth edge mask of the magic repair brush
    // Inside: brushMask approaches 1.0 (fixed phone visible)
    // Outside: brushMask approaches 0.0 (broken phone visible)
    float brushMask = 1.0 - smoothstep(distortedRadius - 0.05, distortedRadius + 0.05, dist);

    // 5. Sampling the broken and fixed textures using the parallax-displaced UVs
    vec4 colorBroken = texture2D(uTextureBroken, parallaxUv);
    vec4 colorFixed = texture2D(uTextureFixed, parallaxUv);

    // 6. Blending using our magic repair brush mask
    vec4 finalColor = mix(colorBroken, colorFixed, brushMask);

    // 7. Orange project magic brush glowing boundary line (#f26a21)
    float borderGlow = smoothstep(0.0, 0.015, abs(dist - distortedRadius));
    borderGlow = 1.0 - borderGlow;
    vec4 glowColor = vec4(0.95, 0.42, 0.13, 1.0); // #f26a21 orange
    finalColor = mix(finalColor, glowColor, borderGlow * 0.35);

    gl_FragColor = finalColor;
  }
`;

function DiagnosticLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center font-mono select-none pointer-events-none w-64">
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

function MagicShaderPlane() {
  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport);
  
  // Load textures
  const uTextureBroken = useTexture("/images/iphone-broken.jpeg");
  const uTextureFixed = useTexture("/images/iphone-fixed.jpeg");
  const uDepthMap = useTexture("/images/iphone-depth.jpeg");

  // Ensure textures use linear filtering for smooth rendering
  uTextureBroken.minFilter = THREE.LinearFilter;
  uTextureFixed.minFilter = THREE.LinearFilter;
  uDepthMap.minFilter = THREE.LinearFilter;

  // Calculate correct proportions (2752 x 1536 aspect ratio = 1.79167)
  const imageAspect = 2752 / 1536;
  const viewportAspect = viewportWidth / viewportHeight;

  let planeWidth = viewportWidth;
  let planeHeight = viewportHeight;

  if (imageAspect > viewportAspect) {
    // Viewport is vertically taller than the image aspect, fit width and scale down height
    planeHeight = viewportWidth / imageAspect;
  } else {
    // Viewport is horizontally wider than the image aspect, fit height and scale down width
    planeWidth = viewportHeight * imageAspect;
  }

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  // Initialize uniforms
  const uniforms = useRef({
    uTextureBroken: { value: uTextureBroken },
    uTextureFixed: { value: uTextureFixed },
    uDepthMap: { value: uDepthMap },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
  });

  useFrame((state) => {
    if (!materialRef.current) return;

    // Update uTime
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    // Smoothly lerp mouse coordinates to the target intersection position
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, targetMouse.current.x, 0.08);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, targetMouse.current.y, 0.08);

    materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);
  });

  // Accurate mouse tracking directly on the 3D plane using raycasted UV coordinates
  const handlePointerMove = (e: any) => {
    if (e.uv) {
      targetMouse.current.copy(e.uv);
    }
  };

  const handlePointerLeave = () => {
    // Smoothly return the brush to the center when mouse leaves
    targetMouse.current.set(0.5, 0.5);
  };

  return (
    <mesh onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <planeGeometry args={[planeWidth, planeHeight]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-[300px] md:h-[380px] lg:h-[480px] xl:h-[540px] select-none rounded-2xl overflow-hidden border border-border/50 bg-black/20">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 90 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={<DiagnosticLoader />}>
          <MagicShaderPlane />
        </Suspense>
      </Canvas>
    </div>
  );
}
