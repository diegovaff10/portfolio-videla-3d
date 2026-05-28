"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const setCameraTarget = useStore(state => state.setCameraTarget);
  const projects = useStore(state => state.projects);

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ocultar el onboarding agresivo después de 6 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowOnboarding(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Header (Top) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-6 md:p-12 font-sans text-xs md:text-sm uppercase tracking-widest font-medium text-white pointer-events-none">
        <Link href="/" className="pointer-events-auto cursor-pointer hover:opacity-50 transition-opacity">
          DIEGO VIDELA <br /> 
          <span className="text-white/50">CREATIVE DEVELOPER</span>
        </Link>
        
        {/* Nav Desktop */}
        <nav className="pointer-events-auto hidden md:flex gap-8">
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
        {/* Botón Menu Mobile */}
        <button 
          className="md:hidden pointer-events-auto bg-[#00d0ff] text-black font-bold font-mono px-4 py-2 shadow-[0_0_15px_rgba(0,208,255,0.3)] z-[120]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "[X] CLOSE" : "MENU"}
        </button>
      </header>

      {/* Modal Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-[#020510]/95 backdrop-blur-xl flex flex-col items-center justify-center font-mono text-[#00d0ff] pointer-events-auto p-8">
          <div className="flex flex-col gap-8 text-2xl text-center mb-12 border-b border-[#00d0ff]/30 pb-8 w-full max-w-sm">
            <Link href="/" onClick={() => { setCameraTarget(null); setMobileMenuOpen(false); }}>Index</Link>
            <Link href="/info" onClick={() => { setCameraTarget(null); setMobileMenuOpen(false); }}>Info</Link>
            <Link href="/contact" onClick={() => { setCameraTarget(null); setMobileMenuOpen(false); }}>Contact</Link>
          </div>
          
          <div className="flex flex-col gap-4 text-center w-full max-w-sm">
            <div className="text-xs text-white/50 mb-2">PORTFOLIO // DB</div>
            {projects.map((proj, idx) => (
              <button 
                key={proj.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCameraTarget(proj.pos);
                  setTimeout(() => {
                    router.push(`/project/${proj.id}`);
                  }, 2000);
                }}
                className="text-white hover:text-[#00d0ff] text-lg border border-white/10 py-3 bg-white/5 active:bg-[#00d0ff] active:text-black transition-all"
              >
                [{String(idx + 1).padStart(2, '0')}] {proj.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Branding (Bottom Left) */}
      <div className="fixed bottom-6 left-6 md:bottom-12 md:left-12 z-50 flex flex-col font-display uppercase tracking-tighter mix-blend-difference pointer-events-none text-white">
        <span className="text-2xl md:text-4xl font-bold leading-none">Diego Videla</span>
        <span className="text-xs md:text-sm tracking-widest text-[#00d0ff] mt-1 font-mono">Digital Experience</span>
      </div>

      {/* Navegación lateral (Menú de Proyectos) - SOLO EN HOME Y DESKTOP */}
      {pathname === '/' && (
        <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 font-mono text-sm tracking-widest text-white/50 mix-blend-difference pointer-events-auto">
        <div className="border-b border-white/20 pb-2 mb-2 text-white/30">
          Projects
        </div>
        {projects.map((proj, idx) => (
          <button 
            key={proj.id}
            onClick={() => {
              setCameraTarget(proj.pos);
              setTimeout(() => {
                router.push(`/project/${proj.id}`);
              }, 2000);
            }}
            className="text-left hover:text-white hover:translate-x-2 transition-all flex items-center gap-2"
          >
            <span className="opacity-40">[{String(idx + 1).padStart(2, '0')}]</span>
            {proj.name}
          </button>
        ))}
        </nav>
      )}

      {/* Overlays WebGL - SOLO EN HOME */}
      {pathname === '/' && (
        <>
          {/* Info lateral (Bottom Right) */}
          <div className="fixed bottom-32 right-6 md:bottom-28 md:right-12 z-50 text-right font-mono text-xs text-white/40 uppercase tracking-widest flex flex-col gap-1 pointer-events-none hidden md:flex">
            <span>LAT: -34.6037</span>
            <span>LNG: -58.3816</span>
            <span>SYSTEM: ONLINE</span>
          </div>

          {/* Navigation Help Panel (Bottom Right) */}
          <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12 z-40 font-mono text-[10px] text-white/40 text-right pointer-events-none flex flex-col items-end gap-1 hidden md:flex">
            <div className="border-b border-white/20 pb-1 mb-1 font-bold text-white/60 tracking-widest uppercase">
              SYS.NAV_CONTROLS
            </div>
            <div className="flex justify-between w-40">
              <span>[CLICK + DRAG]</span>
              <span className="text-white/80">ORBIT</span>
            </div>
            <div className="flex justify-between w-40">
              <span>[SCROLL]</span>
              <span className="text-white/80">ZOOM</span>
            </div>
            <div className="flex justify-between w-40">
              <span>[CLICK NODE]</span>
              <span className="text-white/80">TRAVEL</span>
            </div>
            <div className="w-full h-[1px] bg-white/20 mt-2"></div>
          </div>

          {/* System Notification (Onboarding) */}
          {showOnboarding && (
            <div className="fixed top-6 right-6 md:top-12 md:right-12 z-[100] border-l-2 border-[#00d0ff] bg-[#001020]/90 backdrop-blur-md p-3 shadow-[0_0_20px_rgba(0,208,255,0.15)] flex items-start gap-3 w-64 transition-all duration-1000 ease-out animate-in fade-in slide-in-from-right-10 pointer-events-none">
              <div className="text-[#00d0ff] animate-pulse mt-[2px] text-xs">■</div>
              <div className="font-mono">
                <div className="text-[10px] font-bold text-white mb-1 tracking-widest">SYS.NOTIF //</div>
                <div className="text-[10px] text-[#00d0ff]/70 leading-tight">
                  Haz clic y arrastra el canvas para explorar el entorno 3D.
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
