import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-100/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-150">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
