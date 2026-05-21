"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({ 
  children, 
  onClick, 
  className = "" 
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  className?: string 
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Fuerza magnética (mientras más alto el multiplicador, más lejos se estira)
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {/* Elemento de texto interno con parallax inverso para efecto premium */}
      <motion.span 
        animate={{ x: x * 0.2, y: y * 0.2 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="pointer-events-none flex items-center justify-center w-full h-full"
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
