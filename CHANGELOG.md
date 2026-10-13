# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-10-13

### Added
- **Butter-Smooth Micro-Animations (Zero Jerky Layout Shifts)**:
  - Menggantikan kemunculan DOM yang kasar/mendadak dengan teknik **CSS Grid Accordion Transition** (`grid-rows-[0fr]` ke `grid-rows-[1fr]` berdurasi 300ms `ease-out`). Input di bawahnya kini bergeser turun dan naik secara halus alami tanpa sentakan (*layout shift*).
  - Menambahkan keyframes micro-animation berskala halus `animate-smooth-reveal` dan `animate-toast-enter` dengan kurva pegas organik (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Animasi halus diterapkan pada peringatan duplikat bahan, chip saran autofill, popover pencarian combobox, dan peringatan duplikat menu.
- **Sistem Notifikasi Toast Global (`ToastProvider`)**:
  - Dibuat sistem notifikasi toast mengambang terintegrasi di pojok layar dengan dukungan Dark/Light mode dan auto-dismiss.
  - Notifikasi aktif instan saat terdeteksi bahan/menu ganda di database (`toast.warning`), saat operasi simpan berhasil (`toast.success`), saat impor/ekspor data (`toast.info`), dan saat percobaan duplikasi dicegah (`toast.error`).
- **Lazy Loading & Performance Optimization**:
  - Menerapkan `next/dynamic` pada komponen-komponen berat dan modal dialog (`IngredientsModal`, `MenuModal`, `PromoSimulatorSandbox`, `FormulaGuideView`) sehingga bundle JavaScript awal jauh lebih kecil dan halaman pertama terbuka instan.
  - Menambahkan lazy rendering pada tabel Master Bahan (`displayLimit` batching) dengan tombol *"Tampilkan Lebih Banyak"* agar performa scrolling dan render di ponsel tetap ringan.

## [1.3.0] - 2026-10-13

### Added
- **Pencegahan Duplikasi Data (Duplicate Prevention & Validation)**:
  - **Master Bahan (`IngredientsModal`)**: Validasi real-time saat mengetik nama bahan (case-insensitive & trimmed). Jika nama sudah terdaftar, tombol simpan dinonaktifkan (`disabled`) dan muncul alert peringatan serta tombol jalan pintas untuk melihat bahan di tabel.
  - **Komposisi Resep (`RecipeCostingTable`)**: Validasi $O(1)$ Set lookup untuk mendeteksi bahan yang sudah dimasukkan ke dalam resep menu. Tombol `+ Tambah` dinonaktifkan dengan peringatan visual jika bahan sudah ada di resep.
  - **Master Menu (`MenuModal`)**: Validasi pencegahan nama menu ganda dengan peringatan instan dan pembatasan tombol simpan.
  - **Server API Safeguard (`/api/ingredients` & `/api/menus`)**: Validasi server-side dengan status HTTP 409 Conflict jika nama data sudah terdaftar.
- **Pencarian Autocomplete & Autofill Cerdas**:
  - **Searchable Combobox di Resep BOM**: Menggantikan dropdown statis dengan kotak pencarian bahan interaktif dan panel popover saran.
  - **Autofill Otomatis**: Saat memilih bahan dari hasil pencarian, sistem otomatis mengisi takaran porsi dan mengonversi satuan secara cerdas (misal: beli `KG` otomatis takaran porsi `GRAM` 100g; beli `LITER` otomatis `ML` 100ml; beli `PCS`/`BUTIR` otomatis `1 unit`).
  - **Saran Bahan Mirip di Master Data**: Menampilkan tombol chip bahan yang mirip saat mengetik di form master bahan untuk autofill harga dan satuan.
- **Keamanan Query & Perlindungan Kebocoran Data (Zero Leakage & Scalable)**:
  - Sanitasi penanganan error di seluruh API endpoint (`/api/ingredients` dan `/api/menus`), mencegah kebocoran stack trace atau kredensial database internal ke client.
  - Dukungan parameter query pencarian aman (`?q=...`) berbasis mode `insensitive` Prisma untuk skalabilitas volume data besar di masa depan.

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
