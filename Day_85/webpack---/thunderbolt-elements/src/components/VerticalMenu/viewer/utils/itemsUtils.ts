export const shouldHighlightItem = (
  highlightedLinkId: string | null | undefined,
  itemId: string,
) => {
  if (!highlightedLinkId) {
    return false;
  }

  const items = [];

  let loop = true;
  while (loop) {
    items.push(highlightedLinkId);
    const lastHypen = highlightedLinkId.lastIndexOf('-');
    if (lastHypen === -1) {
      loop = false;
    } else {
      highlightedLinkId = highlightedLinkId.slice(0, lastHypen);
    }
  }
  items.push(highlightedLinkId);

  return items.includes(itemId);
};
