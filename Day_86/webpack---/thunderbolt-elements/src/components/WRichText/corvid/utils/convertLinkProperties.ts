import type { LinkProps } from '@wix/editor-elements-types/corvid';

const regexHref = /(?:<a.*?href=(["']))(.*?)(?:\1)/i;
const regexTarget = /<a(.*?((target=["']([^"]+)["']).*?)?)>/i;
const regexLink = /<a.*?>/gi;

const addTarget = (
  htmlPart: string,
  target: LinkProps['target'] = '_blank',
) => {
  const match = regexTarget.exec(htmlPart);
  if (match) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [fullMatch, replacedMatch, _, targetAttribute, targetName] = match;
    if (targetName === '_blank' || targetName === '_self') {
      return htmlPart;
    }
    let linkWithTarget;
    if (targetAttribute) {
      // if we have target=* attribute but with incorrect target name:
      // 1. replacing the target=* attribute with default target
      linkWithTarget = replacedMatch.replace(
        targetAttribute,
        `target="${target}"`,
      );
      // 2. replace the entire anchor with new target
      linkWithTarget = fullMatch.replace(replacedMatch, linkWithTarget);
    } else {
      // we do not have target=* attribute set, let's add it
      linkWithTarget = fullMatch.replace(
        replacedMatch,
        `${replacedMatch} target="${target}"`,
      );
    }
    return htmlPart.replace(fullMatch, linkWithTarget);
  }

  return htmlPart;
};

const convertLink = (
  htmlPart: string,
  getLinkProps: (href: string) => LinkProps,
  resolveHref: (properties: LinkProps) => string,
) => {
  const match = regexHref.exec(htmlPart);
  if (match) {
    const fullMatch = match[0];
    const groupMatch = match[2];
    const props = getLinkProps(groupMatch);
    const replacedMatch = fullMatch.replace(groupMatch, resolveHref(props));
    return addTarget(htmlPart.replace(fullMatch, replacedMatch), props.target);
  }

  return htmlPart;
};

export const convertLinkProperties = (
  html: string,
  getLinkProps: (href: string) => LinkProps,
  resolveHref: (properties: LinkProps) => string = props => props.href || '',
) => {
  const replaces = [];
  let match;

  do {
    match = regexLink.exec(html);
    if (match) {
      const [fullMatch] = match;
      const link = convertLink(fullMatch, getLinkProps, resolveHref);
      replaces.push([fullMatch, link]);
    }
  } while (match);

  return replaces.reduce(
    (a, [matcho, replace]) => a.replace(matcho, replace),
    html,
  );
};
