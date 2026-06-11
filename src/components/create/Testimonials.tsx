"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    quote:
      "I’ve had an incredible experience working with Videomentum, creating stunning posters, producing breathtaking teasers, and coordinating filmmakers across the West African region.It’s been a truly rewarding journey of creativity, collaboration, and impact, and I look forward to achieving even greater milestones together.",
    initials: "FO",
    name: "Favour Omoruyi",
    title: "Regional Manager . Lagos Nigeria",
  },
  {
    quote:
      "As a writer, working with Videomentum has been amazing. Their passion, creativity, and dedication bring every story to life and truly inspire.",
    initials: "RN",
    name: "Rispah Ngugi",
    title: "Published Author . Nairobi Kenya",
  },

  {
    quote:
      "So far working with Mr Brian has been fantastic especially from the humanistic angle and also the vision he brings to the table. I enjoy the fact that he makes everyone of my student to feel seen and heard and this is something that we all deeply appreciate about him.Its an honour to be part of this project and I am excited along with my student to push on the right direction to achieve everything possible and to take videomomentum to a greater height and visibility.",
    initials: "SA",
    name: "Sifu Alex",
    title: "Martial Arts Trainer . Lower Saxony, Germany",
  },
  {
    quote:
      "I’m truly grateful to Videomentum for providing me with a platform to showcase my film work and creative vision. It has been an amazing journey so far, and I’ve seen real growth in both my craft and audience throug this opportunity.Videomentum has not only given me visibility but also the confidence to keep creating and pushing my limits as a filmmaker. The support and exposure I’ve received mean a lot, and I’m excited to continue building, improving, and sharing even more projects on the platform.I’m proud to be part of a space that values creativity and empowers storytellers like me.",
    initials: "SE",
    name: "Sombrero Elijah",
    title: "Action Designer & Director . Lagos Nigeria",
  },
  {
    quote:
      "I had a great experience working with Videomentum. From the very beginning until the final result, their team demonstrated outstanding professionalism, clear communication, and a level of creativity that truly stands out.Videomentum doesn’t just focus on delivering results—they take the time to understand the client’s vision and needs in depth. Every detail is carefully handled, resulting in high-quality output that feels polished and impactful.Collaborating with them was both enjoyable and satisfying. I highly recommend Videomentum to anyone looking to elevate their creative projects or content.Wishing Videomentum continued growth, greater success, and a strong position as a leading force in the creative industry.",
    initials: "RT",
    name: "Rian Tandika",
    title: "Filmmaker . Jakarta Indonesia",
  },
  {
    quote:
      "Videomentum stands out for their dedication to quality and results. They understand action design on a deep level, communicate clearly, and maintain a strong respect for the entire production process. Their work consistently achieves high-impact visuals that elevate any project",
    initials: "MM",
    name: "Max Melnyk",
    title: "Director of Loser Hero action series . Amsterdam Holland",
  },
  {
    quote:
      "Working with Videomentum has been a fantastic experience for our stunt team. They provide clear creative direction, truly understand the nuances of action design, and respect the production process. They always push for high-impact results, making Videomentum an excellent partner for action creators worldwide.",
    initials: "PS",
    name: "Pom Saksuwan",
    title: "Action Director . Thailand",
  },
];

export const Testimonials = () => {
  return (
    <section className="w-full bg-[#111111] px-6 py-16">
      <div className="w-full px-6">
        <h2 className="mb-10 text-left font-bebas text-[44px] font-normal leading-[1] tracking-[-0.31px] text-white sm:text-[52px] md:text-[58px] lg:text-[64px]">
          LOVED BY CREATORS.
        </h2>

        <div className="relative md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <article className="flex h-full flex-col rounded-lg border border-[#99999999] border-t-2 border-t-[#A80B09] bg-[#111111] p-6">
                    {/* Quote icon */}
                    <span
                      className="mb-4 block font-bebas text-6xl leading-none text-[#A80B094D]"
                      aria-hidden
                    >
                      &ldquo;
                    </span>

                    {/* Testimonial text */}
                    <p className="mb-6 flex-grow font-figtree text-sm font-medium leading-6 tracking-[-0.31px] text-[#FFFFFF]">
                      {testimonial.quote}
                    </p>

                    {/* Author */}
                    <div className="mt-auto flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#A80B09_0%,#420404_100%)] font-figtree text-sm font-bold text-white"
                        aria-hidden
                      >
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="font-figtree text-base font-semibold leading-none tracking-[-0.31px] text-white">
                          {testimonial.name}
                        </p>
                        <p className="font-figtree text-xs font-medium leading-6 tracking-[-0.31px] text-[#999999]">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden -left-12 border-[#A80B09] bg-[#111111] text-white hover:bg-[#A80B09] hover:text-white md:flex" />
            <CarouselNext className="hidden -right-12 border-[#A80B09] bg-[#111111] text-white hover:bg-[#A80B09] hover:text-white md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
