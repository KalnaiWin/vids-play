export const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${hours.toString().padStart(2, "0") !== "00" ? `${hours.toString().padStart(2, "0")}:` : ""}${
    minutes.toString().padStart(2, "0") !== "00"
      ? `${minutes.toString().padStart(2, "0")}:`
      : ""
  }${seconds.toString().padStart(2, "0")}`;
};
