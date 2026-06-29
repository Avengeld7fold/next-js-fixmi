# Design System Spec

## Color Palette (OKLCH)

We use a "Technical Diagnostic Instrument" color scheme: slate grays, cold titanium silvers, and a sharp clinical cobalt-blue accent.

```
--bg-primary:     oklch(12% 0.005 240)    /* Dark Slate Neutral (~#0f1115) */
--bg-secondary:   oklch(17% 0.006 240)    /* Dark Surface (~#16191f) */
--bg-tertiary:    oklch(22% 0.007 240)    /* Muted Border Slate (~#222630) */
--bg-glass:       rgba(15, 17, 21, 0.75)  /* Translucent Diagnostic Glass */
--border-neutral: oklch(25% 0.008 240)    /* Precision border line */

--text-primary:   oklch(95% 0.003 240)    /* Titanium White (~#f3f4f6) */
--text-secondary: oklch(70% 0.008 240)    /* Clinical Gray (~#a1a1aa) */
--text-muted:     oklch(45% 0.008 240)    /* Dark Spec Muted (~#52525b) */

--accent-primary: oklch(62% 0.20 255)     /* Diagnostics Cobalt Blue (~#2563eb) */
--accent-hover:   oklch(68% 0.22 255)     /* Lighter active blue (~#3b82f6) */
```

## Typography

Pairing geometric technical headers with neutral sans-serif body copy and monospace metrics:

* **Display/Headers**: Space Grotesk
  - Letter-spacing limit: Display H1 letters should not touch. Floor = `-0.03em`.
  - Line height: Tight but clear (`1.1` to `1.2`).
* **Body/Text**: Inter or Outfit
  - Line height: `1.5` to `1.6` for maximum legibility.
  - Max line width: `65ch` to `75ch` on article paragraphs.
* **Data/Prices/Specs**: Geist Mono or standard monospace
  - Crisp, tabular spacing for hardware specifications and currency pricing.

## Components & Elements

* **Borders**: Sharp 1px borders. Never pair soft drop shadows (M >= 16px) with borders. Prefer a crisp `1px` border or a tiny shadow (`4px` blur), not both.
* **Corners**: Maximum card border-radius is `12px` (inputs `8px`). Avoid "insanely rounded" (e.g. 24px+) corners to maintain an industrial/instrument feel.
* **Interactive States**: Use solid colors and simple, high-fidelity state transitions (e.g. background shifts, sharp border-color updates, clean slide transitions). No glowing gradients or text gradients.
* **Reduced Motion**: All hover, slide, and scroll transitions must respect `@media (prefers-reduced-motion: reduce)`.
