import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[50vh] w-full overflow-hidden sm:min-h-[70vh] md:min-h-[80vh]">
      {/* Background image */}
      <Image
        src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/createBG.jpg`}
        alt="Filmmaking - reels and clapperboard"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/75"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-[50vh] flex-col justify-center px-6 py-12 sm:min-h-[70vh] sm:max-w-2xl sm:px-12 sm:py-16 md:min-h-[80vh] md:px-16 lg:max-w-3xl lg:px-24">
        <p
          className="mb-4 font-figtree text-base font-semibold uppercase leading-none tracking-[2px] text-[#FCFCFCB2]"
        >
          FOR FILMMAKERS & STORYTELLERS
        </p>

        <h1
          className="font-bebas mb-4 text-[44px] font-normal leading-[1] tracking-[0.35px] text-[#FFFFFF] sm:text-[52px] md:text-[58px] lg:text-[64px] lg:leading-[64px]"
        >
          <span className="block">TELL YOUR STORY.</span>
          <span className="block">
            <span className="text-[#A80A08]">BUILD</span> YOUR AUDIENCE.
          </span>
        </h1>

        <p
          className="max-w-xl font-figtree text-xl font-normal italic leading-7 tracking-[-0.45px] text-[#AAAAAA]"
        >
          Videomentum gives creators a platform to distribute films, earn
          credits, and reach a global theatre network.
        </p>
      </div>
    </section>
  );
};
