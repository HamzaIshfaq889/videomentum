import type { Metadata } from "next";
import { HeroSection } from "@/components/invest/HeroSection";
import { StatsStrip } from "@/components/invest/StatsStrip";
import { OpportunitySection } from "@/components/invest/OpportunitySection";
import { FinalCTA } from "@/components/invest/FinalCTA";

export const metadata: Metadata = {
  title: "Invest - VideoMentum",
  description: "Explore investment opportunities on VideoMentum.",
  alternates: {
    canonical: "/invest",
  },
  openGraph: {
    title: "Invest - VideoMentum",
    description: "Explore investment opportunities on VideoMentum.",
    url: "/invest",
    type: "website",
    images: [
      {
        url: "/assets/createBG.jpg",
        width: 1200,
        height: 630,
        alt: "Invest in VideoMentum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invest - VideoMentum",
    description: "Explore investment opportunities on VideoMentum.",
    images: ["/assets/createBG.jpg"],
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

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <HeroSection />
      <StatsStrip />
      <OpportunitySection />
      <FinalCTA />
    </div>
  );
}

