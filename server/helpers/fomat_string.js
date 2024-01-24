export const truncateMarkdown = (markdown) => {
  const half = Math.round(markdown.length / 2);
  const maxHalf = Math.min(half, 1000);
  return markdown.slice(0, maxHalf) + "...";
};
