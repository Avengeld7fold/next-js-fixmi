export default function Home() {
  return (
    <>
      {/* Hero Section Placeholder */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/6 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-light bg-surface/50 px-4 py-1.5 text-sm text-text-secondary backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            Premium Repair Service
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            <span className="fixmi-gradient-text">Perbaiki</span> Perangkat
            <br />
            Pintarmu{" "}
            <span className="fixmi-gradient-text">Sekarang</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            Layanan perbaikan iPhone, iPad, dan Android dengan kualitas terbaik.
            Teknisi berpengalaman, spare part original, garansi resmi.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/pricelist"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-accent px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:brightness-110 active:scale-[0.97]"
            >
              Lihat Harga
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
            <a
              href="#scroll-section"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/50 px-8 py-4 text-base font-medium text-text-secondary backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:text-foreground"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-text-muted/30 p-1.5">
            <div className="h-2 w-1 rounded-full bg-text-muted/50" />
          </div>
        </div>
      </section>

      {/* Spacer sections for scroll testing */}
      <section id="scroll-section" className="relative min-h-screen bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              <span className="fixmi-gradient-text">Scroll Sequence</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Bagian ini akan diganti dengan komponen ScrollSequence.tsx di Phase 4
            </p>
          </div>
        </div>
      </section>

      <section className="relative min-h-[50vh] bg-background">
        <div className="mx-auto max-w-7xl px-6 py-32">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Kenapa <span className="fixmi-gradient-text">FIXMI</span>?
            </h2>
            <p className="text-lg text-text-secondary">
              Placeholder section — akan dikembangkan lebih lanjut
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
