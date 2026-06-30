"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Html, useProgress, Center } from "@react-three/drei";
import * as THREE from "three";

// Custom loader using diagnostic technical design matching our specs
function DiagnosticLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-center font-mono select-none pointer-events-none w-64">
        <div className="mb-2 text-xs uppercase tracking-widest text-primary animate-pulse">
          INITIALIZING 3D ENGINE
        </div>
        <div className="w-full h-1 bg-surface-alt border border-border rounded overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] text-text-muted uppercase">
          Mesh Calibration: {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

// Inner component to handle loading and mouse tracking
function DeviceModel() {
  // Load local GLB model
  const { scene } = useGLTF("/models/iphone.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Smooth mouse-tracking rotation using lerp
  useFrame((state) => {
    if (!groupRef.current) return;

    // pointer coordinates range from -1 to 1
    const targetX = state.pointer.y * 0.4;
    const targetY = state.pointer.x * 0.4;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      0.06
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      0.06
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive
          object={scene}
          scale={4.5} // Adjust scale for Phone 17 Pro Max Simple.glb
          rotation={[0, Math.PI / 1.1, 0]} // Present default angled view
        />
      </Center>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-[350px] md:h-[550px] select-none">
      {/* Precision grid backdrop behind canvas to look like diagnostic screen */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(242,106,33,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(242,106,33,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none rounded-lg border border-border/50" />
      
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <Suspense fallback={<DiagnosticLoader />}>
          {/* Ambient Lighting */}
          <ambientLight intensity={0.6} />

          {/* Key Light */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.0}
            color="#ffffff"
          />

          {/* Warm Fill Light */}
          <directionalLight
            position={[-5, 3, -5]}
            intensity={0.8}
            color="#f26a21" // Copper warm fill
          />

          {/* Precision Rim Lights to highlight metal contours */}
          <spotLight
            position={[0, 8, 2]}
            angle={0.5}
            penumbra={1}
            intensity={2}
            color="#ffffff"
          />

          <spotLight
            position={[5, -5, -5]}
            angle={0.8}
            penumbra={1}
            intensity={1.5}
            color="#f26a21" // Orange highlights
          />

          <DeviceModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model to avoid pop-in
useGLTF.preload("/models/iphone.glb");
