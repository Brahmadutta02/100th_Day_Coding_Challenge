import { VectorImageProps } from '@wix/thunderbolt-components';

export const COMP_ID_PLACEHOLDER = '<%= compId %>';
const COMP_ID_PLACEHOLDER_REGEX = new RegExp(COMP_ID_PLACEHOLDER, 'g');

export const replaceCompIdPlaceholder = (str: string, compId: string) =>
  str.replace(COMP_ID_PLACEHOLDER_REGEX, compId);

export const replaceCompIdPlaceholderInSvgContent = (
  vectorImageProps: VectorImageProps,
  id: string,
) => {
  if (vectorImageProps && vectorImageProps.svgContent) {
    vectorImageProps.svgContent = replaceCompIdPlaceholder(
      vectorImageProps.svgContent,
      id,
    );
  }
};

export const getFilterEffectSvgString = (
  id: string,
  originalFilterEffectSvgString?: string,
) => {
  return (
    originalFilterEffectSvgString &&
    replaceCompIdPlaceholder(originalFilterEffectSvgString, id)
  );
};

export const getFilterEffectStyle = (
  id: string,
  filterEffectSvgUrl?: string,
) => {
  return filterEffectSvgUrl
    ? {
        '--filter-effect-svg-url': replaceCompIdPlaceholder(
          filterEffectSvgUrl,
          id,
        ),
      }
    : {};
};
function generateUniqueId() {
  return (
    ((Math.random() * 1e10) | 0).toString(36) +
    ((Math.random() * 1e10) | 0).toString(36)
  );
}

const SVG_ID_PREFIX = 'svgcid-';

export const replaceContentIds = (svg: string): string => {
  const idMap = {} as Record<string, string>;
  // need to account for compId placeholder `<%= compId %>`
  const result = svg.replace(/\sid="([^"<]+)"/g, (match, id: string) => {
    const unique = `${SVG_ID_PREFIX}${generateUniqueId()}`;
    idMap[id] = unique;
    return ` id="${unique}"`;
  });

  return Object.keys(idMap).reduce(
    (current, key) => current.replace(new RegExp(key, 'g'), idMap[key]),
    result,
  );
};
