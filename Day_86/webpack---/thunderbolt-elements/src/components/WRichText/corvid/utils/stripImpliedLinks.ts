const IMPLIED_LINKS_PATTERN =
  /(?:<object.*?>)?<a data-auto-recognition="true".*?>(.*?)<\/a>(?:<\/object>)?/g;

export const stripImpliedLinks = (text: string) =>
  text.replace(IMPLIED_LINKS_PATTERN, (_fullMatch, innerText) => innerText);
