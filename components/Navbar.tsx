"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/pricelist", label: "Pricelist" },
];

const SCROLL_THRESHOLD = 20;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300 ease-out
        ${
          isScrolled
            ? "fixmi-glass-strong border-b border-border shadow-md"
            : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center gap-3"
          >
            {/* Logo icon - Clinical Diagnostic Style */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary bg-surface shadow-sm transition-colors duration-200 group-hover:bg-surface-alt">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary transition-transform duration-300 group-hover:rotate-12"
              >
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Logo text - Technical Font */}
            <span className="font-display text-lg font-bold tracking-tight uppercase">
              <span className="text-primary">FIX</span>
              <span className="text-foreground">MI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-md
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-primary"
                        : "text-text-secondary hover:text-foreground"
                    }
                  `}
                >
                  {link.label}
                  {/* Precise active underline indicator instead of floating dots */}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary" />
                  )}
                </Link>
              );
            })}
            {/* Technical solid Cobalt Blue button */}
            <Link
              href="/pricelist"
              className="
                ml-4 inline-flex items-center gap-2 rounded-md
                bg-primary px-5 py-2 text-sm font-semibold text-white
                transition-all duration-200 ease-out
                hover:bg-primary-light active:scale-[0.98]
              "
            >
              Cek Harga
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-foreground md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex h-5 w-5 flex-col items-center justify-center gap-[5px]">
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-200 ${
                  isMobileMenuOpen
                    ? "translate-y-[7px] rotate-45"
                    : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-200 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-200 ${
                  isMobileMenuOpen
                    ? "-translate-y-[7px] -rotate-45"
                    : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300
          ${
            isMobileMenuOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Menu Panel */}
        <div
          className={`
            absolute top-0 right-0 h-full w-[280px]
            bg-surface border-l border-border
            transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex flex-col gap-2 px-6 pt-24">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    rounded-md px-4 py-3 text-base font-medium
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-surface-alt text-primary"
                        : "text-text-secondary hover:bg-surface-alt hover:text-foreground"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-3 h-px bg-border" />
            <Link
              href="/pricelist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                flex items-center justify-center gap-2 rounded-md
                bg-primary px-5 py-3 text-base font-semibold text-white
                transition-all duration-200
                hover:bg-primary-light active:scale-[0.98]
              "
            >
              Cek Harga
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
