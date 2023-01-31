import {
  getLoadErrorTags,
  getLoadedTags,
  getLoadingTags,
  getConfig,
} from './modules/stateCache';
import { publishEvent, eventNames } from './modules/events';
import { onPageNavigation, onConsentPolicyChanged } from './integration/viewer';
import { getSiteTags } from './API/siteApi';

export const api = {
  getLoadedTags,
  getLoadingTags,
  getLoadErrorTags,
  getConfig,
};

let initTagManager = () => {
  const wixEmbedsAPI = (window as any).wixEmbedsAPI;
  getSiteTags({
    baseUrl: wixEmbedsAPI.getExternalBaseUrl(),
    htmlsiteId: wixEmbedsAPI.getHtmlSiteId(),
    metasiteId: wixEmbedsAPI.getMetaSiteId(),
    language: wixEmbedsAPI.getLanguage(),
    wixSite: wixEmbedsAPI.isWixSite(),
  });
  (window as any).wixEmbedsAPI.registerToEvent(
    'pageNavigation',
    onPageNavigation,
  );
  document.addEventListener('consentPolicyChanged', onConsentPolicyChanged);
  registerTagManagerAPI();
};

registerToWixEmbedsAPI();

function registerTagManagerAPI() {
  window.wixTagManager = api;
  publishEvent(eventNames.TAG_MANAGER_LOADED, window as any, api);
}

function registerToWixEmbedsAPI() {
  if (
    (window as any).wixEmbedsAPI &&
    typeof (window as any).wixEmbedsAPI.registerToEvent === 'function'
  ) {
    initTagManager();
  } else {
    (window as any).addEventListener(
      'wixEmbedsAPIReady',
      () => {
        initTagManager();
        // Noop-ified to prevent duplicate callbacks
        initTagManager = function () {};
      },
      false,
    );
  }
}
