# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
