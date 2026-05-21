"use client";

import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [dataStream, setDataStream] = useState<string[]>([]);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Efecto de Data Scanner (Números y Hex aleatorios)
  useEffect(() => {
    if (isReady) return;

    const interval = setInterval(() => {
      const generateHex = () => Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0').toUpperCase();
      const generateBin = () => Math.random() > 0.5 ? '1' : '0';
      const generateLine = () => {
        let line = '';
        for(let i=0; i<8; i++) line += generateHex() + ' ';
        for(let i=0; i<16; i++) line += generateBin();
        return line;
      };

      setDataStream(prev => {
        const newStream = [generateLine(), generateLine(), generateLine(), ...prev];
        return newStream.slice(0, 30); // Mantener 30 líneas máximo en pantalla
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isReady]);

  // Temporizador Garantizado de 3 segundos
  useEffect(() => {
    // Aumentar un progreso falso para el efecto visual
    const progressInterval = setInterval(() => {
      setFakeProgress(p => {
        const next = p + (Math.random() * 8 + 2);
        return next >= 100 ? 100 : next;
      });
    }, 150);

    const timer = setTimeout(() => {
      clearInterval(progressInterval);
      setFakeProgress(100);
      setIsReady(true);
      
      // Esperar el fadeout antes de destruir el componente
      setTimeout(() => {
        setIsHidden(true);
      }, 1500);

    }, 3000); // Garantiza que termine siempre a los 3 segundos

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (isHidden) return null;

  return (
    <div 
      className={`fixed inset-0 z-[999] bg-[#020510] text-[#00d0ff] flex flex-col justify-end p-8 md:p-12 font-mono text-[10px] overflow-hidden transition-opacity duration-1000 ease-in-out ${isReady ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Grid Overlay para darle textura técnica */}
      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-screen" />
      
      {/* Flujo de datos (Data Scanner) */}
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-start opacity-30 mask-image-gradient-b">
        {dataStream.map((line, i) => (
          <div key={i} className="whitespace-pre truncate leading-none mb-1 opacity-70">
            {line}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-4">
          <div className="font-bold text-white text-xs mb-1">
            {isReady ? "SYSTEM ONLINE" : "DECODING POINT CLOUD DATA..."}
          </div>
          <div className="flex gap-4">
            <span>MEM: 0x00A1F</span>
            <span>SEC: ENCRYPTED</span>
            <span className="animate-pulse text-white">[{Math.floor(fakeProgress)}%]</span>
          </div>
        </div>

        {/* Barra de Progreso Brutalista */}
        <div className="w-full h-1 bg-[#00d0ff]/20">
          <div 
            className="h-full bg-[#00d0ff] transition-all duration-75"
            style={{ width: `${fakeProgress}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 opacity-50">
          <span>PORTFOLIO // DB</span>
          <span>INIT_SEQ</span>
        </div>
      </div>
    </div>
  );
}
