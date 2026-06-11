import { MediaCard } from "@/components/MediaCard";

type HotMoviesCardProps = {
  title: string;
  subtitle: string;
  topFilmLabel?: string;
  filmsCountLabel?: string;
  imageSrc: string;
  navigateUrl?: string;
  teaserURL?: string;
  videoURL?: string;
  imageURLs?: string;
};

export const HotMoviesCard = ({
  title,
  subtitle,
  filmsCountLabel,
  imageSrc,
  navigateUrl,
  teaserURL,
  videoURL,
  imageURLs,
}: HotMoviesCardProps) => {
  return (
    <MediaCard
      primaryText={title}
      secondaryText={subtitle}
      imageSrc={imageSrc}
      navigateUrl={navigateUrl}
      pillLabel="Hot now"
      filmsCountLabel={filmsCountLabel}
      teaserURL={teaserURL}
      videoURL={videoURL}
      imageURLs={imageURLs}
    />
  );
};
