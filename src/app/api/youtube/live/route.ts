import { NextResponse } from "next/server";

type LiveStream = {
  title: string;
  url: string;
  channelTitle: string;
  channelId: string;
  videoId: string;
  thumbnail: string;
};

type LiveResponse = {
  live: boolean;
  stream: LiveStream | null;
  latest: LiveStream[];
};

let cache: { data: LiveResponse; ts: number } | null = null;
const TTL_MS = 60_000;

function looksLikeChannelId(input: string) {
  return input.startsWith("UC") && input.length >= 10;
}

function extractHandleOrId(input: string) {
  try {
    const url = new URL(input);
    // /channel/UCxxxx
    const channelMatch = url.pathname.match(/\/channel\/(UC[\w-]+)/i);
    if (channelMatch) return { type: "channelId", value: channelMatch[1] };
    // /@handle
    const handleMatch = url.pathname.match(/\/@([\w.-]+)/i);
    if (handleMatch) return { type: "handle", value: handleMatch[1] };
  } catch {
    // not a URL, fallthrough
  }
  if (looksLikeChannelId(input)) return { type: "channelId", value: input };
  const trimmed = input.replace(/^@/, "");
  return { type: "handle", value: trimmed };
}

async function resolveChannelId(entry: string, apiKey: string): Promise<string | null> {
  const { type, value } = extractHandleOrId(entry);
  if (type === "channelId") return value;

  // Try channels.forHandle
  const handle = value.startsWith("@") ? value : `@${value}`;
  const byHandle = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(
      handle
    )}&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );
  if (byHandle.ok) {
    const json = await byHandle.json();
    const id = json.items?.[0]?.id;
    if (id) return id;
  }
  // Fallback: search channel by query
  const search = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&type=channel&maxResults=1&q=${encodeURIComponent(
      value
    )}&key=${apiKey}`,
    { next: { revalidate: 3600 } }
  );
  if (search.ok) {
    const json = await search.json();
    const id = json.items?.[0]?.id?.channelId;
    if (id) return id;
  }
  return null;
}

async function fetchLiveForChannel(channelId: string, apiKey: string) {
  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    eventType: "live",
    type: "video",
    maxResults: "1",
    key: apiKey,
  });
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const item = json.items?.[0];
  if (!item) return null;
  const videoId = item.id?.videoId;
  const snippet = item.snippet;
  if (!videoId || !snippet) return null;
  const thumbnail =
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    "";
  const stream: LiveStream = {
    title: snippet.title ?? "Live Stream",
    url: `https://www.youtube.com/watch?v=${videoId}`,
    channelTitle: snippet.channelTitle ?? "",
    channelId,
    videoId,
    thumbnail,
  };
  return stream;
}

async function fetchLatestForChannel(
  channelId: string,
  apiKey: string
): Promise<Array<LiveStream & { publishedAt: string }>> {
  type SearchItem = {
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
      publishedAt?: string;
    };
  };
  const params = new URLSearchParams({
    part: "snippet",
    channelId,
    type: "video",
    order: "date",
    maxResults: "5",
    key: apiKey,
  });
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  const items: SearchItem[] = Array.isArray(json.items) ? json.items : [];
  return items
    .map((item: SearchItem) => {
      const videoId = item?.id?.videoId;
      const s = item?.snippet;
      if (!videoId || !s) return null;
      const thumbnail =
        s.thumbnails?.high?.url ||
        s.thumbnails?.medium?.url ||
        s.thumbnails?.default?.url ||
        "";
      return {
        title: s.title ?? "Video",
        url: `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle: s.channelTitle ?? "",
        channelId,
        videoId,
        thumbnail,
        publishedAt: s.publishedAt ?? "1970-01-01T00:00:00Z",
      } as LiveStream & { publishedAt: string };
    })
    .filter(Boolean) as Array<LiveStream & { publishedAt: string }>;
}

export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelsEnv = process.env.YOUTUBE_CHANNEL_IDS || "";
    const channelEntries = channelsEnv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!apiKey || channelEntries.length === 0) {
      return NextResponse.json(
        { live: false, stream: null } as LiveResponse,
        { status: 200 }
      );
    }

    if (cache && Date.now() - cache.ts < TTL_MS) {
      return NextResponse.json(cache.data, { status: 200 });
    }

    const resolvedIds: string[] = [];
    for (const entry of channelEntries) {
      const id = await resolveChannelId(entry, apiKey);
      if (id) resolvedIds.push(id);
    }
    if (resolvedIds.length === 0) {
      return NextResponse.json(
        { live: false, stream: null } as LiveResponse,
        { status: 200 }
      );
    }

    const liveResults = await Promise.all(
      resolvedIds.map((id) => fetchLiveForChannel(id, apiKey))
    );
    const liveStream = liveResults.find((s) => !!s) ?? null;

    let latest: LiveStream[] = [];
    if (!liveStream) {
      const latestResults = await Promise.all(
        resolvedIds.map((id) => fetchLatestForChannel(id, apiKey))
      );
      const flat = latestResults.flat();
      flat.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      latest = flat.slice(0, 12).map((v) => ({
        title: v.title,
        url: v.url,
        channelTitle: v.channelTitle,
        channelId: v.channelId,
        videoId: v.videoId,
        thumbnail: v.thumbnail,
      }));
    }

    const data: LiveResponse = {
      live: !!liveStream,
      stream: liveStream,
      latest,
    };
    cache = { data, ts: Date.now() };
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { live: false, stream: null, latest: [] } as LiveResponse,
      { status: 200 }
    );
  }
}

