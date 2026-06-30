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
    <header className="navbar-header">
      {/* Orange reveal strip — hidden behind BOOK NOW, revealed on hover */}
      <div
        className={`
          navbar-reveal-strip
          ${isBookNowHovered ? "navbar-reveal-strip--active" : ""}
        `}
      />

      <nav className="navbar-nav">
        {/* Logo — Left */}
        <Link href="/" className="navbar-logo group">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="navbar-logo-icon"
          >
            <path
              d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="navbar-logo-text">FIXMI</span>
        </Link>

        {/* Desktop Menu — Center */}
        <ul className="navbar-menu">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`navbar-menu-link ${isActive ? "navbar-menu-link--active" : ""}`}
                >
                  {link.label}
                  <span className="navbar-menu-underline" />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA — Right */}
        <div className="navbar-cta-wrapper">
          <Link
            href="/contact"
            className={`navbar-cta ${isBookNowHovered ? "navbar-cta--hovered" : ""}`}
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
          className="navbar-hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className={`navbar-hamburger-line ${isMobileMenuOpen ? "navbar-hamburger-line--top-open" : ""}`} />
          <span className={`navbar-hamburger-line ${isMobileMenuOpen ? "navbar-hamburger-line--mid-open" : ""}`} />
          <span className={`navbar-hamburger-line ${isMobileMenuOpen ? "navbar-hamburger-line--bot-open" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-mobile-overlay ${isMobileMenuOpen ? "navbar-mobile-overlay--open" : ""}`}>
        <div
          className="navbar-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={`navbar-mobile-panel ${isMobileMenuOpen ? "navbar-mobile-panel--open" : ""}`}>
          <div className="navbar-mobile-content">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`navbar-mobile-link ${isActive ? "navbar-mobile-link--active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="navbar-mobile-divider" />
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="navbar-mobile-cta"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
