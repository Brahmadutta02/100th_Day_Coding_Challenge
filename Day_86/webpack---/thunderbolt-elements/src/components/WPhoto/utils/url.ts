export const isExternalUrl = (url: string) =>
  /(^https?)|(^data)|(^blob)|(^\/\/)/.test(url);
