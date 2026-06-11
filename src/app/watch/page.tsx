import { HotMovies } from "@/components/HotMovies";
import { TopViewedSection } from "@/components/TopViewedSection";
import { ChatSection } from "@/components/ChatSection";
import { FloatingStartButton } from "@/components/FloatingStartButton";


export const dynamic = "force-dynamic";

const Page = () => {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <HotMovies />
      <TopViewedSection />
      <ChatSection />

      <FloatingStartButton />
    </div>
  );
};

export default Page;
