export const removeWixGuard = (htmlStr: string) => {
  return htmlStr.replace(
    /<span class="wixGuard">([^<]*)<\/span>/g,
    (_full, group1 = '') => {
      if (group1.trim() === '&#8203;') {
        return '';
      }
      return group1;
    },
  );
};
