import { useState, useEffect, useCallback } from "react";

export interface FeedItem {
  title: string;
  link: string;
  description: string;
  fullDescription: string;
  pubDate: string;
  thumbnail: string;
  categories: string[];
}

interface RssJsonResponse {
  status: string;
  items: Array<{
    title: string;
    link: string;
    description: string;
    content: string;
    pubDate: string;
    thumbnail: string;
    enclosure?: { link: string };
    categories: string[];
  }>;
}

const RSS_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://spinnerijoosterveld.nl/feed/";

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .replace(/\[\u2026\]/g, "")
    .replace(/\[\.{3}\]/g, "")
    .replace(/The post .+ first appeared on .+\.$/im, "")
    .trim();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function useRssFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(RSS_URL);
      const data: RssJsonResponse = await response.json();

      if (data.status !== "ok") {
        throw new Error("Feed kon niet geladen worden");
      }

      const feedItems: FeedItem[] = data.items.map((item) => {
        const full = stripHtml(item.content || item.description);
        const short = full.slice(0, 200) + (full.length > 200 ? "..." : "");
        return {
          title: item.title,
          link: item.link,
          description: short,
          fullDescription: full,
          pubDate: formatDate(item.pubDate),
          thumbnail: item.thumbnail || item.enclosure?.link || "",
          categories: item.categories || [],
        };
      });

      setItems(feedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return { items, loading, error, refresh: fetchFeed };
}
