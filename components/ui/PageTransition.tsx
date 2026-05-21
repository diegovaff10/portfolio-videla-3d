"use client";

import { motion } from "framer-motion";

export function PageTransition({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-xl pointer-events-auto overflow-y-auto flex items-center justify-center p-6 md:p-12 pt-32 ${className}`}
    >
      {children}
    </motion.div>
  );
}
