export const formatDuration = (totalSeconds: number) => {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const d = days > 0 ? `${days}:` : "";
  const h =
    hours > 0 || days > 0 ? `${hours.toString().padStart(2, "0")}:` : "";

  return `${d}${h}${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
export const transferDateToNumberDuration = (date: Date) => {
  const day = Number(date.getDate() * (3600 * 24));
  const hour = Number(date.getHours()) * 3600;
  const minute = Number(date.getMinutes()) * 60;
  const second = Number(date.getSeconds());

  return day + hour + minute + second;
};

export const formatViewCount = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export const timeAgo = (date: string | Date) => {
  const now = new Date();
  const created = new Date(date);
  const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  return `${years} years ago`;
};

export const generateSlug = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, "-");

export const getColorFromFirstLetter = (name: string) => {
  if (!name) return "#999999";

  const letter = name.trim().charAt(0).toLowerCase();

  if (["a", "e", "d"].includes(letter)) return "#22c55e";
  if (["b", "f", "g"].includes(letter)) return "#ef4444";
  if (["c", "h", "i"].includes(letter)) return "#3b82f6";
  if (["j", "k", "l"].includes(letter)) return "#f59e0b";
  if (["m", "n", "o"].includes(letter)) return "#8b5cf6";
  if (["p", "q", "r"].includes(letter)) return "#ec4899";
  if (["s", "t", "u"].includes(letter)) return "#14b8a6";
  if (["v", "w", "x", "y", "z"].includes(letter)) return "#64748b";

  return "#999999";
};

export const formatColorStatusStream = (text: string) => {
  switch (text) {
    case "LIVE":
      return "text-green-300 bg-green-700";
    case "STOP":
      return "text-red-300 bg-red-700";
    case "WAITING":
      return "text-blue-300 bg-blue-700";
    default:
      break;
  }
};
