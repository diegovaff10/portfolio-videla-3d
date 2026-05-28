import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export function GalaxyCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const asteroidesRef = useRef<THREE.InstancedMesh>(null);
  const solesRef = useRef<THREE.InstancedMesh>(null);
  
  const hoveredNode = useStore(state => state.hoveredNode);
  const setHoveredNode = useStore(state => state.setHoveredNode);
  const router = useRouter();
  const setCameraTarget = useStore(state => state.setCameraTarget);
  const setProjects = useStore(state => state.setProjects);

  const { positions, colors, hudNodesDef, astMatrices, sunMatrices } = useMemo(() => {
    let seed = 12345;
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const clusterCenters = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-18, 10, -8),
      new THREE.Vector3(15, -8, 12),
      new THREE.Vector3(-10, -15, 18),
      new THREE.Vector3(22, 12, -20)
    ];

    const projectNames = [
      "01. AWWWARDS EXP",
      "02. CINETIC VORTEX",
      "03. BIO-TECH SYSTEM",
      "04. QUANTUM ENGINE",
      "05. DEEP SPACE HUB"
    ];

    const pts: number[] = [];
    const cols: number[] = [];
    const PARTICLE_COUNT = 45000;
    const hNodes: any[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const radius = seededRandom() * 15;
        const theta = seededRandom() * Math.PI * 2;
        const phi = Math.acos(2 * seededRandom() - 1);
        
        const cluster = clusterCenters[Math.floor(seededRandom() * clusterCenters.length)];
        
        const x = cluster.x + radius * Math.sin(phi) * Math.cos(theta);
        const y = cluster.y + (radius * Math.sin(phi) * Math.sin(theta)) * 0.1; 
        const z = cluster.z + radius * Math.cos(phi);

        pts.push(x, y, z);
        
        const dist = new THREE.Vector3(x, y, z).distanceTo(cluster);
        if (dist < 3) {
          cols.push(1, 1, 1);
        } else if (dist < 8) {
          cols.push(0.0, 0.8, 1.0);
        } else {
          cols.push(0.0, 0.2, 0.6);
        }
    }

    clusterCenters.forEach((center, idx) => {
      const offsetPos = center.clone().add(new THREE.Vector3(-4, 4, 0));
      hNodes.push({
        pos: center,
        offsetPos: offsetPos,
        id: `SYS-${1000 + idx}`,
        name: projectNames[idx] || "UNKNOWN SECTOR",
        metadata: "CLASSIFIED DATA"
      });
    });

    const aMatrices: THREE.Matrix4[] = [];
    const sMatrices: THREE.Matrix4[] = [];
    
    clusterCenters.forEach((center) => {
      for (let i = 0; i < 5; i++) {
        const matrix = new THREE.Matrix4();
        const pos = new THREE.Vector3(
          center.x + (seededRandom() - 0.5) * 15,
          center.y + (seededRandom() - 0.5) * 5,
          center.z + (seededRandom() - 0.5) * 15
        );
        matrix.setPosition(pos);
        
        const scale = seededRandom() * 0.5 + 0.2;
        matrix.scale(new THREE.Vector3(scale, scale, scale));
        aMatrices.push(matrix);
      }
      
      const matrix = new THREE.Matrix4();
      matrix.setPosition(center);
      matrix.scale(new THREE.Vector3(2, 2, 2));
      sMatrices.push(matrix);
    });

    return {
      positions: new Float32Array(pts),
      colors: new Float32Array(cols),
      hudNodesDef: hNodes,
      astMatrices: aMatrices,
      sunMatrices: sMatrices
    };
  }, []);

  useEffect(() => {
    if (asteroidesRef.current) {
      astMatrices.forEach((matrix, i) => {
        asteroidesRef.current!.setMatrixAt(i, matrix);
      });
      asteroidesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (solesRef.current) {
      sunMatrices.forEach((matrix, i) => {
        solesRef.current!.setMatrixAt(i, matrix);
      });
      solesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [astMatrices, sunMatrices]);

  useEffect(() => {
    setProjects(
      hudNodesDef.map((node, i) => ({
        id: `project-${i+1}`,
        name: node.name,
        pos: node.pos
      }))
    );
  }, [hudNodesDef, setProjects]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
    if (asteroidesRef.current) {
      asteroidesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      asteroidesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial 
          size={0.015} 
          vertexColors 
          transparent 
          opacity={0.6} 
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <instancedMesh ref={asteroidesRef} args={[undefined, undefined, astMatrices.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#010403" roughness={0.9} metalness={0.1} flatShading />
      </instancedMesh>

      <instancedMesh ref={solesRef} args={[undefined, undefined, sunMatrices.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#00d0ff" wireframe transparent opacity={0.3} />
      </instancedMesh>

      {hudNodesDef.map((node, i) => {
        const isHovered = hoveredNode === i;
        return (
          <group key={i}>
            <pointLight position={node.pos} intensity={isHovered ? 5 : 2} distance={15} color="#ffffff" />
            <Line 
              points={[node.pos, node.offsetPos]} 
              color="#00d0ff" 
              opacity={isHovered ? 0.8 : 0.1} 
              transparent 
              lineWidth={1} 
            />

            <mesh position={node.pos}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial color={isHovered ? "#ffffff" : "#0033ff"} wireframe />
            </mesh>
            
            <Html position={node.offsetPos} center zIndexRange={[100, 0]}>
              <div 
                className="relative flex items-start justify-start group cursor-pointer origin-top-left"
                onMouseEnter={() => { setHoveredNode(i); document.body.style.cursor = 'crosshair'; }}
                onMouseLeave={() => { setHoveredNode(null); document.body.style.cursor = 'auto'; }}
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
                    e.stopPropagation();
                    setHoveredNode(hoveredNode === i ? null : i);
                  }
                }}
              >
                <div className={`transition-all duration-300 bg-black/80 border text-[#00d0ff] px-2 py-1 font-mono text-[10px] whitespace-nowrap shadow-[0_0_15px_rgba(0,208,255,0.3)] ${isHovered ? 'opacity-0 scale-90 border-[#00d0ff]' : 'opacity-100 scale-100 border-[#0033ff]'}`}>
                  {node.id} // {node.name}
                </div>

                <div className={`absolute top-0 left-0 w-[75vw] sm:w-64 md:w-80 border border-[#00d0ff]/50 bg-[#050a1f]/90 backdrop-blur-md p-4 shadow-[0_0_30px_rgba(0,208,255,0.2)] transition-all duration-500 origin-top-left ${isHovered ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <div className="flex justify-between items-start border-b border-[#00d0ff]/30 pb-2 mb-2 text-[#00d0ff]">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg tracking-tighter">N L I A S C</span>
                      <span className="text-[8px] uppercase">RENDER STATUS: ONLINE</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold bg-[#00d0ff] text-black px-2 py-1 text-[10px] mb-1">DESIGN 表示</div>
                      <div className="text-[10px]">A/B DPTM</div>
                      <div className="text-[10px] border-b border-[#00d0ff] w-full text-right">2026 EDITION</div>
                    </div>
                  </div>

                  <div className="font-bold text-2xl tracking-tighter uppercase leading-none mb-2 mt-4 text-white">
                    {node.name}
                  </div>
                  
                  <div className="text-[9px] uppercase tracking-widest text-[#00d0ff]/70 mb-4 flex justify-between">
                    <span>{node.metadata}</span>
                    <span>REF: {node.id}</span>
                  </div>
                  
                  <div className="w-full h-32 bg-[#020510] border border-[#00d0ff]/30 relative overflow-hidden flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[8px] text-[#00d0ff]/50">
                      <span>UX/UI (00) SYNCED</span>
                      <span>CREATIVE PATTERN</span>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-[#00d0ff]/30 w-full h-full text-[6px] leading-[6px] overflow-hidden break-all text-justify font-sans mix-blend-screen">
                        {[...Array(50)].map(() => "██▒░░▒██").join("")}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-[8px] text-[#00d0ff]/50">
                      <span>CREATIVE DEV™</span>
                      <span>ASSETS: LOADED</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-4 pt-2 border-t border-[#00d0ff]/30">
                    <div className="text-[10px] font-bold text-[#00d0ff]/50">
                      PORTFOLIO // DB
                    </div>
                    <div className="flex gap-[2px] h-6">
                      {[1,3,1,1,2,4,1,2,1,1,3].map((w, j) => (
                        <div key={j} className="bg-[#00d0ff]/50 h-full" style={{ width: `${w*1.5}px` }}></div>
                      ))}
                    </div>
                  </div>

                  <button 
                    className="w-full mt-4 bg-[#00d0ff] hover:bg-white text-black font-bold py-2 tracking-widest text-xs transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredNode(null); 
                      setCameraTarget(node.pos);
                      setTimeout(() => {
                        router.push(`/project/${node.id}`);
                      }, 2000);
                    }}
                  >
                    [ ENTER SYSTEM ]
                  </button>

                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
