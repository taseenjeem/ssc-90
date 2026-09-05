import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "এসএসসি ব্যাচ ৯০ (শেরপুর জেলা) - স্মৃতির আঙিনা ও বন্ধুদের বন্ধন",
  description:
    "শেরপুর জেলার ১৯৯০ সালের এসএসসি ব্যাচের স্মৃতিচারণ, পুনর্মিলনী, সদস্য ডিরেক্টরি এবং মানবকল্যাণমূলক কার্যক্রমের সমন্বিত প্ল্যাটফর্ম।",
  keywords: ["এসএসসি ব্যাচ ৯০ শেরপুর", "শেরপুর এসএসসি ৯০", "SSC 1990 Sherpur", "শেরপুর জেলা অ্যালামনাই", "পুনর্মিলনী"],
  openGraph: {
    title: "এসএসসি ব্যাচ ৯০ (শেরপুর জেলা) - স্মৃতির আঙিনা",
    description: "শেরপুরের বন্ধুদের তিন দশকের বন্ধুত্ব, স্মৃতির আঙিনায় চিরন্তন",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={hindSiliguri.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
