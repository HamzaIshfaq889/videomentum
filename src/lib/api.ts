import { FALLBACK_RAW } from "@/lib/hotFallback";

const API_BASE =
  process.env.VIDEOMENTUM_API_BASE_URL ?? "https://videomentum.com/api";

const TOP_IN_THEATRES_URL = `${API_BASE}/json.aspx?qn=topintheatres&poster=1`;
const HOT_NOW_URL = `${API_BASE}/json.aspx?qn=hotnow&poster=1`;
const CHAT_URL = `${API_BASE}/json.aspx?qn=chat&poster=1`;
const TICKER_URL = `${API_BASE}/json.aspx?qn=ticker&vm=1`;
const CHANNELS_URL = `${API_BASE}/json.aspx?qn=channels&min=10`;

export type HotNowItem = {
  rank: number;
  title: string;
  subtitle: string;
  imageUrl?: string;
  durationLabel?: string;
  navigateUrl?: string;
  videoURLs?: string;
  imageURLs?: string;
  teaserURL?: string;
};

export type TopInTheatreItem = {
  title: string;
  subtitle: string;
  topFilmLabel: string;
  filmsCountLabel?: string;
  imageUrl?: string;
  navigateUrl?: string;
  teaserUrl?: string;
  videoUrl?: string;
  imageURLs?: string;
};

export type ChatItem = {
  title: string;
  username: string;
  message: string;
  imageUrl?: string;
  navigateUrl?: string;
  videoURL?: string;
  teaserURL?: string;
};

export type TickerItem = {
  text: string;
  color: string;
  imageUrl?: string;
  navigateUrl?: string;
};

export type TickerData = {
  ticker: TickerItem[];
};

export type ChannelItem = {
  id: number;
  channelId: number;
  name: string;
  domain: string;
  description: string;
  story: string;
  keywords: string;
  leftText: string;
  topText: string;
  guestPlayOrder: number;
  logoUrl: string;
  navLogoUrl: string;
  mobileLogoUrl: string;
  strongLogoUrl: string;
  channelIcon: string;
  contentPreviewImage: string;
  homePage: string;
  newPage: string;
  joinNowMessage: string;
  getCreditsUrl: string;
  ageLimit: number;
  ageLimitReason: string;
  twitter: string;
  youTube: string;
  instagram: string;
  facebook: string;
  pinterest: string;
  tikTok: string;
};

const FETCH_TIMEOUT_MS = 3_000;
const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 800;

type HotStore = {
  lastUpdated: number | null;
  items: TopInTheatreItem[] | null;
  source: "api" | "fallback" | null;
};

const hotStore: HotStore = {
  lastUpdated: null,
  items: null,
  source: null,
};
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { next?: { revalidate: number } },
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapTopInTheatresItems(
  items: Record<string, unknown>[],
): TopInTheatreItem[] {
  return items.map((item) => {
    const img =
      item.ImageURL || item.PrimaryThumb || item.ImageUrl || item.imageUrl;
    const imageUrls =
      typeof item.ImageURLs === "string" ? item.ImageURLs.split("|")[0] : null;
    const thumbUrls =
      typeof item.ThumbURLs === "string" ? item.ThumbURLs.split("|")[0] : null;
    const imageUrl = (String(img || imageUrls || thumbUrls || "").trim() ||
      undefined) as string | undefined;

    const movieName = String(item.Title ?? item.TopFilm ?? item.subtitle ?? "");
    const domain = String(item.Domain ?? item.TheatreName ?? item.title ?? "");

    const teaserURL = item?.TeaserURL as string;
    const videoURL = item?.VideoURLs as string;
    const imageURLs = item?.ImageURLs as string;

    return {
      title: movieName,
      subtitle: domain,
      topFilmLabel: "Theatre",
      filmsCountLabel:
        item.FilmsCount != null
          ? `${item.FilmsCount} films`
          : (item.filmsCountLabel as string | undefined),
      imageUrl,
      navigateUrl:
        typeof item.NavigateURL === "string" && item.NavigateURL.trim()
          ? item.NavigateURL.trim()
          : undefined,
      teaserURL: teaserURL,
      videoURL: videoURL,
      imageURLs: imageURLs,
    };
  });
}

