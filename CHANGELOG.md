# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-13

### Added
- **Mobile & Tablet Full Responsiveness**:
  - Responsive two-tier `Header` with sticky mobile navigation strip and compact touch targets.
  - Mobile sub-view controller (`Semua`, `Resep BOM`, `Hasil Harga`) on `< lg` viewports for focused workflows without endless scrolling.
  - Floating mobile quick price summary pill with real-time GoFood price preview and smooth jump button.
  - Paired 2-column mobile form layout for adding recipe components and master ingredients.
  - Touch-optimized horizontal scrolling with visual swipe indicator on recipe BOM and waterfall tables.
  - Native numeric keypad integration (`inputMode="decimal"`) on all currency, percentage, and recipe quantity fields.
  - Responsive dialog modals (`IngredientsModal`, `MenuModal`) with adaptive margins (`w-[calc(100%-1.5rem)]`) and padding.

### Fixed
- **ThemeProvider & ThemeToggle Stability**:
  - Re-aligned `ThemeProvider` to standard shadcn/ui and `next-themes` architecture, eliminating React 19 hydration mismatch warnings and duplicate scripts.
  - Resolved `resolvedTheme` synchronization in `ThemeToggle` to provide consistent active pill indicators.

## [1.1.0] - 2026-10-13

### Added
- **Light & Dark Theme Engine**:
  - Implemented custom client-side `ThemeProvider` with localStorage persistence and system fallback.
  - Added interactive `ThemeToggle` button in the header toolbar.
  - Added anti-flash inline script in `layout.tsx` to prevent theme flickering on page load.
- **Design System Harmonization**:
  - Refactored entire UI design to a clean, modern neutral/zinc color palette with seamless dark/light mode transitions.
  - Enhanced numeric tabular styling for precise recipe costing and financial waterfall comparisons.
  - Refined card borders, badge variants, and table padding for improved scannability and contrast.

### Fixed
- Fixed TypeScript interface naming typo in `ThemeProvider` (`ThemeContextType`).
- Resolved React 19 synchronous cascading render warnings in `ThemeProvider` and `ThemeToggle`.
- Fixed missing `...props` forwarding in `CardDescription` component.

## [1.0.0] - 2026-10-12

### Added
- **Recipe Costing & Bill of Materials (BOM)**:
  - Dynamic ingredient formulation with unit conversions (`KG`, `GRAM`, `LITER`, `ML`, `PCS`, `BUTIR`).
  - Waste & shrinkage calculation (`yield factor %`) to prevent undercosting.
  - Operational buffer overhead (5-10%) for seasonings, cooking gas, and cooking oil.
  - Packaging cost separation for offline dine-in vs. delivery takeaway.
- **Target Margin Dine-In Pricing**:
  - Interactive target gross profit margin slider with instant price derivation.
  - Industry benchmark Food Cost indicator (Healthy <= 35%, Moderate 35-42%, High > 42%).
- **Online Food Delivery Reverse Pricing Engine**:
  - Reverse pricing algorithm eliminating the "Naive Markup Trap" (+20% flaw) on GoFood, GrabFood, and ShopeeFood.
  - Support for multi-tiered commission rates, payment gateway / service fees, and merchant promo sharing.
  - Rounded pricing suggestions to consumer-friendly psychological denominations (e.g. nearest Rp 500 / Rp 1.000).
- **Promo Simulator Sandbox**:
  - Merchant vs. Platform discount sharing simulator (e.g. GoFood Maksimal Pro, Grab Mega Diskon).
  - Side-by-side comparison between Smart Reverse Pricing and Naive Markup showing exact loss avoided.
- **Master Data & Persistence**:
  - Master ingredient database with CRUD modal.
  - Dual persistence strategy: Instant browser LocalStorage and Prisma ORM 7 PostgreSQL REST APIs (`/api/menus`, `/api/ingredients`).
  - JSON backup export and import facility.
- **Documentation & Educational Resources**:
  - Interactive Formula & Industry Standard Guide.
  - Git branching strategy, semantic versioning, and commit conventions documentation.
