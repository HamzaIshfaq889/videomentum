import { HotMoviesClient } from "@/components/HotMoviesClient";
import { fetchTopInTheatres } from "@/lib/api";
import { PreviewToggle } from "@/components/PreviewToggle";

export async function HotMovies() {
  const items = await fetchTopInTheatres();

  return (
    <section className="w-full px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <header className="mb-8 sm:mb-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bebas text-[64px] leading-[64px] tracking-[1px] text-[#FFFFFF]">
            Hot in theatres
          </h2>
          <PreviewToggle />
        </div>
      </header>

      <HotMoviesClient initialItems={items} />
    </section>
  );
}
