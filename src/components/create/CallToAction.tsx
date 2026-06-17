"use client";

import Image from "next/image";
import { useState } from "react";
import { ContactFormModal } from "@/components/ContactFormModal";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/video.svg`,
    title: "Upload & Distribute",
    description:
      "Submit your film to one or multiple theaters. Full control over where and how your content lives.",
  },
  {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/earnCredits.svg`,
    title: "Earn Credits",
    description:
      "Get rewarded every time your content is watched. Credits convert to real value as your audience grows.",
  },
  {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/globalReach.svg`,
    title: "Global Reach",
    description:
      "Your content, seen across the Videomentum universe. Built-in discovery means more eyes on your work.",
  },
];

export const CallToAction = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  return (
    <section className="w-full border-t border-zinc-900 bg-black px-6 py-16">
      <div className="mx-auto w-full">
        {/* Three feature columns */}
        <div className="flex flex-col sm:flex-row">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex flex-1 flex-col items-start gap-6 px-6 py-12 sm:gap-0 sm:py-8 ${
                index < features.length - 1
                  ? "border-b-[0.5px] border-b-[#9999994D] sm:border-b-0 sm:border-r-[0.5px] sm:border-r-[#9999994D]"
                  : ""
              }`}
            >
              <div
                className="flex shrink-0 items-center justify-center sm:mb-5"
                aria-hidden
              >
                <Image
                  src={feature.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12"
                />
              </div>
              <h3 className="font-figtree text-lg font-bold leading-tight tracking-[0.35px] text-[#FFFFFF] sm:mb-3 sm:text-xl sm:leading-[64px]">
                {feature.title}
              </h3>
              <p className="font-figtree text-[18px] font-normal leading-6 tracking-[-0.31px] text-[#999999]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/migration")}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#A80B09] px-8 py-4 text-center font-figtree text-2xl font-bold leading-6 tracking-[-0.31px] text-white transition-opacity hover:opacity-90"
          >
            Start Creating
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? "/"}/assets/arrow-right.svg`}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
              aria-hidden
            />
          </button>
        </div>
      </div>
      <ContactFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
