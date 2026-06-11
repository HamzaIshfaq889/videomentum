"use client";

import { useRef, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQCategory = {
  title: string;
  items: FAQItem[];
  videoUrl?: string;
  videoTitle?: string;
};

const faqData: FAQCategory[] = [
  {
    title: "GENERAL",
    videoUrl: "/assets/videos/general.mp4",
    videoTitle: "Welcome to Videomentum",
    items: [
      {
        question: "What is Videomentum?",
        answer:
          "Videomentum is a place to watch, create, and build stories in motion. It brings together filmmakers, audiences, and creative worlds under one roof, with each theatre offering its own energy, voice, and point of view.",
      },
      {
        question: "What is a theatre on Videomentum?",
        answer:
          "A theatre is a world inside Videomentum. Each one has its own identity, its own audience, and its own kind of storytelling. Instead of throwing everything into one endless feed, Videomentum gives different kinds of work a proper home.",
      },
      {
        question: "Is Videomentum global?",
        answer:
          "Yes. Videomentum is built for a global creative community. Different countries, different voices, different perspectives, all moving through one connected platform.",
      },
      {
        question: "How is Videomentum different from other platforms?",
        answer:
          "Most platforms are built for scrolling. Videomentum is built for discovery, participation, and connection. It gives creators a place to belong, gives audiences a reason to stay, and makes the experience feel like a living world rather than a pile of content.",
      },
    ],
  },
  {
    title: "WATCHING",
    items: [
      {
        question: "How do I start watching on Videomentum?",
        answer:
          "You can jump in through a theatre or start with what's hot right now. The homepage is designed to help you find your way quickly and follow what pulls you in.",
      },
      {
        question: "Do I need an account to watch?",
        answer:
          "Not always. Some parts of Videomentum may be open, while others work better with an account. Creating one gives you a more connected experience across the platform.",
      },
      {
        question: "Is everything on Videomentum free?",
        answer:
          "Not necessarily. Some content may be open, while some parts of the experience may involve credits or access depending on the theatre and the type of release.",
      },
      {
        question: "How do I know which theatre to choose?",
        answer:
          "Each theatre has its own feel. Some are intense, some are cinematic, some are more experimental. The homepage helps you get a quick sense of what's happening and where you might want to go next.",
      },
      {
        question: "What kind of content can I expect here?",
        answer:
          "Videomentum brings together different kinds of storytelling across its theatres. The experience is meant to feel like entering a connected universe, not just browsing random uploads.",
      },
    ],
  },
  {
    title: "CREATING",
    videoUrl: "/assets/videos/creators.mp4",
    videoTitle: "Videomentum for Creators",
    items: [
      {
        question: "Can I create on Videomentum?",
        answer:
          "Yes. Videomentum is made for creators as much as viewers. If you have work to share, a story to tell, or a vision you want to build, the Create section is where that begins.",
      },
      {
        question: "What kind of creators is Videomentum looking for?",
        answer:
          "Creators with something real to bring. Filmmakers, storytellers, performers, visual thinkers, and people who want their work to live in a space that actually gives it shape and context.",
      },
      {
        question: "How do I join as a creator?",
        answer:
          "The Create section is the starting point. From there, creators can learn how to get involved, share work, and connect with the wider Videomentum network.",
      },
      {
        question: "Can my work fit more than one theatre?",
        answer:
          "Yes, in some cases. A project may naturally belong in more than one space depending on its tone, audience, or creative direction.",
      },
      {
        question: "Do I keep ownership of my work?",
        answer:
          "Yes, unless a separate agreement is made for a specific collaboration or partnership. Videomentum is built to support creators, not strip them of what they make.",
      },
      {
        question: "How do creators earn on Videomentum?",
        answer:
          "Videomentum is building real paths for creators to earn through distribution, audience engagement, and the platform's credit-based ecosystem. The exact structure can vary depending on the work and how it performs.",
      },
    ],
  },
  {
    title: "INVESTING",
    videoUrl: "/assets/videos/investors.mp4",
    videoTitle: "Investing with Videomentum",
    items: [
      {
        question: "What is the Invest section for?",
        answer:
          "The Invest section is for people who want to support Videomentum at a bigger level, through funding, partnership, or strategic collaboration.",
      },
      {
        question: "Why invest in Videomentum?",
        answer:
          "Because Videomentum is building more than a streaming platform. It's building a creative ecosystem with its own theatres, its own audience pathways, and room to grow both culturally and commercially.",
      },
      {
        question: "What does investment help build?",
        answer:
          "It supports platform growth, theatre development, creator opportunities, audience expansion, and new projects across the Videomentum universe.",
      },
      {
        question: "Who can reach out about investing or partnering?",
        answer:
          "Anyone seriously interested in helping build what Videomentum is becoming can use the Invest section to start that conversation.",
      },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      {
        question: "What if I still have questions?",
        answer:
          "If the FAQ doesn't cover it, you'll be able to reach out through the contact or support section.",
      },
      {
        question: "How do I get help with my account, viewing, or submission?",
        answer:
          "Support options will be available on the site so both viewers and creators can get help with whatever they need.",
      },
    ],
  },
];

function ExpandIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#5E5E5E] text-[#FCFCFC] transition-transform ${open ? "rotate-45" : ""}`}
      aria-hidden
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <line x1="7" y1="2" x2="7" y2="12" />
        <line x1="2" y1="7" x2="12" y2="7" />
      </svg>
    </span>
  );
}

