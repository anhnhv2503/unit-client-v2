export const calculateTime = (date: string) => {
  const now = new Date();
  const postDate = new Date(date);
  const secondsAgo = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} `;
  } else if (secondsAgo < 2592000) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days} day${days > 1 ? "s" : ""} `;
  } else if (secondsAgo < 31536000) {
    const months = Math.floor(secondsAgo / 2592000);
    return `${months} month${months > 1 ? "s" : ""} `;
  } else {
    const years = Math.floor(secondsAgo / 31536000);
    return `${years} year${years > 1 ? "s" : ""} `;
  }
};
