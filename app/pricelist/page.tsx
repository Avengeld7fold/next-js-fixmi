import Link from "next/link";
import pricelist from "@/data/pricelist.json";

interface Category {
  slug: string;
  name: string;
  description: string;
  devices: { name: string; services: { name: string; price: number }[] }[];
}

export const metadata = {
  title: "Pricelist — FIXMI",
  description:
    "Daftar harga layanan perbaikan perangkat iPhone, iPad, dan Android di FIXMI. Harga transparan, tanpa biaya tersembunyi.",
};

export default function PricelistPage() {
  const categories: Category[] = pricelist.categories;

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Page heading */}
        <div className="mb-16">
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Daftar Harga Layanan
          </h1>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-text-secondary">
            Pilih kategori perangkat untuk melihat estimasi biaya perbaikan.
            Seluruh harga sudah termasuk jasa teknisi dan garansi servis.
          </p>
        </div>

        {/* Category navigation — compact list, not identical card grid */}
        <nav aria-label="Kategori perangkat">
          <ul className="space-y-4">
            {categories.map((cat) => {
              const totalDevices = cat.devices.length;
              const totalServices = cat.devices.reduce(
                (sum, d) => sum + d.services.length,
                0
              );

              return (
                <li key={cat.slug}>
                  <Link
                    href={`/pricelist/${cat.slug}`}
                    className="
                      group flex items-center justify-between
                      rounded-lg border border-border bg-surface
                      px-6 py-5
                      transition-colors duration-200 ease-out
                      hover:border-primary hover:bg-surface-alt
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                        {cat.name}
                      </h2>
                      <p className="mt-1 text-sm text-text-secondary line-clamp-1">
                        {cat.description}
                      </p>
                    </div>

                    <div className="ml-6 flex shrink-0 items-center gap-4">
                      {/* Counts */}
                      <div className="hidden text-right sm:block">
                        <span className="block font-mono text-sm tabular-nums text-text-muted">
                          {totalDevices} perangkat
                        </span>
                        <span className="block font-mono text-xs tabular-nums text-text-muted">
                          {totalServices} layanan
                        </span>
                      </div>
                      {/* Arrow */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-text-muted transition-colors duration-200 group-hover:text-primary"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
}
