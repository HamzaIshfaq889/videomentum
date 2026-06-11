import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast } from "@/components/Toast";
// l
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// kk
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: "600",
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://videomentum.com",
  ),
  title: "Videomentum",
  description:
    "Discover and track the hottest films in theatres with Videomentum.",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/logo.svg`,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://videomentum.com",
    title: "Videomentum",
    description:
      "Discover and track the hottest films in theatres with Videomentum.",
    siteName: "Videomentum",
    images: [
      {
        url: "/assets/createBG.jpg",
        width: 1200,
        height: 630,
        alt: "Videomentum - Discover the hottest films",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Videomentum",
    description:
      "Discover and track the hottest films in theatres with Videomentum.",
    images: ["/assets/createBG.jpg"],
  },
};
//
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${bebas.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen bg-black">{children}</main>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
