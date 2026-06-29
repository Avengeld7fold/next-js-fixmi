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
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${
          isScrolled
            ? "fixmi-glass-strong border-b border-border-light shadow-lg shadow-black/20"
            : "bg-transparent border-b border-transparent"
        }
      `}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center gap-2"
          >
            {/* Logo icon */}
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-105">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
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
            {/* Logo text */}
            <span className="text-xl font-bold tracking-tight">
              <span className="fixmi-gradient-text">FIX</span>
              <span className="text-foreground">MI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? "text-primary-light"
                        : "text-text-secondary hover:text-foreground"
                    }
                  `}
                >
                  {link.label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-light shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                  )}
                </Link>
              );
            })}
            {/* CTA Button */}
            <Link
              href="/pricelist"
              className="
                ml-4 inline-flex items-center gap-2 rounded-xl
                bg-gradient-to-r from-primary to-accent
                px-5 py-2.5 text-sm font-semibold text-white
                shadow-lg shadow-primary/25
                transition-all duration-300 ease-out
                hover:shadow-xl hover:shadow-primary/30
                hover:brightness-110
                active:scale-[0.97]
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
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "translate-y-[7px] rotate-45"
                    : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
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
          transition-all duration-500
          ${
            isMobileMenuOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
          }
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Menu Panel */}
        <div
          className={`
            absolute top-0 right-0 h-full w-[280px]
            fixmi-glass-strong border-l border-border-light
            transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
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
                    rounded-xl px-4 py-3 text-base font-medium
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-primary/10 text-primary-light"
                        : "text-text-secondary hover:bg-surface-alt hover:text-foreground"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-3 h-px bg-border-light" />
            <Link
              href="/pricelist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="
                flex items-center justify-center gap-2 rounded-xl
                bg-gradient-to-r from-primary to-accent
                px-5 py-3 text-base font-semibold text-white
                shadow-lg shadow-primary/25
                transition-all duration-300
                active:scale-[0.97]
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