function VideoEmbed({ url, title }: { url: string; title?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleMinimize = () => {
    expandedVideoRef.current?.pause();
    setIsExpanded(false);
  };

  return (
    <div className="space-y-3">
      {title && (
        <h3 className="font-figtree text-base font-semibold text-white sm:text-xl">
          {title}
        </h3>
      )}

      {!isExpanded ? (
        /* ── Collapsed: small clickable thumbnail ── */
        <div
          role="button"
          tabIndex={0}
          onClick={handleExpand}
          onKeyDown={(e) => e.key === "Enter" && handleExpand()}
          className="group relative w-full max-w-52 cursor-pointer overflow-hidden rounded-xl border border-zinc-700 sm:max-w-xs"
          style={{ aspectRatio: "16/9" }}
          aria-label={`Play ${title ?? "video"}`}
        >
          {/* Silent first-frame preview */}
          <video
            src={url}
            preload="metadata"
            muted
            playsInline
            className="h-full w-full object-cover"
            tabIndex={-1}
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/55">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="ml-1">
                <path d="M8 5v14l11-7L8 5z" fill="#000" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        /* ── Expanded: full-width native player ── */
        <div className="space-y-2">
          <div
            className="w-full overflow-hidden rounded-xl bg-black"
            style={{ aspectRatio: "16/9" }}
          >
            <video
              ref={expandedVideoRef}
              src={url}
              className="h-full w-full"
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
          <button
            type="button"
            onClick={handleMinimize}
            className="font-figtree text-sm text-[#AAAAAA] transition-colors hover:text-white"
          >
            ✕ Minimize video
          </button>
        </div>
      )}
    </div>
  );
}

function FAQItemRow({
  question,
  answer,
  defaultOpen = false,
}: FAQItem & { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#5E5E5E66]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-figtree transition-colors hover:text-[#FFFFFF]"
        aria-expanded={open}
      >
        <span className="font-figtree text-xl font-semibold leading-[100%] tracking-0 text-[#FFFFFF]">
          {question}
        </span>
        <ExpandIcon open={open} />
      </button>
      {open && (
        <div className="pb-5 pl-0 font-figtree text-xl font-normal leading-[100%] tracking-0 text-[#AAAAAA]">
          {answer}
        </div>
      )}
    </div>
  );
}

export const FAQAccordion = () => {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-24">
      {faqData.map((category) => (
        <div key={category.title} className="mb-12">
          <h2 className="mb-6 font-figtree text-[14px] font-bold uppercase leading-[100%] tracking-[2px] text-[#FCFCFCB2]">
            {category.title}
          </h2>
          <div className="space-y-0">
            {category.items.map((item, index) => (
              <FAQItemRow
                key={item.question}
                question={item.question}
                answer={item.answer}
                defaultOpen={category.title === "GENERAL" && index === 0}
              />
            ))}
          </div>
          {category.videoUrl && (
            <div className="mt-8">
              <VideoEmbed url={category.videoUrl} title={category.videoTitle} />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};
