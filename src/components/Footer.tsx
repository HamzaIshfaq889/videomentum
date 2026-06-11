import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-black px-4 py-10 text-[#FCFCFC] sm:px-6 lg:px-12">
      <div className="mx-auto flex w-full flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-24">
        {/* Brand + blurb */}
        <div className="max-w-xs space-y-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/logo.svg`}
              alt="VideoMentum logo"
              width={52}
              height={64}
              className="h-16 w-auto"
            />
          </Link>
          <p className="font-figtree text-[18px] leading-[22.75px] font-normal tracking-[-0.15px] text-[#FFFFFF]">
            Brings creators and audiences into one universe, building momentum
            through creativity, collaboration, and shared growth.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid flex-1 gap-8 text-[13px] font-figtree text-[#FCFCFCB2] sm:grid-cols-3">
          <div>
            <h3 className="mb-3 font-figtree text-[22px] leading-[28px] font-bold tracking-[-0.31px] text-[#FFFFFF]">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/watch"
                  className="font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] hover:text-white"
                >
                  Watch
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] hover:text-white"
                >
                  Create
                </Link>
              </li>
              <li>
                <Link
                  href="/invest"
                  className="font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] hover:text-white"
                >
                  Invest
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] hover:text-white"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-figtree text-[22px] leading-[28px] font-bold tracking-[-0.31px] text-[#FFFFFF]">
              Important
            </h3>
            <ul className="space-y-2">
              
              <li>
                <Link
                  href="https://videomentum.com/v2/About_Privacy.aspx"
                  className={"font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] hover:text-white"}
                    target="_blank"
				>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="https://videomentum.com/v2/About_Agreement.aspx"
                  className={"font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] hover:text-white"}
				    target="_blank"
                >
                   User Agreement
                </Link>
              </li>
             
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-figtree text-[22px] leading-[28px] font-bold tracking-[-0.31px] text-[#FFFFFF]">
              Contact
            </h3>
            <ul className="space-y-2">
              <li
                className={"font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF]"}
              >
                Operating Worldwide
              </li>
              <li
                className={"font-figtree text-[18px] leading-[20px] tracking-[-0.15px] text-[#FFFFFF] break-words"}
              >
                admin@videomentum.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-6xl flex-col items-start justify-between gap-4 text-[12px] font-figtree text-[#FCFCFCB2] md:flex-row md:items-center">
        <p className="font-figtree text-[18px] leading-[20px] font-normal tracking-[-0.15px] text-[#FFFFFF]">
          © 2026 Videomentum. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          {[
            // { label: "f", href: "#" },
            // { label: "X", href: "#" },
            { label: "in", href: "https://www.linkedin.com/company/videomentum/" },
            // { label: "ig", href: "#" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#A80B09] text-[13px] font-figtree font-semibold text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

