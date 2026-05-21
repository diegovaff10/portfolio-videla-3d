export default function Home() {
  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 md:top-12 z-10 flex flex-col items-center justify-center animate-[pulse_4s_ease-in-out_infinite] pointer-events-none">
      {/* Placeholder del Logo Flotante */}
      <div className="w-16 h-16 border border-[#00d0ff]/50 rounded-full flex items-center justify-center bg-[#001020]/50 backdrop-blur-md shadow-[0_0_30px_rgba(0,208,255,0.2)]">
        <span className="font-display font-bold text-2xl text-[#00d0ff] tracking-tighter">DV</span>
      </div>
    </div>
  );
}
