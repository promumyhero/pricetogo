import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PriceToGo - Kalkulator HPP & Reverse Pricing GoFood GrabFood",
  description:
    "Aplikasi F&B Food Costing & Reverse Pricing untuk restoran dan warung makan. Hitung HPP bahan baku, penyusutan yield, biaya packaging, target margin, serta harga tayang aman di GoFood dan GrabFood dengan proteksi promo.",
  keywords: [
    "Kalkulator HPP",
    "Food Costing",
    "GoFood Pricing",
    "GrabFood Pricing",
    "Maksimal Pro Gojek",
    "HPP Makanan",
    "Manajemen Restoran",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
