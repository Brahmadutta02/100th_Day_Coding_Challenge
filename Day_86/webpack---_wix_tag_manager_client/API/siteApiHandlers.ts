import {
  SiteTagsResponse,
  SiteEmbededTag,
  PageInfo,
  SiteEmbedsHandlerOptions,
} from '../types';
import { tryParse } from '../utils/tryParse';
import {
  setConfig,
  addTagEmbeds,
  updateConsentCategories,
  getSiteEmbedTags,
} from '../modules/stateCache';
import { error } from '../utils/logger';
import { applySiteEmbeds } from '../modules/siteEmbedder';

export function siteEmbedsHandler(
  response: string,
  siteEmbedsHandlerOptions: SiteEmbedsHandlerOptions,
) {
  const embedsData: SiteTagsResponse = tryParse(response);
  const { currentPageID, initConsentPolicyManager = false } =
    siteEmbedsHandlerOptions;
  if (embedsData.errors && embedsData.errors.length > 0) {
    error(JSON.stringify(embedsData.errors));
  }
  if (embedsData.config) {
    updateConsentCategories(embedsData.config.consentPolicy);
    if (initConsentPolicyManager && window.consentPolicyManager) {
      window.consentPolicyManager.init({
        consentPolicy: embedsData.config.consentPolicy,
      });
    }
    setConfig(embedsData.config);
  }
  if (embedsData.tags) {
    addTagEmbeds(embedsData.tags);
    const pageInfo: PageInfo = {
      id: currentPageID,
    };
    const tags: SiteEmbededTag[] = getSiteEmbedTags();
    applySiteEmbeds(tags, pageInfo, embedsData.config.experiments);
  }
}
