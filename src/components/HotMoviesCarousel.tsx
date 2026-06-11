"use client";

import { HotMoviesCard } from "@/components/HotMoviesCard";

type Item = {
  title: string;
  subtitle: string;
  topFilmLabel?: string;
  filmsCountLabel?: string;
  imageUrl?: string;
  imageURLs?: string;
  navigateUrl?: string;
  teaserURL?: string;
  videoURL?: string;
};

type HotMoviesCarouselProps = {
  items: Item[];
};

export function HotMoviesCarousel({ items }: HotMoviesCarouselProps) {
  if (items.length === 0) return null;

  return (
    <div className="w-full overflow-hidden">
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((movie, index) => (
          <HotMoviesCard
            key={`${movie.title}-${movie.subtitle}-${index}`}
            title={movie.title}
            subtitle={movie.subtitle}
            topFilmLabel={movie.topFilmLabel ?? "Top film"}
            filmsCountLabel={movie.filmsCountLabel}
            imageSrc={
              movie.imageUrl ??
              `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/movie.jpg`
            }
            navigateUrl={movie.navigateUrl}
            teaserURL={movie?.teaserURL}
            videoURL={movie?.videoURL}
            imageURLs={movie?.imageURLs}
          />
        ))}
      </div>
    </div>
  );
}
