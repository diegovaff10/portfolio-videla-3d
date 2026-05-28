"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { GalaxyCloud } from "./GalaxyCloud";
import { useStore } from "@/store/useStore";
import * as THREE from "three";
import { useRef, useEffect } from "react";

function CameraRig() {
  const { cameraTarget } = useStore();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      if (cameraTarget) {
        // Viaje cinematográfico al objetivo
        const desiredPos = cameraTarget.clone().add(new THREE.Vector3(2, 2, 8));
        controlsRef.current.setLookAt(
          desiredPos.x, desiredPos.y, desiredPos.z, 
          cameraTarget.x, cameraTarget.y, cameraTarget.z, 
          true // true para animar suavemente
        );
      } else {
        // Regreso al Home panorámico
        controlsRef.current.setLookAt(
          0, 15, 50, 
          0, 0, 0, 
          true
        );
      }
    }
  }, [cameraTarget]);

  return (
    <CameraControls 
      ref={controlsRef}
      minDistance={2}
      maxDistance={80}
      dollySpeed={0.5}
      smoothTime={1.2} // Esto hace que el viaje sea súper suave y lento
    />
  );
}

export default function LiDARScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto bg-black">
      <Canvas 
        camera={{ position: [0, 15, 50], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }} 
      >
        <fog attach="fog" args={['#000000', 20, 100]} />
        <ambientLight intensity={0.2} color="#ffffff" />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#00ff88" />

        <GalaxyCloud />
        <CameraRig />

        {/* Post-procesamiento Brutalista (Glow/Bloom) */}
        {/* Se ha quitado multisampling={4} y mipmapBlur porque causan crashes en iOS/Android Safari */}
        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
            intensity={2.5} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
