"use client";

import { CreditCard } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0E0E10] px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#A80A08]/30 bg-[#141416]">
          <CreditCard size={40} className="text-[#A80A08]" aria-hidden />
        </div>
        <h1 className="font-bebas mb-3 text-[48px] leading-none tracking-[0.5px] text-white">
          SOMETHING WENT WRONG
        </h1>
        <p className="mb-6 font-figtree text-base leading-6 text-[#888888]">
          We encountered an error loading theatre information. This could be a
          temporary issue.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[#A80A08] px-6 py-3 font-figtree text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Try Again
        </button>
        {process.env.NODE_ENV === "development" && error.message && (
          <details className="mt-6 w-full rounded-lg border border-zinc-800 bg-[#141416] p-4 text-left">
            <summary className="cursor-pointer font-figtree text-xs font-semibold text-zinc-400">
              Error Details
            </summary>
            <pre className="mt-2 overflow-auto font-mono text-[10px] text-zinc-500">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
