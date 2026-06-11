import type { Metadata } from "next";
import { Suspense } from "react";
import { Channels } from "@/components/Channels";

export const metadata: Metadata = {
  title: "Get Started – VideoMentum",
  description: "Get started with VideoMentum.",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default function StartPage() {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-[#A80A08]" />
              <p className="font-figtree text-sm text-[#888888]">
                Loading theatres...
              </p>
            </div>
          </div>
        }
      >
        <Channels />
      </Suspense>
    </div>
  );
}
