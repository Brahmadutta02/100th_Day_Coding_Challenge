import { PageInfo, SiteEmbededTag, SiteTag } from '../types';

/** render embed on all pages in case there in no page id*/
const isEmptyPageID = (p: PageInfo) => !p.id;

/** render embed tag on all page in case there is no pages */
const shouldRenderOnAllPages = (t: SiteEmbededTag) => !t.tag?.pages?.length;

/** render embed in cases page id includes in embed's pages*/
const shouldRenderOnPage = (t: SiteEmbededTag, p: PageInfo) =>
  t.tag?.pages?.includes(p.id || '') || false;

/**
 * @return true if the tag should render on a given page, false otherwise
 * @param tag - the actual tag to check if should be filtered
 * @param pageInfo - page's information
 */
export function isTagValidForPage(
  tag: SiteEmbededTag,
  pageInfo: PageInfo,
): boolean {
  return (
    isEmptyPageID(pageInfo) ||
    shouldRenderOnAllPages(tag) ||
    shouldRenderOnPage(tag, pageInfo)
  );
}

export function filterTagsByPageID(
  tags: SiteEmbededTag[],
  pageInfo: PageInfo,
): SiteEmbededTag[] {
  return tags.filter((tag) => isTagValidForPage(tag, pageInfo));
}

export function getSiteTagsFromSiteEmbed(
  siteEmbeds: SiteEmbededTag[],
): SiteTag[] {
  return siteEmbeds.map((s) => s.tag);
}
