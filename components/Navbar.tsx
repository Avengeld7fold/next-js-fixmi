"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "HOME" },
  { href: "/pricelist", label: "PRICING" },
  { href: "/promo", label: "PROMO" },
  { href: "/gallery", label: "GALLERY REPAIR" },
  { href: "/about", label: "ABOUT US" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isBookNowHovered, setIsBookNowHovered] = useState<boolean>(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className="relative z-50 w-full"
      style={{ background: "var(--fixmi-bg-glass)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid var(--fixmi-border)" }}
    >
      {/* Orange reveal strip — appears behind BOOK NOW on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-full pointer-events-none transition-opacity duration-300"
        style={{
          background: "var(--fixmi-primary)",
          opacity: isBookNowHovered ? 1 : 0,
          zIndex: 0,
        }}
      />

      <nav
        className="relative z-10 mx-auto w-full max-w-7xl px-6 flex items-center justify-between"
        style={{ height: "72px" }}
      >
        {/* Logo — Left */}
        <Link href="/" className="group flex items-center gap-2.5 no-underline shrink-0">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:rotate-12"
            style={{ color: "var(--fixmi-primary)" }}
          >
            <path
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            style={{
              fontFamily: "'Neue Montreal', var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: "var(--fixmi-primary)",
              lineHeight: 1,
            }}
          >
            FIXMI
          </span>
        </Link>

        {/* Desktop Menu — Center */}
        <ul className="hidden lg:flex items-center gap-2 list-none m-0 p-0">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative inline-flex items-center no-underline whitespace-nowrap"
                  style={{
                    padding: "8px 20px",
                    fontFamily: "'Neue Montreal', var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    color: "var(--fixmi-primary)",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {link.label}
                  {/* White underline — animates left to right on hover */}
                  <span
                    className={`
                      absolute bottom-0.5 left-5 right-5 h-[2px] 
                      transition-transform duration-300 ease-out origin-left
                      ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                    `}
                    style={{ background: "#ffffff" }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA — Right (Desktop) */}
        <div className="hidden lg:flex items-center shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center no-underline transition-all duration-300"
            style={{
              padding: "12px 28px",
              fontFamily: "'Neue Montreal', var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#ffffff",
              background: "var(--fixmi-primary)",
              borderRadius: "6px",
              textTransform: "uppercase" as const,
              transform: isBookNowHovered ? "translateY(6px)" : "translateY(0)",
            }}
            onMouseEnter={() => setIsBookNowHovered(true)}
            onMouseLeave={() => setIsBookNowHovered(false)}
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="flex flex-col items-center justify-center gap-[6px] w-11 h-11 p-0 border-none bg-transparent cursor-pointer lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`block w-6 h-[2px] rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "translate-y-[8px] rotate-45" : ""
            }`}
            style={{ background: "var(--fixmi-primary)" }}
          />
          <span
            className={`block w-6 h-[2px] rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0 scale-0" : ""
            }`}
            style={{ background: "var(--fixmi-primary)" }}
          />
          <span
            className={`block w-6 h-[2px] rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "-translate-y-[8px] -rotate-45" : ""
            }`}
            style={{ background: "var(--fixmi-primary)" }}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-[320px] transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            background: "var(--fixmi-bg-glass-strong)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderLeft: "1px solid var(--fixmi-border)",
          }}
        >
          <div className="flex flex-col" style={{ padding: "96px 32px 32px" }}>
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block no-underline transition-colors duration-200"
                  style={{
                    padding: "14px 4px",
                    fontFamily: "'Neue Montreal', var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: isActive ? "var(--fixmi-primary)" : "var(--fixmi-text-secondary)",
                    textTransform: "uppercase" as const,
                    borderBottom: "1px solid var(--fixmi-border)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center no-underline mt-6 transition-colors duration-200"
              style={{
                padding: "14px 24px",
                fontFamily: "'Neue Montreal', var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#ffffff",
                background: "var(--fixmi-primary)",
                borderRadius: "6px",
                textTransform: "uppercase" as const,
              }}
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
