"use client";

import { useState } from "react";

interface Service {
  name: string;
  price: number;
}

interface PriceTableProps {
  deviceName: string;
  services: Service[];
}

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PriceTable({ deviceName, services }: PriceTableProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="mb-8">
      {/* Device header — acts as an accordion toggle on mobile */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="
          group flex w-full items-center justify-between
          border-b border-border pb-3 text-left
          sm:cursor-default
        "
        aria-expanded={isExpanded}
      >
        <h3 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {deviceName}
        </h3>
        <span className="text-xs font-mono text-text-muted sm:hidden">
          {isExpanded ? "Sembunyikan" : `${services.length} layanan`}
        </span>
      </button>

      {/* Service rows */}
      <div
        className={`
          overflow-hidden transition-[max-height,opacity] duration-300 ease-out
          ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 sm:max-h-[2000px] sm:opacity-100"}
        `}
      >
        <table className="mt-1 w-full">
          <thead className="sr-only">
            <tr>
              <th>Layanan</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, idx) => (
              <tr
                key={idx}
                className="
                  group/row border-b border-border-light
                  transition-colors duration-150 ease-out
                  hover:bg-surface-alt
                "
              >
                <td className="py-3 pr-4 text-sm text-text-secondary group-hover/row:text-foreground transition-colors duration-150">
                  {service.name}
                </td>
                <td className="py-3 text-right font-mono text-sm tabular-nums text-foreground whitespace-nowrap">
                  {formatRupiah(service.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
