import { notFound } from "next/navigation";
import Link from "next/link";
import pricelist from "@/data/pricelist.json";
import PriceTable from "@/components/PriceTable";

interface Category {
  slug: string;
  name: string;
  description: string;
  devices: { name: string; services: { name: string; price: number }[] }[];
}

interface PageProps {
  params: Promise<{ kategori: string }>;
}

export async function generateStaticParams() {
  return pricelist.categories.map((cat: Category) => ({
    kategori: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { kategori } = await params;
  const category = pricelist.categories.find(
    (c: Category) => c.slug === kategori
  );
  if (!category) return { title: "Not Found — FIXMI" };

  return {
    title: `Harga ${category.name} — FIXMI`,
    description: category.description,
  };
}

export default async function KategoriPage({ params }: PageProps) {
  const { kategori } = await params;
  const category = pricelist.categories.find(
    (c: Category) => c.slug === kategori
  );

  if (!category) {
    notFound();
  }

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link
                href="/pricelist"
                className="transition-colors duration-150 hover:text-foreground"
              >
                Pricelist
              </Link>
            </li>
            <li aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </li>
            <li className="text-foreground font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Page heading */}
        <div className="mb-12">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Layanan {category.name}
          </h1>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-text-secondary">
            {category.description}
          </p>
        </div>

        {/* Device tables */}
        <div>
          {category.devices.map((device) => (
            <PriceTable
              key={device.name}
              deviceName={device.name}
              services={device.services}
            />
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 border-t border-border pt-8">
          <Link
            href="/pricelist"
            className="
              inline-flex items-center gap-2 text-sm font-medium text-text-secondary
              transition-colors duration-150 hover:text-primary
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Kembali ke semua kategori
          </Link>
        </div>
      </div>
    </section>
  );
}
