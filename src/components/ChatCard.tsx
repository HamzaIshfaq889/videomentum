import { MediaCard } from "@/components/MediaCard";

type ChatCardProps = {
  title: string;
  imageSrc: string;
  avatarInitials: string;
  username: string;
  handle: string;
  timeAgo: string;
  message: string;
  navigateUrl?: string;
  videoURL?: string;
  teaserURL?: string;
};

export const ChatCard = ({
  imageSrc,
  username,
  message,
  navigateUrl,
  videoURL,
  teaserURL,
}: ChatCardProps) => {
  return (
    <MediaCard
      primaryText={username}
      secondaryText={message}
      imageSrc={imageSrc}
      navigateUrl={navigateUrl}
      showPill={false}
      variant="chat"
      videoURL={videoURL}
      teaserURL={teaserURL}
    />
  );
};
