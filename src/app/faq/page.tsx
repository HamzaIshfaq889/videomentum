import type { Metadata } from "next";
import { FAQHeroSection } from "@/components/faq/FAQHeroSection";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { FinalCTA } from "@/components/faq/FinalCTA";

export const metadata: Metadata = {
  title: "FAQ - VideoMentum",
  description:
    "Everything you need to know about Videomentum — the platform, the theatres, and how it all works.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ - VideoMentum",
    description:
      "Everything you need to know about Videomentum — the platform, the theatres, and how it all works.",
    url: "/faq",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - VideoMentum",
    description:
      "Everything you need to know about Videomentum — the platform, the theatres, and how it all works.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <FAQHeroSection />
      <FAQAccordion />
      <FinalCTA />
    </div>
  );
}