function mapChatItems(items: Record<string, unknown>[]): ChatItem[] {
  return items.map((item) => {
    const traits = String(item.Traits ?? "").trim();
    const pipeIdx = traits.indexOf("|");
    const rawUsername = pipeIdx >= 0 ? traits.slice(0, pipeIdx).trim() : traits;
    const username =
      rawUsername && !rawUsername.startsWith("@")
        ? `@${rawUsername}`
        : rawUsername || "Anonymous";
    const message = pipeIdx >= 0 ? traits.slice(pipeIdx + 1).trim() : traits;

    const img =
      item.ImageURL || item.PrimaryThumb || item.ImageUrl || item.imageUrl;
    const imageUrls =
      typeof item.ImageURLs === "string" ? item.ImageURLs.split("|")[0] : null;
    const thumbUrls =
      typeof item.ThumbURLs === "string" ? item.ThumbURLs.split("|")[0] : null;
    const imageUrl = (String(img || imageUrls || thumbUrls || "").trim() ||
      undefined) as string | undefined;

    const navigateUrl =
      typeof item.NavigateURL === "string" && item.NavigateURL.trim()
        ? item.NavigateURL.trim()
        : undefined;

    const videoURL = item?.VideoURLs as string;
    const teaserURL = item?.TeaserURL as string;

    return {
      title: String(item.Title ?? item.VideoID ?? ""),
      username,
      message,
      imageUrl,
      navigateUrl,
      videoURL: videoURL,
      teaserURL: teaserURL,
    };
  });
}

function mapHotNowItems(items: Record<string, unknown>[]): HotNowItem[] {
  return items.map((item, index) => {
    const img =
      item.ImageURL || item.PrimaryThumb || item.ImageUrl || item.imageUrl;
    const imageUrls =
      typeof item.ImageURLs === "string" ? item.ImageURLs.split("|")[0] : null;
    const thumbUrls =
      typeof item.ThumbURLs === "string" ? item.ThumbURLs.split("|")[0] : null;
    const imageUrl = (String(img || imageUrls || thumbUrls || "").trim() ||
      undefined) as string | undefined;

    const videoURLs = item?.VideoURLs as string;
    const imageURLs = item?.ImageURLs as string;
    const teaserURL = item?.TeaserURL as string;

    return {
      rank: index + 1,
      title: String(item.Title ?? item.TopFilm ?? ""),
      subtitle: String(item.Domain ?? item.TheatreName ?? ""),
      imageUrl,
      navigateUrl:
        typeof item.NavigateURL === "string" && item.NavigateURL.trim()
          ? item.NavigateURL.trim()
          : undefined,
      videoURLs,
      imageURLs,
      teaserURL,
    };
  });
}

