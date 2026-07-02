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

// Fragment shader: 2.5D parallax depth shift combined with Lando Norris Exact Blob Masking & Visibility transition
const fragmentShader = `
  uniform sampler2D uTextureBroken;
  uniform sampler2D uTextureFixed;
  uniform sampler2D uDepthMap;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uViewportAspect;
  uniform float uReveal;
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
    float depthValue = 0.0;
    if (inBounds) {
      depthValue = texture2D(uDepthMap, textureUv).r;
    }

    // 3. Parallax Effect: shift the coordinates based on mouse position (uMouse) and depth
    float depthIntensity = uViewportAspect > 1.0 ? 0.02 : 0.012;
    vec2 parallaxOffset = (uMouse - vec2(0.5)) * depthValue * depthIntensity;
    vec2 distortedUv = textureUv + parallaxOffset;

    // Re-check bounds for parallax UV
    bool inParallaxBounds = (distortedUv.x >= 0.0 && distortedUv.x <= 1.0 && distortedUv.y >= 0.0 && distortedUv.y <= 1.0);

    // 4. Sample broken and fixed textures using parallax-displaced UVs
    vec4 colorBroken = vec4(0.0);
    vec4 colorFixed = vec4(0.0);
    
    if (inParallaxBounds) {
      colorBroken = texture2D(uTextureBroken, distortedUv);
      colorFixed = texture2D(uTextureFixed, distortedUv);
    }

    // 5. Exact Lando Norris Blob Math
    // Calculate pure distance from parallax displaced UV to mouse cursor in canvas space (vUv)
    float dist = distance(vUv, uMouse);

    // Generate slow-moving organic noise on large scale (frequency 3.0, time factor 0.3)
    float noiseVal = cnoise(vUv * 3.0 + (uTime * 0.3)) * 0.15;

    // Distort distance with noise to create blob shape
    float blob = dist + noiseVal;

    // 6. Large radius soft edge masking multiplied by uReveal for visibility control
    // Area close to cursor (blob < 0.15) becomes 1.0 (Fixed), and fades to 0.0 (Broken) at 0.4
    float mask = (1.0 - smoothstep(0.15, 0.4, blob)) * uReveal;

    // 7. Blending colors based on soft mask
    vec4 finalColor = mix(colorBroken, colorFixed, mask);

    // 8. Logika Alpha Discard to support background transparency
    if (finalColor.a < 0.1) discard;

    // Output final color
    gl_FragColor = finalColor;
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
  
  // Clean single-point mouse tracking refs
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  // Local isHovered ref to track R3F pointer interaction
  const isHovered = useRef(false);

  // Initialize uniforms including uReveal
  const uniforms = useRef({
    uTextureBroken: { value: textures.broken },
    uTextureFixed: { value: textures.fixed },
    uDepthMap: { value: textures.depth },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uTime: { value: 0 },
    uViewportAspect: { value: viewportWidth / viewportHeight },
    uReveal: { value: 0.0 },
  });

  useFrame((state) => {
    if (!materialRef.current) return;

    // Update time uniform continuously
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    // Sync viewport aspect dynamically
    const currentAspect = viewportWidth / viewportHeight;
    materialRef.current.uniforms.uViewportAspect.value = currentAspect;

    // Determine target reveal status based on combination of pointer coordinates inside Hero and R3F overlay
    const activeHover = isHovered.current || isHoveredRef.current;

    // Lerp visibility state smoothly
    materialRef.current.uniforms.uReveal.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uReveal.value,
      activeHover ? 1.0 : 0.0,
      0.05
    );

    // Map pointer position NDC [-1, 1] to UV space [0, 1] relative to the overall Canvas
    if (activeHover) {
      const targetX = state.pointer.x * 0.5 + 0.5;
      const targetY = state.pointer.y * 0.5 + 0.5;
      targetMouse.current.set(targetX, targetY);
    } else {
      // Return to center when mouse leaves the Hero container
      targetMouse.current.set(0.5, 0.5);
    }

    // Lerp kursor coordinate for natural motion delay
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, targetMouse.current.x, 0.08);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, targetMouse.current.y, 0.08);

    materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);
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

      // Enable ClampToEdgeWrapping for extreme parallax offsets
      brokenTex.wrapS = THREE.ClampToEdgeWrapping;
      brokenTex.wrapT = THREE.ClampToEdgeWrapping;
      fixedTex.wrapS = THREE.ClampToEdgeWrapping;
      fixedTex.wrapT = THREE.ClampToEdgeWrapping;
      depthTex.wrapS = THREE.ClampToEdgeWrapping;
      depthTex.wrapT = THREE.ClampToEdgeWrapping;

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
      className="w-full h-full relative overflow-hidden select-none cursor-none touch-pan-y"
      onPointerOver={() => { isHoveredRef.current = true; }}
      onPointerMove={() => { isHoveredRef.current = true; }}
      onPointerOut={() => { isHoveredRef.current = false; }}
      onPointerLeave={() => { isHoveredRef.current = false; }}
      onPointerDown={() => { isHoveredRef.current = true; }}
      onPointerUp={() => { isHoveredRef.current = false; }}
      onPointerCancel={() => { isHoveredRef.current = false; }}
    >
      {!textures ? (
        <DiagnosticLoader progress={progress} />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 1], fov: 90 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full touch-pan-y"
        >
          <MagicShaderPlane textures={textures} isHoveredRef={isHoveredRef} />
        </Canvas>
      )}
    </div>
  );
}
