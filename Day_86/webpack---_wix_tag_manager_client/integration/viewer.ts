import { SiteEmbededTag, Category, PageInfo } from '../types';
import { runCallback } from '../utils/callbackUtils';
import { applySiteEmbeds } from '../modules/siteEmbedder';
import {
  getSiteEmbedTags,
  calculateNewCategories,
  getConfig,
} from '../modules/stateCache';
import { getSiteTags } from '../API/siteApi';

export function onPageNavigation(pageInfo: PageInfo) {
  removeReloadableEmbeds();
  const tags: SiteEmbededTag[] = getSiteEmbedTags();
  const config = getConfig();
  applySiteEmbeds(tags, pageInfo, config.experiments);
}

export function onConsentPolicyChanged(event: any) {
  if (event && event.detail && event.detail.policy) {
    const categories: Category[] = calculateNewCategories(event.detail.policy);
    if (categories.length) {
      getSiteTags({
        baseUrl: window.wixEmbedsAPI.getExternalBaseUrl(),
        htmlsiteId: window.wixEmbedsAPI.getHtmlSiteId(),
        metasiteId: window.wixEmbedsAPI.getMetaSiteId(),
        wixSite: window.wixEmbedsAPI.isWixSite(),
        language: window.wixEmbedsAPI.getLanguage(),
        categories,
      });
    }
  }
}

function removeReloadableEmbeds() {
  const tagsToRemove = getSiteEmbedTags();
  tagsToRemove.forEach((siteEmbed: SiteEmbededTag) => {
    if (!siteEmbed.tag.loadOnce) {
      siteEmbed.embeddedNodes &&
        siteEmbed.embeddedNodes.forEach((node: any) => {
          runCallback(() => {
            node.parentNode.removeChild(node);
          });
        });
      // Clear any memory reference to prevent leaky leakies having fun in memory
      siteEmbed.embeddedNodes = null;
    }
  });
}
