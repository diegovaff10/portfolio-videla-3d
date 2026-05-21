import { PageTransition } from "@/components/ui/PageTransition";

export default function InfoPage() {
  return (
    <PageTransition>
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center text-white min-h-[60vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full">
          
          {/* Biografía Editorial */}
          <div className="flex flex-col gap-8">
            <h1 className="font-sans text-4xl md:text-6xl font-normal tracking-tight text-white/90">
              About<br/>
              The Engineer.
            </h1>
            <div className="font-sans text-sm md:text-base leading-relaxed text-white/70 max-w-md">
              <p className="mb-4">
                I blend creative design with intense engineering to build experiences that push the web forward. My work sits at the intersection of astrodynamics, graphic design, and low-level WebGL programming.
              </p>
              <p>
                Based in Buenos Aires, crafting digital artifacts for a global audience.
              </p>
            </div>
          </div>

          {/* Technical Data / Skills (Brutalista) */}
          <div className="flex flex-col gap-6 justify-center">
            <div className="border border-white/20 p-6 bg-black/40 font-mono text-xs shadow-2xl">
              <div className="border-b border-white/20 pb-2 mb-2 flex justify-between text-white/50">
                <span>MODULE: CAPABILITIES</span>
                <span>STS: ONLINE</span>
              </div>
              
              <ul className="flex flex-col gap-2 mt-4">
                <li className="flex justify-between hover:bg-white hover:text-black px-2 py-1 transition-colors">
                  <span>01. THREE.JS / WEBGL</span> <span>[EXPERT]</span>
                </li>
                <li className="flex justify-between hover:bg-white hover:text-black px-2 py-1 transition-colors">
                  <span>02. REACT / NEXT.JS</span> <span>[EXPERT]</span>
                </li>
                <li className="flex justify-between hover:bg-white hover:text-black px-2 py-1 transition-colors">
                  <span>03. GLSL SHADERS</span> <span>[ADVANCED]</span>
                </li>
                <li className="flex justify-between hover:bg-white hover:text-black px-2 py-1 transition-colors">
                  <span>04. UI/UX EDITORIAL</span> <span>[ADVANCED]</span>
                </li>
                <li className="flex justify-between hover:bg-white hover:text-black px-2 py-1 transition-colors">
                  <span>05. SPACE COLONIZATION</span> <span>[BIOLOGIC]</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
