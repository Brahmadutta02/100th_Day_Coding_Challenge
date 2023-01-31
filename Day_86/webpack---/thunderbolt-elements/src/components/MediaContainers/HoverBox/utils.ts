const HOVER_SUFFIX = ':hover';

export default {
  getDefaultId: (id?: string) => id?.replace(HOVER_SUFFIX, ''),
};
