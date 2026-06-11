import { fetchHotNow } from "@/lib/api";
import { TopViewed } from "@/components/TopViewed";

export async function TopViewedSection() {
  const items = await fetchHotNow();

  return <TopViewed initialItems={items} />;
}
