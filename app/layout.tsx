import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const bodyFont = DM_Sans({ variable: "--font-body", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  alternates: { canonical: "/" },
  title: "Al Haramain Luxury Fleet | Chauffeur & Luxury Car Hire UAE",
  description: "Private chauffeur services and luxury car hire across Dubai, Abu Dhabi and the UAE. Explore our considered fleet and arrange your next journey.",
  keywords: ["luxury car rental Dubai", "chauffeur UAE", "private driver Dubai", "VIP car hire Abu Dhabi", "Al Haramain Luxury Fleet"],
  openGraph: {
    title: "Al Haramain Luxury Fleet | Arrive in Style",
    description: "A more considered way to travel through the UAE.",
    locale: "en_AE",
    type: "website",
  },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
