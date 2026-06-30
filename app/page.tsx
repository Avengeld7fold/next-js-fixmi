import Hero3D from "@/components/Hero3D";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Background gradient orbs - subtle and cold diagnostics tone */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Technical Copy */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            {/* Diagnostic Status Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-1.5 text-xs font-mono text-text-secondary backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              STATUS DIAGNOSTIK: OPERASIONAL
            </div>

            <h1 className="mb-6 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-primary">Restorasi</span> Presisi
              <br />
              Perangkat Pintar Anda
            </h1>

            <p className="mb-10 max-w-[60ch] text-base leading-relaxed text-text-secondary md:text-lg">
              Kami mengembalikan performa optimal iPhone, iPad, dan Android Anda. 
              Didukung peralatan kalibrasi presisi, teknisi bersertifikasi, dan transparansi penuh.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Primary Cobalt Blue Button */}
              <a
                href="/pricelist"
                className="
                  inline-flex items-center justify-center gap-2 rounded-md bg-primary 
                  px-8 py-4 text-base font-semibold text-white 
                  transition-colors duration-200 hover:bg-primary-light 
                  active:scale-[0.98]
                "
              >
                Cek Pricelist
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              {/* Secondary Technical Outline Button */}
              <a
                href="#scroll-section"
                className="
                  inline-flex items-center justify-center gap-2 rounded-md border border-border 
                  bg-surface/40 px-8 py-4 text-base font-medium text-text-secondary 
                  backdrop-blur-sm transition-colors duration-200 
                  hover:border-primary hover:text-foreground
                "
              >
                Lihat Storytelling
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive Device Canvas */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <Hero3D />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-border p-1.5 bg-surface-alt/50">
            <div className="h-2.5 w-1 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </section>

      {/* Scroll Sequence Section */}
      <section id="scroll-section" className="relative min-h-screen bg-surface border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
              Scroll Storytelling
            </h2>
            <p className="mx-auto max-w-[65ch] text-base text-text-secondary">
              Bagian ini akan diintegrasikan dengan komponen <code className="font-mono text-primary text-sm px-1.5 py-0.5 rounded bg-surface-alt border border-border">ScrollSequence.tsx</code> pada Phase 4 menggunakan GSAP ScrollTrigger dan HTML5 Canvas rendering.
            </p>
          </div>
        </div>
      </section>

      {/* Why FIXMI Section */}
      <section className="relative min-h-[50vh] bg-background border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="text-center">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-5xl">
              Mengapa Memilih Layanan Kami?
            </h2>
            <p className="mx-auto max-w-[65ch] text-base text-text-secondary">
              Kami memadukan standar kalibrasi pabrikan dengan keahlian teknis tingkat lanjut untuk memastikan perangkat Anda kembali berfungsi sempurna tanpa kompromi kualitas.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
