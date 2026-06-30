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
    <header className="navbar-header relative z-50 w-full">
      {/* Orange reveal strip — sits behind BOOK NOW, revealed on hover */}
      <div
        className={`
          absolute top-0 left-0 right-0 h-full
          bg-primary
          transition-all duration-300 ease-out
          pointer-events-none
          ${isBookNowHovered ? "opacity-100" : "opacity-0"}
        `}
      />

      <nav className="navbar-inner relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center gap-3 shrink-0"
          >
            {/* Logo icon */}
            <div className="relative flex h-10 w-10 items-center justify-center">
              <svg
                width="28"
                height="28"
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
            {/* Logo text */}
            <span className="font-display text-xl font-extrabold tracking-tight uppercase leading-none">
              <span className="text-primary">FIX</span>
              <span className="text-primary">MI</span>
            </span>
          </Link>

          {/* Desktop Navigation — Center */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="navbar-link group relative px-5 py-2 text-[13px] font-bold tracking-[0.08em] transition-colors duration-200"
                  style={{ color: "var(--fixmi-primary)" }}
                >
                  {link.label}
                  {/* White underline animation: left to right on hover */}
                  <span
                    className={`
                      absolute bottom-0 left-5 right-5 h-[2px] bg-white
                      transition-transform duration-300 ease-out origin-left
                      ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA — BOOK NOW */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/contact"
              className={`
                navbar-booknow relative inline-flex items-center justify-center
                rounded-md bg-primary px-7 py-3 text-[13px] font-bold tracking-[0.08em] text-white uppercase
                transition-all duration-300 ease-out
                hover:bg-primary-light
                ${isBookNowHovered ? "translate-y-[6px]" : "translate-y-0"}
              `}
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
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-md text-primary transition-colors lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex h-5 w-6 flex-col items-center justify-center gap-[6px]">
              <span
                className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "translate-y-[8px] rotate-45"
                    : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "-translate-y-[8px] -rotate-45"
                    : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Bottom border line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border z-10" />

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden
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
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Menu Panel — Full-screen slide from right */}
        <div
          className={`
            absolute top-0 right-0 h-full w-full max-w-[320px]
            bg-surface border-l border-border
            transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex flex-col px-8 pt-24 pb-8 h-full">
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      py-3 px-2 text-[13px] font-bold tracking-[0.08em] uppercase
                      border-b border-border/50
                      transition-colors duration-200
                      ${
                        isActive
                          ? "text-primary"
                          : "text-text-secondary hover:text-primary"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8">
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                  flex items-center justify-center w-full
                  rounded-md bg-primary px-6 py-4
                  text-[13px] font-bold tracking-[0.08em] text-white uppercase
                  transition-all duration-200
                  hover:bg-primary-light active:scale-[0.98]
                "
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
