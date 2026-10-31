const parse = (url) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const youtubeId = (u) => {
  if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
  if (!u.hostname.includes("youtube.com")) return null;
  const parts = u.pathname.split("/").filter(Boolean);
  if (["shorts", "embed", "live"].includes(parts[0])) return parts[1] ?? null;
  return u.searchParams.get("v");
};

export const videoInfo = (url) => {
  const u = parse((url ?? "").trim());
  if (!u) return null;
  const yt = youtubeId(u);
  if (yt) return { kind: "youtube", embed: `https://www.youtube.com/embed/${yt}`, thumb: `https://img.youtube.com/vi/${yt}/hqdefault.jpg` };
  if (u.hostname.includes("vimeo.com")) {
    const id = u.pathname.split("/").filter(Boolean).pop() ?? "";
    if (/^\d+$/.test(id)) return { kind: "vimeo", embed: `https://player.vimeo.com/video/${id}`, thumb: null };
  }
  if (/\.(mp4|webm|mov)$/i.test(u.pathname)) return { kind: "file", embed: u.href, thumb: null };
  return { kind: "link", embed: null, thumb: null };
};
