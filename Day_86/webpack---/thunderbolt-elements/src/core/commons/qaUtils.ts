export const getQaDataAttributes = (
  isQaMode: boolean | undefined,
  fullNameCompType: string | undefined,
) =>
  isQaMode
    ? {
        'data-comp': fullNameCompType,
        'data-aid': fullNameCompType,
      }
    : {};
