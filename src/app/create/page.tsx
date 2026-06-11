import type { Metadata } from "next";
import { CallToAction } from "@/components/create/CallToAction";
import { FinalCTA } from "@/components/create/FinalCTA";
import { HeroSection } from "@/components/create/HeroSection";
import { Testimonials } from "@/components/create/Testimonials";
import { MigrationCTA } from "@/components/create/MigrationCTA";

export const metadata: Metadata = {
  title: "Create-VideoMentum",
  description:
    "Create and share your films with VideoMentum. Upload your content, reach audiences worldwide, and join the future of film distribution.",
  alternates: {
    canonical: "/create",
  },
  openGraph: {
    title: "Create-VideoMentum",
    description:
      "Create and share your films with VideoMentum. Upload your content, reach audiences worldwide, and join the future of film distribution.",
    url: "/create",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create-VideoMentum",
    description:
      "Create and share your films with VideoMentum. Upload your content, reach audiences worldwide, and join the future of film distribution.",
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

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <HeroSection />
      <CallToAction />
      <Testimonials />
      <MigrationCTA />
      {/* <FinalCTA /> */}
    </div>
  );
}
