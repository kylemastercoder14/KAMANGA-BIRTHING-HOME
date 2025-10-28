// Utility to extract YouTube video ID
export function extractYouTubeID(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Utility to fetch YouTube video duration using the Data API
export async function fetchYouTubeDuration(videoId: string): Promise<number | null> {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; // store your API key in .env
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("Failed to fetch YouTube data");

    const data = await res.json();
    const isoDuration = data.items?.[0]?.contentDetails?.duration;
    if (!isoDuration) return null;

    // Convert ISO 8601 duration to minutes
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || "0", 10);
    const minutes = parseInt(match?.[2] || "0", 10);
    const seconds = parseInt(match?.[3] || "0", 10);

    return Math.ceil(hours * 60 + minutes + seconds / 60);
  } catch (err) {
    console.error("Error fetching YouTube duration:", err);
    return null;
  }
}
