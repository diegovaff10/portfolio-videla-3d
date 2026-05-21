"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const setCameraTarget = useStore(state => state.setCameraTarget);
  const projects = useStore(state => state.projects);

  return (
    <>
      {/* Header (Top) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-6 md:p-12 font-sans text-xs md:text-sm uppercase tracking-widest font-medium text-white pointer-events-none">
        <Link href="/" className="pointer-events-auto cursor-pointer hover:opacity-50 transition-opacity">
          DIEGO VIDELA <br /> 
          <span className="text-white/50">CREATIVE DEVELOPER</span>
        </Link>
        
        <nav className="pointer-events-auto flex gap-8">
          <Link 
            href="/" 
            onClick={() => setCameraTarget(null)}
            className={`hover:opacity-50 transition-opacity ${pathname === '/' ? 'opacity-50' : ''}`}
          >
            Index
          </Link>
          <Link 
            href="/info" 
            onClick={() => setCameraTarget(null)}
            className={`hover:opacity-50 transition-opacity ${pathname === '/info' ? 'opacity-50' : ''}`}
          >
            Info
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setCameraTarget(null)}
            className={`hover:opacity-50 transition-opacity ${pathname === '/contact' ? 'opacity-50' : ''}`}
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Proyecto / Navegación Lateral (HUD Estelar) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto hidden md:flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
        <div className="border-b border-white/20 pb-2 mb-2 text-white/30">
          GALAXY CLUSTERS
        </div>
        {projects.map((proj, idx) => (
          <button 
            key={proj.id}
            onClick={() => {
              setCameraTarget(proj.pos);
              router.push(`/project/${proj.id}`);
            }}
            className="text-left hover:text-white hover:translate-x-2 transition-all flex items-center gap-2"
          >
            <span className="opacity-40">[{String(idx + 1).padStart(2, '0')}]</span>
            {proj.name}
          </button>
        ))}
      </div>

      {/* Info lateral (Bottom Right) */}
      <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-50 text-right font-mono text-xs text-white/40 uppercase tracking-widest flex flex-col gap-1 pointer-events-none">
        <span>LAT: -34.6037</span>
        <span>LNG: -58.3816</span>
        <span>SYSTEM: ONLINE</span>
      </div>
    </>
  );
}
