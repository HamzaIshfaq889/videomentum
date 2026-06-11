import { Ticket, Globe, CreditCard } from "lucide-react";
import { fetchChannels } from "@/lib/api";
import { ChannelCard } from "@/components/ChannelCard";

export async function Channels() {
  const channels = await fetchChannels();

  console.log("[Channels]", channels);

  // Empty/error state
  if (channels?.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-zinc-800 bg-[#141416]">
          <CreditCard size={32} className="text-zinc-700" aria-hidden />
        </div>
        <h2 className="font-bebas mb-3 text-[40px] leading-none tracking-[0.5px] text-white">
          NO THEATRES AVAILABLE
        </h2>
        <p className="max-w-md font-figtree text-base leading-6 text-[#888888]">
          We couldn&apos;t load theatre information right now. Please try
          refreshing the page or check back later.
        </p>
      </div>
    );
  }

  const stats = [
    {
      icon: <CreditCard size={18} className="text-[#A80A08]" aria-hidden />,
      title: "Buy Once",
      body: "One purchase unlocks the entire network.",
    },
    {
      icon: <Globe size={18} className="text-[#A80A08]" aria-hidden />,
      title: `${channels.length} Featured Theatres`,
      body: "Every channel accepts the same credits.",
    },
    {
      icon: <Ticket size={18} className="text-[#A80A08]" aria-hidden />,
      title: "No Subscriptions",
      body: "Pay only for what you watch",
    },
  ];

  return (
    <section className="w-full px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      {/* ── Header ── */}
      <header className="mb-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-figtree text-xs font-semibold uppercase tracking-[3px] text-[#A80A08] sm:text-sm">
              All Access Pass
            </p>
            <h1 className="font-bebas text-[36px] leading-none tracking-[1px] text-white sm:text-[56px] lg:text-[64px]">
              One Credit.{" "}
              <span className="text-[#A80A08]">Every Theatre.</span>
            </h1>
          </div>
          <p className="max-w-sm font-figtree text-xs leading-5 text-[#666666] sm:text-sm sm:leading-6 sm:text-right">
            Credits work across all{" "}
            <span className="text-white"> videomentum theaters </span> no separate subscriptions, no hidden fees.
          </p>
        </div>
      </header>

      {/* ── Stats strip — full-bleed border row ── */}
      <div className="-mx-4 mb-10 mt-8 border-y border-zinc-800 sm:-mx-6 lg:-mx-8">
        <div className="grid grid-cols-3">
          {stats.map((stat, i) => (
            <div
              key={stat.title}
              className={`flex flex-col gap-1.5 px-3 py-5 sm:flex-row sm:items-start sm:gap-4 sm:px-8 sm:py-6 lg:px-12 ${
                i < stats.length - 1 ? "border-r border-zinc-800" : ""
              }`}
            >
              <div className="mt-0.5 shrink-0">{stat.icon}</div>
              <div>
                <p className="font-bebas text-lg leading-none tracking-[0.5px] text-white sm:text-2xl">
                  {stat.title}
                </p>
                <p className="mt-1 font-figtree text-[11px] leading-[1.4] text-[#666666] sm:text-xs sm:leading-4">
                  {stat.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Channel cards grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  );
}

