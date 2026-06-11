"use client";

import Image from "next/image";
import { useState } from "react";
import { ContactFormModal } from "@/components/ContactFormModal";

export const FinalCTA = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <section className="w-full bg-black px-6 py-16">
      <div className="px-6 flex w-full flex-col items-center justify-between gap-8 sm:flex-row sm:gap-12">
        <div className="flex flex-1 flex-col items-start">
        <h2
          className="mb-4 font-bebas text-[44px] font-normal leading-[1] tracking-[-0.31px] uppercase text-white sm:text-[52px] md:text-[58px] lg:text-[64px] lg:leading-[64px]"
        >
          <span className="block">
            READY TO <span className="text-[#A80B09]">CREATE</span>?
          </span>
          <span className="block">YOUR AUDIENCE IS WAITING.</span>
        </h2>
        <p
          className="max-w-xl font-figtree text-base font-medium leading-6 tracking-[-0.31px] text-[#99999999]"
        >
          Join thousands of filmmakers already building their audiences on
          Videomentum.
        </p>
        </div>

        <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#A80B09] px-8 py-4 text-center font-figtree text-2xl font-bold leading-6 tracking-[-0.31px] text-white transition-opacity hover:opacity-90"
        >
          Start Creating
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/arrow-right.svg`}
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
