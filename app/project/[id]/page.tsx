import { PageTransition } from "@/components/ui/PageTransition";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <PageTransition>
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center text-white min-h-[60vh]">
        
        {/* Header del Proyecto */}
        <div className="border-b border-white/20 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="font-mono text-xs text-white/50 uppercase tracking-widest mb-4 flex gap-4">
              <span>PROJECT ID: {params.id}</span>
              <span>STATUS: ARCHIVED</span>
            </div>
            <h1 className="font-sans text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white/90 uppercase">
              Project Data
            </h1>
          </div>
          <div className="font-mono text-xs text-white/40 uppercase tracking-widest text-right">
            [ACCESS GRANTED]<br/>
            {new Date().toISOString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 w-full">
          {/* Main Visual Placeholder */}
          <div className="md:col-span-8 aspect-video border border-white/20 bg-black/40 flex items-center justify-center p-4 shadow-2xl relative overflow-hidden group">
             {/* Scanlines Effect */}
             <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_51%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
             
             {/* Texto Placeholder ASCII */}
             <div className="text-white/20 font-mono text-[8px] leading-[8px] break-all mix-blend-screen opacity-50 font-bold group-hover:opacity-100 transition-opacity">
                {[...Array(200)].map(() => "██▒░░▒██").join("")}
             </div>
             <div className="absolute font-mono text-xs uppercase tracking-widest text-white/50 bg-black/80 px-4 py-2 border border-white/20 backdrop-blur-md">
                MEDIA NOT LOADED
             </div>
          </div>

          {/* Technical Metadata Sidebar */}
          <div className="md:col-span-4 flex flex-col gap-6">
             <div className="border border-white/20 p-6 bg-black/40 shadow-2xl font-mono text-xs">
                <div className="border-b border-white/20 pb-2 mb-4 text-white/50 uppercase tracking-widest">
                  Metadata
                </div>
                <ul className="flex flex-col gap-4 text-white/70">
                  <li className="flex flex-col gap-1">
                    <span className="text-white/40">ROLE</span>
                    <span className="text-white">Creative Developer</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-white/40">TECH STACK</span>
                    <span className="text-white">WebGL, Three.js, React</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-white/40">YEAR</span>
                    <span className="text-white">2026</span>
                  </li>
                </ul>
             </div>

             <p className="font-sans text-sm leading-relaxed text-white/60">
                This project represents a structural milestone in creative engineering. Utilizing low-level shader programming to render millions of data points simultaneously without performance loss.
             </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
