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
  
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const router = useRouter();
  const setCameraTarget = useStore(state => state.setCameraTarget);
  const setProjects = useStore(state => state.setProjects);

  const { positions, colors, dataNodes, asteroidMatrices, sunsMatrices } = useMemo(() => {
    // Generador pseudoaleatorio determinista
    let seed = 12345;
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const pts: number[] = [];
    const cols: number[] = [];
    const hudNodes: { pos: THREE.Vector3, offsetPos: THREE.Vector3, id: string, name: string, metadata: string }[] = [];

    // Constelación fija de 5 proyectos (Mapa Estelar)
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

    clusterCenters.forEach((center, idx) => {
      // 20000 partículas por galaxia
      for (let i = 0; i < 20000; i++) {
        // Distribución elíptica (galaxia)
        const radius = seededRandom() * 15;
        const theta = seededRandom() * Math.PI * 2;
        const phi = Math.acos(2 * seededRandom() - 1);
        
        // Aplanar en el eje Y para que parezcan discos galácticos
        const x = center.x + radius * Math.sin(phi) * Math.cos(theta);
        const y = center.y + (radius * Math.sin(phi) * Math.sin(theta)) * 0.1; // * 0.1 lo aplasta
        const z = center.z + radius * Math.cos(phi);

        pts.push(x, y, z);
        
        // Color basado en distancia al centro (Núcleo brillante, bordes oscuros)
        const dist = new THREE.Vector3(x, y, z).distanceTo(center);
        if (dist < 3) {
          cols.push(1, 1, 1); // Núcleo Blanco
        } else if (dist < 8) {
          cols.push(0.4, 0.8, 0.5); // Halo Verde Técnico
        } else {
          cols.push(0.1, 0.2, 0.15); // Polvo oscuro
        }
      }

      // El offset para el Tether 3D (Hacia arriba a la izquierda para mantener consistencia)
      const offsetPos = center.clone().add(new THREE.Vector3(-4, 4, 0));

      hudNodes.push({
        pos: center,
        offsetPos: offsetPos,
        id: `prj-${idx + 1}`,
        name: projectNames[idx],
        metadata: "SYS_ARCH_V2"
      });
    });

    // Polvo intergaláctico de fondo (Puntos sueltos en el vacío)
    for(let i=0; i<30000; i++) {
      const p = new THREE.Vector3(
        (seededRandom() - 0.5) * 80,
        (seededRandom() - 0.5) * 80,
        (seededRandom() - 0.5) * 80
      );
      pts.push(p.x, p.y, p.z);
      cols.push(0.15, 0.15, 0.15); // Muy oscuro
    }

    // --- BIO-TECH BODIES (Asteroides y Soles) ---
    const asteroidMatrices: THREE.Matrix4[] = [];
    const sunsMatrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (const center of clusterCenters) {
      // 5 Soles por galaxia
      for (let i = 0; i < 5; i++) {
        dummy.position.copy(center).add(new THREE.Vector3(
          (seededRandom() - 0.5) * 6,
          (seededRandom() - 0.5) * 2,
          (seededRandom() - 0.5) * 6
        ));
        const scale = 0.5 + seededRandom() * 0.8;
        dummy.scale.set(scale, scale, scale);
        dummy.rotation.set(seededRandom() * Math.PI, seededRandom() * Math.PI, 0);
        dummy.updateMatrix();
        sunsMatrices.push(dummy.matrix.clone());
      }

      // 40 Asteroides por galaxia
      for (let i = 0; i < 40; i++) {
        dummy.position.copy(center).add(new THREE.Vector3(
          (seededRandom() - 0.5) * 12,
          (seededRandom() - 0.5) * 4,
          (seededRandom() - 0.5) * 12
        ));
        const scale = 0.2 + seededRandom() * 0.6;
        dummy.scale.set(scale, scale * (0.5 + seededRandom()*0.5), scale);
        dummy.rotation.set(seededRandom() * Math.PI, seededRandom() * Math.PI, seededRandom() * Math.PI);
        dummy.updateMatrix();
        asteroidMatrices.push(dummy.matrix.clone());
      }
    }

    return { 
      positions: new Float32Array(pts), 
      colors: new Float32Array(cols),
      dataNodes: hudNodes,
      asteroidMatrices,
      sunsMatrices
    };
  }, []);

  // Enviar proyectos al store global
  useEffect(() => {
    setProjects(dataNodes);
  }, [dataNodes, setProjects]);

  // Inicializar Matrices de InstancedMesh
  useEffect(() => {
    if (asteroidesRef.current) {
      asteroidMatrices.forEach((mat, i) => {
        asteroidesRef.current!.setMatrixAt(i, mat);
      });
      asteroidesRef.current.instanceMatrix.needsUpdate = true;
    }
    if (solesRef.current) {
      sunsMatrices.forEach((mat, i) => {
        solesRef.current!.setMatrixAt(i, mat);
      });
      solesRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [asteroidMatrices, sunsMatrices]);

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
        {/* Usamos AdditiveBlending para que los cúmulos brillen como luz pura donde son densos */}
        <pointsMaterial 
          size={0.03} 
          vertexColors 
          transparent 
          opacity={0.6} 
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Asteroides Bio-Tech (Sólidos oscuros) */}
      <instancedMesh ref={asteroidesRef} args={[undefined, undefined, asteroidMatrices.length]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#010403" roughness={0.9} metalness={0.1} flatShading />
      </instancedMesh>

      {/* Soles Wireframe Luminosos */}
      <instancedMesh ref={solesRef} args={[undefined, undefined, sunsMatrices.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#00ffaa" wireframe transparent opacity={0.3} />
      </instancedMesh>

      {/* LiDAR HUD Overlays y Luces Centrales */}
      {dataNodes.map((node, i) => {
        const isHovered = hoveredNode === i;
        return (
          <group key={i}>
            {/* Luz intensa en el centro de cada galaxia */}
            <pointLight position={node.pos} intensity={isHovered ? 5 : 2} distance={15} color="#ffffff" />
            
            {/* Tether 3D Dinámico */}
            <Line 
              points={[node.pos, node.offsetPos]} 
              color="#ffffff" 
              opacity={isHovered ? 0.8 : 0.2} 
              transparent 
              lineWidth={1} 
            />

            <mesh position={node.pos}>
              <sphereGeometry args={[0.2]} />
              <meshBasicMaterial color={isHovered ? "#ffffff" : "#444444"} wireframe />
            </mesh>
            
            {/* Panel de Información en el Offset */}
            <Html position={node.offsetPos} center zIndexRange={[100, 0]}>
              <div 
                className={`relative flex items-start justify-start group transition-all duration-500 cursor-pointer origin-top-left ${isHovered ? 'z-50 scale-[0.6] md:scale-75 opacity-100' : 'z-10 scale-[0.4] md:scale-50 opacity-50'}`}
                onMouseEnter={() => { setHoveredNode(i); document.body.style.cursor = 'crosshair'; }}
                onMouseLeave={() => { setHoveredNode(null); document.body.style.cursor = 'auto'; }}
                onClick={() => {
                  setCameraTarget(node.pos);
                  router.push(`/project/${node.id}`);
                }}
              >
                
                {/* Panel Técnico Brutalista (Inspirado en imsd.jpg) */}
                <div className={`translate-x-10 translate-y-10 border border-white/30 bg-[#e2e4e9]/90 backdrop-blur-md p-4 text-xs font-mono text-black w-64 md:w-80 shadow-2xl transition-all ${isHovered ? 'border-black' : ''}`}>
                  
                  {/* Header Técnico */}
                  <div className="flex justify-between items-start border-b border-black/20 pb-2 mb-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg tracking-tighter">N L I A S C</span>
                      <span className="text-[8px] uppercase">PROCESSING DATA STATUS: ONLINE</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold bg-black text-white px-2 py-1 text-[10px] mb-1">SYSTEM 表示</div>
                      <div className="text-[10px]">A/B DPTM</div>
                      <div className="text-[10px] border-b border-black w-full text-right">2026 S-TYPE</div>
                    </div>
                  </div>

                  {/* Título del Proyecto */}
                  <div className="font-bold text-2xl tracking-tighter uppercase leading-none mb-2 mt-4">
                    {node.name}
                  </div>
                  
                  <div className="text-[9px] uppercase tracking-widest text-black/60 mb-4 flex justify-between">
                    <span>{node.metadata}</span>
                    <span>REF: {node.id}</span>
                  </div>
                  
                  {/* Imagen del Proyecto con UI Blueprint (Placeholder de ASCII/Blueprint) */}
                  <div className="w-full h-32 bg-white border border-black relative overflow-hidden flex flex-col justify-between p-2">
                    {/* Detalles HUD en la imagen */}
                    <div className="flex justify-between text-[8px]">
                      <span>VISION (00) LOCKED</span>
                      <span>MODULAR PATTERN</span>
                    </div>
                    
                    {/* Placeholder para la imagen o gráfica */}
                    <div className="flex-1 flex items-center justify-center">
                      {isHovered ? (
                        <div className="text-black/30 w-full h-full text-[6px] leading-[6px] overflow-hidden break-all text-justify font-sans mix-blend-multiply">
                          {/* Generar un bloque de texto que parezca código ASCII */}
                          {[...Array(50)].map(() => "██▒░░▒██").join("")}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border border-dashed border-black/50 animate-spin-slow"></div>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-[8px]">
                      <span>MANUFACTURING™</span>
                      <span>DATASET: LARGE</span>
                    </div>
                  </div>

                  {/* Footer Barcode */}
                  <div className="flex justify-between items-end mt-4 pt-2 border-t border-black/20">
                    <div className="text-[10px] font-bold text-black/50">
                      DEPARTMENT 41
                    </div>
                    {/* Fake Barcode */}
                    <div className="flex gap-[2px] h-6">
                      {[1,3,1,1,2,4,1,2,1,1,3].map((w, j) => (
                        <div key={j} className="bg-black h-full" style={{ width: `${w*1.5}px` }}></div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
