export default function Home() {
  return (
    <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 pointer-events-none text-white z-10">
      {/* Titular Principal (Bottom Left) */}
      <div className="pointer-events-auto max-w-4xl">
        <h1 className="font-sans text-5xl md:text-7xl lg:text-9xl font-normal tracking-tight leading-[0.9] text-white/90">
          Digital<br/>
          Experiences<br/>
          & Engineering.
        </h1>
        <p className="mt-8 font-mono text-xs text-white/50 uppercase tracking-widest max-w-md">
          Galactic Vol. 02 / Point Cloud Engine.<br/>
          Interact with the LiDAR data nodes to explore selected works.
        </p>
      </div>
    </div>
  );
}
