import type { Metadata } from "next";
import { Mulish, Caveat } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// Handwritten cursive font used only for the small "beta" mark next to the
// fai.events logo. Loaded once from Google Fonts via next/font.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "fai.events | AI-Curated Once-in-a-Lifetime Experiences in Thailand",
    template: "%s | fai.events",
  },
  description: "Discover extraordinary, AI-curated experiences across Thailand. From hidden temples to private island escapes, find your next unforgettable adventure.",
  keywords: ["Thailand experiences", "luxury travel Thailand", "once in a lifetime experiences", "AI curated travel", "Bangkok experiences", "Phuket activities"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fai.events",
    siteName: "fai.events",
    title: "fai.events | AI-Curated Once-in-a-Lifetime Experiences in Thailand",
    description: "Discover extraordinary, AI-curated experiences across Thailand.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mulish.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
