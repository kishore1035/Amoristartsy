import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import ServiceWorkerCleaner from "@/components/utils/ServiceWorkerCleaner";
import { AudioProvider } from "@/context/AudioContext";

export const metadata: Metadata = {
  title: "Guna // Amoristartsy — Handcrafted Mini-Canvas Studio & Store",
  description: "Explore and order Guna's handmade physical mini-canvas acrylic artworks. Pop culture, traditional motifs, typography & landscapes.",
  keywords: [
    "Mini Canvas",
    "Acrylic Painting",
    "Handmade Art",
    "Amoristartsy",
    "Guna Artist",
    "Pop Culture Art",
    "Stranger Things Art",
    "One Piece Art",
  ],
  authors: [{ name: "Guna (amoristartsy)" }],
  openGraph: {
    title: "Guna // Amoristartsy Studio & Store",
    description: "Handcrafted physical mini-canvas acrylic pieces for direct order.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-200 selection:text-amber-950">
        <ServiceWorkerCleaner />
        <AudioProvider>
          <CustomCursor />
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
