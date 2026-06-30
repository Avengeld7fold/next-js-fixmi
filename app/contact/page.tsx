import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — FIXMI",
  description:
    "Hubungi kami untuk konsultasi perbaikan perangkat pintar Anda. Layanan cepat, harga transparan.",
};

export default function ContactPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-32 w-full">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            <span className="text-primary">Hubungi</span> Kami
          </h1>
          <p className="mx-auto max-w-[55ch] text-base text-text-secondary md:text-lg">
            Konsultasikan kebutuhan perbaikan perangkat pintar Anda.
            Tim teknisi bersertifikasi kami siap membantu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Info */}
          <div className="fixmi-card p-8 flex flex-col gap-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Informasi Kontak
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground">Telepon</p>
                  <p className="text-sm text-text-secondary">+62 812 3456 7890</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-sm text-text-secondary">hello@fixmi.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground">Alamat</p>
                  <p className="text-sm text-text-secondary">
                    Jl. Teknologi No. 42, Jakarta Selatan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="fixmi-card p-8 flex flex-col gap-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Jam Operasional
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-text-secondary">Senin — Jumat</span>
                <span className="text-sm font-semibold text-foreground">09:00 — 21:00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-text-secondary">Sabtu</span>
                <span className="text-sm font-semibold text-foreground">10:00 — 18:00</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-text-secondary">Minggu</span>
                <span className="text-sm font-semibold text-primary">Tutup</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-auto">
              * Walk-in welcome. Booking di luar jam operasional via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
