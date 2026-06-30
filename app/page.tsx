import Hero3D from "@/components/Hero3D";
import ScrollSequence from "@/components/ScrollSequence";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-16 lg:py-0">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-0 lg:-mt-12">

            {/* Left Column — Big Title */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
              <h1
                style={{
                  fontFamily: "var(--font-bayon), sans-serif",
                  fontSize: "clamp(54px, 7vw, 140px)",
                  fontWeight: 400,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "var(--fixmi-primary)",
                  textTransform: "uppercase" as const,
                  margin: 0,
                }}
              >
                BROKEN
                <br />
                PHONE?
              </h1>
            </div>

            {/* Center Column — 3D Model */}
            <div className="lg:col-span-4 flex items-center justify-center w-full min-h-[320px] lg:min-h-[500px]">
              <Hero3D />
            </div>

            {/* Right Column — Big Title + Subtitle */}
            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end text-center lg:text-right">
              <p
                style={{
                  fontFamily: "var(--font-neue-montreal), sans-serif",
                  fontSize: "clamp(10px, 0.75vw, 13px)",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  color: "var(--fixmi-text-secondary)",
                  textTransform: "uppercase" as const,
                  marginBottom: "16px",
                  lineHeight: 1.6,
                }}
              >
                YOUR TRUSTED
                <br />
                SMART DEVICE REPAIR
                <br />
                SERVICE!
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-bayon), sans-serif",
                  fontSize: "clamp(54px, 7vw, 140px)",
                  fontWeight: 400,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "var(--fixmi-primary)",
                  textTransform: "uppercase" as const,
                  margin: 0,
                }}
              >
                WE
                <br />
                FIX
                <br />
                IT!
              </h2>
            </div>
          </div>
        </div>

        {/* Social Media Icons — Bottom Left */}
        <div className="absolute bottom-10 left-10 z-20 flex items-center gap-3">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110"
            style={{ border: "1.5px solid var(--fixmi-primary)" }}
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fixmi-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          {/* TikTok */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110"
            style={{ border: "1.5px solid var(--fixmi-primary)" }}
            aria-label="TikTok"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--fixmi-primary)">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.12v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.51a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.92z" />
            </svg>
          </a>
          {/* WhatsApp */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110"
            style={{ border: "1.5px solid var(--fixmi-primary)" }}
            aria-label="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--fixmi-primary)">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </section>

      {/* Scroll Sequence Section */}
      <section id="scroll-section" className="relative border-t border-border">
        <ScrollSequence />
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