async function fetchHotNowFromApi(): Promise<HotNowItem[]> {
  const options: RequestInit & { next?: { revalidate: number } } = {
    next: { revalidate: 60 },
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://videomentum.com/",
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(HOT_NOW_URL, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonText = text.includes("<html")
        ? text.slice(0, text.indexOf("<html")).trim()
        : text.trim();
      const parsed = JSON.parse(jsonText) as unknown;
      let data = parsed;
      if (!Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        const raw = obj?.d ?? obj?.data;
        data = typeof raw === "string" ? JSON.parse(raw) : (raw ?? parsed);
      }
      const items = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : [];
      if (items.length === 0) return [];
      return mapHotNowItems(items);
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES - 1;
      if (isLastAttempt) return [];
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  return [];
}

export async function fetchHotNow(): Promise<HotNowItem[]> {
  return fetchHotNowFromApi();
}

async function fetchTopInTheatresFromApi(): Promise<TopInTheatreItem[]> {
  const options: RequestInit & { next?: { revalidate: number } } = {
    next: { revalidate: 60 },
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://videomentum.com/",
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(TOP_IN_THEATRES_URL, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonText = text.includes("<html")
        ? text.slice(0, text.indexOf("<html")).trim()
        : text.trim();
      const parsed = JSON.parse(jsonText) as unknown;
      let data = parsed;
      if (!Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        const raw = obj?.d ?? obj?.data;
        data = typeof raw === "string" ? JSON.parse(raw) : (raw ?? parsed);
      }
      const items = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : [];
      if (items.length === 0) return [];

      return mapTopInTheatresItems(items);
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES - 1;
      if (isLastAttempt) return [];
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  return [];
}

/**
 * Fetch top in theatres data with a simple in-memory store and robust fallback:
 * - If we have non-empty cached data newer than 1 hour, return it.
 * - Otherwise, fetch from the VideoMentum API and update the store if data is returned.
 * - If the API returns empty but the store has data, keep showing the stored data.
 * - If both API and store are empty, use the static FALLBACK_RAW dataset.
 */
export async function fetchTopInTheatres(): Promise<TopInTheatreItem[]> {
  const now = Date.now();
  const hasCached = Array.isArray(hotStore.items) && hotStore.items.length > 0;

  // Always attempt to fetch fresh data from the external API first.
  const apiItems = await fetchTopInTheatresFromApi();

  if (apiItems.length > 0) {
    hotStore.items = apiItems;
    hotStore.lastUpdated = now;
    hotStore.source = "api";
    return apiItems;
  }

  if (hasCached) {
    return hotStore.items as TopInTheatreItem[];
  }

  const fallbackItems = mapTopInTheatresItems(
    FALLBACK_RAW as Record<string, unknown>[],
  );
  hotStore.items = fallbackItems;
  hotStore.lastUpdated = now;
  hotStore.source = "fallback";
  return fallbackItems;
}

async function fetchChatFromApi(): Promise<ChatItem[]> {
  const options: RequestInit & { next?: { revalidate: number } } = {
    next: { revalidate: 60 },
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://videomentum.com/",
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(CHAT_URL, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonText = text.includes("<html")
        ? text.slice(0, text.indexOf("<html")).trim()
        : text.trim();
      const parsed = JSON.parse(jsonText) as unknown;
      let data = parsed;
      if (!Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        const raw = obj?.d ?? obj?.data;
        data = typeof raw === "string" ? JSON.parse(raw) : (raw ?? parsed);
      }
      const items = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : [];
      if (items.length === 0) return [];

      return mapChatItems(items);
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES - 1;
      if (isLastAttempt) return [];
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  return [];
}

export async function fetchChat(): Promise<ChatItem[]> {
  return fetchChatFromApi();
}

const DEFAULT_TICKER: TickerData = {
  ticker: [
    { text: "FEED up to 5%", color: "#10B981B2" },
    { text: "↑ Top: Hollywood Classics", color: "#10B981B2" },
    { text: "14 New Films", color: "#FCFCFCB2" },
    { text: "18 Countries", color: "#FCFCFCB2" },
    { text: "500k credits distributed", color: "#10B981B2" },
    { text: "Views up to 5%", color: "#FCFCFCB2" },
  ],
};

const TICKER_FETCH_TIMEOUT_MS = 5_000;
const TICKER_MAX_RETRIES = 1;

async function fetchTickerFromApi(): Promise<TickerData> {
  const options: RequestInit & { next?: { revalidate: number } } = {
    next: { revalidate: 60 },
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://videomentum.com/",
    },
  };

  for (let attempt = 0; attempt < TICKER_MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        TICKER_FETCH_TIMEOUT_MS,
      );
      const res = await fetch(TICKER_URL, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonText = text.includes("<html")
        ? text.slice(0, text.indexOf("<html")).trim()
        : text.trim();
      const parsed = JSON.parse(jsonText) as unknown;
      const obj = parsed as Record<string, unknown>;
      const ticker = obj?.ticker;
      if (Array.isArray(ticker) && ticker.length > 0) {
        return {
          ticker: ticker.map((item) => {
            const row = item as Record<string, unknown>;
            const imageUrl = String(
              row.ImageURL ??
                row.imageURL ??
                row.ImageUrl ??
                row.imageUrl ??
                "",
            ).trim();
            const navigateUrl = String(
              row.NavigateURL ??
                row.navigateURL ??
                row.HyperLink ??
                row.hyperlink ??
                row.url ??
                "",
            ).trim();

            return {
              text: String(row.text ?? "").trim(),
              color: String(row.color ?? "#FCFCFCB2"),
              imageUrl: imageUrl || undefined,
              navigateUrl: navigateUrl || undefined,
            };
          }),
        };
      }
      return DEFAULT_TICKER;
    } catch {
      if (attempt === TICKER_MAX_RETRIES - 1) return DEFAULT_TICKER;
    }
  }
  return DEFAULT_TICKER;
}

export async function fetchTicker(): Promise<TickerData> {
  return fetchTickerFromApi();
}

export async function fetchChannels(): Promise<ChannelItem[]> {
  const options: RequestInit & { next?: { revalidate: number } } = {
    next: { revalidate: 60 },
    cache: "no-store",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
      Referer: "https://videomentum.com/",
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(CHANNELS_URL, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const jsonText = text.includes("<html")
        ? text.slice(0, text.indexOf("<html")).trim()
        : text.trim();
      const parsed = JSON.parse(jsonText) as unknown;
      let data = parsed;
      if (!Array.isArray(parsed)) {
        const obj = parsed as Record<string, unknown>;
        const raw = obj?.d ?? obj?.data;
        data = typeof raw === "string" ? JSON.parse(raw) : (raw ?? parsed);
      }
      const items = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : [];
      if (items.length === 0) return [];
      return items.map((item) => ({
        id: Number(item.ID ?? 0),
        channelId: Number(item.ChannelID ?? item.ID ?? 0),
        name: String(item.Name ?? ""),
        domain: String(item.Domain ?? ""),
        description: String(item.Description ?? ""),
        story: String(item.Story ?? ""),
        keywords: String(item.Keywords ?? ""),
        leftText: String(item.LeftText ?? ""),
        topText: String(item.TopText ?? ""),
        guestPlayOrder: Number(item.GuestPlayOrder ?? 0),
        logoUrl: String(item.LogoURL ?? ""),
        navLogoUrl: String(item.NavLogoURL ?? ""),
        mobileLogoUrl: String(item.MobileLogoURL ?? ""),
        strongLogoUrl: String(item.StrongLogoURL ?? ""),
        channelIcon: String(item.ChannelIcon ?? ""),
        contentPreviewImage: String(item.ContentPreviewImage ?? ""),
        homePage: String(item.HomePage ?? ""),
        newPage: String(item.NewPage ?? ""),
        joinNowMessage: String(item.JoinNowMessage ?? ""),
        getCreditsUrl: String(item.GetCreditsURL ?? ""),
        ageLimit: Number(item.AgeLimit ?? 0),
        ageLimitReason: String(item.AgeLimitReason ?? ""),
        twitter: String(item.Twitter ?? ""),
        youTube: String(item.YouTube ?? ""),
        instagram: String(item.Instagram ?? ""),
        facebook: String(item.Facebook ?? ""),
        pinterest: String(item.Pinterest ?? ""),
        tikTok: String(item.TikTok ?? ""),
      }));
    } catch {
      const isLastAttempt = attempt === MAX_RETRIES - 1;
      if (isLastAttempt) return [];
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
    }
  }
  return [];
}
