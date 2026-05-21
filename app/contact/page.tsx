import { PageTransition } from "@/components/ui/PageTransition";

export default function ContactPage() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center gap-12 text-center text-white">
        
        <div className="font-mono text-xs text-white/50 uppercase tracking-widest border border-white/20 bg-black/40 px-4 py-2 shadow-xl">
          INITIATE CONNECTION
        </div>

        {/* Email Gigante */}
        <a 
          href="mailto:hello@diego.video" 
          className="font-sans text-5xl md:text-8xl lg:text-[9vw] font-normal tracking-tighter text-white/90 hover:opacity-50 transition-opacity leading-none drop-shadow-2xl"
        >
          hello@<br className="md:hidden"/>diego.video
        </a>

        {/* Redes Técnicas */}
        <div className="flex gap-8 font-mono text-xs uppercase tracking-widest mt-8">
          <a href="#" className="border-b border-white/20 hover:border-white transition-colors pb-1">
            LINKEDIN
          </a>
          <a href="#" className="border-b border-white/20 hover:border-white transition-colors pb-1">
            GITHUB
          </a>
          <a href="#" className="border-b border-white/20 hover:border-white transition-colors pb-1">
            TWITTER
          </a>
        </div>

      </div>
    </PageTransition>
  );
}
