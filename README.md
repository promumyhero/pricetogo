# PriceToGo 🍽️

> **Sistem Kalkulasi HPP, Target Margin Dine-In, dan Reverse Pricing Ekosistem Ojek Online (GoFood, GrabFood, ShopeeFood)**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.10.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Version](https://img.shields.io/badge/Version-1.0.0-emerald)](#)
[![License](https://img.shields.io/badge/License-MIT-purple)](#)

---

## 📌 Latar Belakang & Masalah

Banyak pengusaha kuliner (F&B) di Indonesia mengalami fenomena **"Orderan Ramai di GoFood/GrabFood tapi Rekening Selalu Boncos / Rugi"**. Hal ini disebabkan oleh dua kesalahan mendasar:

1. **Undercosting HPP (Harga Pokok Penjualan)**: Hanya menghitung bahan utama tanpa memperhitungkan penyusutan (*yield factor*), buffer bumbu dasar/gas/minyak, dan perbedaan biaya kemasan (*packaging*) *dine-in* vs *delivery*.
2. **Jebakan "Markup Biasa" (+20%)**: Ketika platform memotong komisi 20% dan resto ikut promo diskon 25% (misal GoFood Maksimal atau Grab Mega Diskon), sistem persentase platform memotong dari **Harga Jual Aplikasi**, bukan dari modal dasar. Akibatnya, uang transferan bersih yang diterima resto jatuh jauh di bawah modal!

**PriceToGo** dirancang untuk menyelesaikan masalah tersebut dengan pendekatan matematis **Reverse Pricing Engine**.

---

## ✨ Fitur Utama

### 1. 📋 Bill of Materials (BOM) & Food Costing Presisi
- Konversi satuan otomatis antar metrik (`KG` ↔ `GRAM`, `LITER` ↔ `ML`, `PCS`, `BUTIR`).
- **Yield / Shrinkage Factor**: Mengkoreksi bobot bersih bahan setelah disiangi/dikupas (misal: 1 kg ayam utuh menjadi 850 gr fillet).
- **Buffer Overhead Gas & Bumbu Dasar**: Alokasi 5–10% untuk biaya minyak, gas LPG, garam, dan penyedap yang sulit ditakar satuan.
- **Pemisahan Kemasan**: Menetapkan biaya kemasan *dine-in* (piring/alas kertas) vs *takeaway* (box, bowl, thinwall, sendok, kantong plastik berbayar).

### 2. 🏪 Dine-In Target Margin Pricing
- Slider target margin kotor (*Gross Margin*) interaktif.
- Indikator kesehatan Food Cost industri F&B:
  - 🟢 **Sehat**: $\le 35\%$
  - 🟡 **Moderat**: $35\% - 42\%$
  - 🔴 **Tinggi / Berisiko**: $> 42\%$

### 3. 🛵 Online Delivery Reverse Pricing Engine (GoFood, GrabFood, ShopeeFood)
- Menggunakan formula **Target Net Realization**:
  $$\text{Harga Listing} = \frac{\text{Target Uang Bersih} + \text{Biaya Layanan}}{(1 - (\text{Komisi\%} + \text{Beban Promo Merchant\%}))}$$
- Pembulatan psikologis harga konsumen (kelipatan Rp 500 atau Rp 1.000 terdekat).
- Menghitung uang transferan bersih (*Net Payout*) dan laba bersih aktual secara *real-time*.

### 4. 🧪 Promo Simulator Sandbox
- Simulasi skema *cost-sharing* promo diskon merchant vs subsidi aplikasi (misal: GoFood Maksimal Pro, Grab Diskon Kilat).
- Perbandingan *side-by-side* langsung antara **Formula Reverse** vs **Jebakan Markup Biasa (+20%)**, memperlihatkan nominal tekor yang berhasil dicegah.

### 5. 📚 Formula & Industry Standard Guide
- Dokumentasi edukatif terintegrasi dalam dashboard mengenai benchmark industri resto, simulasi komisi aplikasi, dan pembuktian matematis formula *reverse pricing*.

### 6. 💾 Fleksibilitas Data & Sinkronisasi
- **Offline / Local-first**: Berjalan instan dengan `localStorage`.
- **Database Ready**: Dilengkapi schema **Prisma ORM 7** (PostgreSQL) dan REST API endpoints (`/api/menus`, `/api/ingredients`).
- **Backup & Restore**: Ekspor dan impor data komposisi resep dalam format JSON.

---

## 🛠️ Tech Stack & Arsitektur

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Styling**: Tailwind CSS v4, Lucide React Icons, Radix UI
- **Database & ORM**: PostgreSQL via Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`)
- **Language**: TypeScript 5 (Strict Mode)
- **Package Manager**: pnpm

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Kloning Repositori
```bash
git clone https://github.com/promumyhero/pricetogo.git
cd pricetogo
```

### 2. Pasang Dependensi
```bash
pnpm install
```

### 3. Konfigurasi Lingkungan (Environment Variables)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel `DATABASE_URL` dengan koneksi PostgreSQL Anda (opsional, jika ingin mengaktifkan database server-side):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pricetogo?schema=public"
```

### 4. Setup Database Prisma (Opsional)
```bash
pnpm exec prisma db push
```

### 5. Jalankan Server Pengembangan
```bash
pnpm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 6. Build untuk Produksi
```bash
pnpm run build
pnpm run start
```

---

## 📐 Git Mastery & Alur Kerja Standar (Git Workflow)

Proyek ini menerapkan standar rekayasa perangkat lunak modern untuk menjaga kebersihan repositori:

### 1. Branching Strategy (Git Flow Ringkas)
- **`main`**: Branch produksi utama. Hanya menerima kode yang sudah lolos uji linting dan kompilasi *production build*.
- **`develop`**: Branch integrasi fitur harian sebelum rilis versi berikutnya.
- **`feat/<nama-fitur>`**: Branch untuk pengembangan fitur spesifik (contoh: `feat/multi-outlet-pricing`).
- **`fix/<nama-bug>`**: Branch perbaikan bug (contoh: `fix/rounding-issue`).

### 2. Standar Pesan Commit (Conventional Commits)
Setiap commit mengikuti format:
```text
<tipe>(<scope opsional>): <deskripsi ringkas dalam kalimat imperatif>

[penjelasan rinci opsional]
```
Daftar tipe:
- `feat`: Penambahan fitur baru bagi pengguna.
- `fix`: Perbaikan bug atau galat kalkulasi.
- `docs`: Pembaruan dokumentasi atau panduan.
- `style`: Penyesuaian tata letak/styling tanpa mengubah fungsi.
- `refactor`: Restrukturisasi kode tanpa mengubah fungsionalitas.
- `chore`: Konfigurasi *build*, dependensi, linter, atau git hooks.

### 3. Semantic Versioning (SemVer)
Format versi mengikuti `v<MAJOR>.<MINOR>.<PATCH>`:
- **MAJOR** (`1.0.0`): Perubahan besar / breaking changes pada model bisnis atau arsitektur.
- **MINOR** (`1.1.0`): Penambahan fitur baru yang backwards-compatible.
- **PATCH** (`1.0.1`): Perbaikan bug kecil tanpa penambahan fitur baru.

Setiap rilis versi stabil ditandai dengan Git Tag:
```bash
git tag -a v1.0.0 -m "Release v1.0.0 - Production-ready Restaurant Profit Calculation System"
git push origin --tags
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi **MIT**. Lihat `LICENSE` untuk informasi lebih lanjut.
