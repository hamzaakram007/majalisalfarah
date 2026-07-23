import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { defaultDescriptions, siteConfig } from "@/lib/seo/site";
import { getSiteUrl } from "@/lib/seo/site";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.nameAr}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescriptions.en,
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/brand/logo-mark.svg",
    apple: "/brand/logo-mark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-[#f4eee4] text-stone-950 antialiased">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}
