export async function getSocialStats() {
  const stats = {
    youtube: "15.1K",
    facebook: "1.2M",
    instagram: "512K",
    discord: "15.2K",
  };

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=a1esportsbd&key=${apiKey}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      if (data.items?.[0]?.statistics?.subscriberCount) {
        const count = Number(data.items[0].statistics.subscriberCount);
        stats.youtube = formatCount(count);
      }
    }
  } catch (e) {
    console.error("Failed to fetch YouTube stats", e);
  }

  return stats;
}

function formatCount(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}
