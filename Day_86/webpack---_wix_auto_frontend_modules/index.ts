import type { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols';

function namespacesSdkFactory() {
  return {
    'echo-backend': (context: WixCodeApiFactoryArgs) =>
      wixEchoBackendLoader(context),

    'online-programs-backend': (context: WixCodeApiFactoryArgs) =>
      wixOnlineProgramsBackendLoader(context),

    'ecom-backend': (context: WixCodeApiFactoryArgs) =>
      wixEcomBackendLoader(context),

    'blog-backend': (context: WixCodeApiFactoryArgs) =>
      wixBlogBackendLoader(context),

    'core-services-dev': (context: WixCodeApiFactoryArgs) =>
      wixCoreServicesDevLoader(context),

    'data-backend-public-sdk-poc': (context: WixCodeApiFactoryArgs) =>
      wixDataBackendPublicSdkPocLoader(context),

    'portfolio-backend': (context: WixCodeApiFactoryArgs) =>
      wixPortfolioBackendLoader(context),

    'bookings-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixBookingsBackendV2Loader(context),

    'metro-backend': (context: WixCodeApiFactoryArgs) =>
      wixMetroBackendLoader(context),

    'ratings-backend': (context: WixCodeApiFactoryArgs) =>
      wixRatingsBackendLoader(context),

    'forms-backend': (context: WixCodeApiFactoryArgs) =>
      wixFormsBackendLoader(context),

    'pro-gallery-backend': (context: WixCodeApiFactoryArgs) =>
      wixProGalleryBackendLoader(context),

    'loyalty-backend': (context: WixCodeApiFactoryArgs) =>
      wixLoyaltyBackendLoader(context),

    'table-reservations-backend': (context: WixCodeApiFactoryArgs) =>
      wixTableReservationsBackendLoader(context),

    'motion-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixMotionBackendV2Loader(context),

    'stores-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixStoresBackendV2Loader(context),

    'members-followers-backend.v3': (context: WixCodeApiFactoryArgs) =>
      wixMembersFollowersBackendV3Loader(context),

    'alert-enricher-backend': (context: WixCodeApiFactoryArgs) =>
      wixAlertEnricherBackendLoader(context),

    'reviews-backend': (context: WixCodeApiFactoryArgs) =>
      wixReviewsBackendLoader(context),

    'recruitment-agencies-positions-backend': (context: WixCodeApiFactoryArgs) =>
      wixRecruitmentAgenciesPositionsBackendLoader(context),

    'recruitment-agencies-applications-backend': (context: WixCodeApiFactoryArgs) =>
      wixRecruitmentAgenciesApplicationsBackendLoader(context),

    'recruitment-agencies-info-backend': (context: WixCodeApiFactoryArgs) =>
      wixRecruitmentAgenciesInfoBackendLoader(context),

    'stores-backend-poc.v2': (context: WixCodeApiFactoryArgs) =>
      wixStoresBackendPocV2Loader(context),

    'restaurants-backend': (context: WixCodeApiFactoryArgs) =>
      wixRestaurantsBackendLoader(context),

    'email-marketing-backend': (context: WixCodeApiFactoryArgs) =>
      wixEmailMarketingBackendLoader(context),

    'activity-counters-backend': (context: WixCodeApiFactoryArgs) =>
      wixActivityCountersBackendLoader(context),

    'sender-details-backend': (context: WixCodeApiFactoryArgs) =>
      wixSenderDetailsBackendLoader(context),

    'comments-backend': (context: WixCodeApiFactoryArgs) =>
      wixCommentsBackendLoader(context),

    'marketing-tags-backend': (context: WixCodeApiFactoryArgs) =>
      wixMarketingTagsBackendLoader(context),

    'app-market-backend': (context: WixCodeApiFactoryArgs) =>
      wixAppMarketBackendLoader(context),

    'contacts-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixContactsBackendV2Loader(context),

    'events-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixEventsBackendV2Loader(context),

    'inbox-conversations.backend.v1': (context: WixCodeApiFactoryArgs) =>
      wixInboxConversationsBackendV1Loader(context),

    'groups-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixGroupsBackendV2Loader(context),

    'identity-backend': (context: WixCodeApiFactoryArgs) =>
      wixIdentityBackendLoader(context),

    'entitlements-backend': (context: WixCodeApiFactoryArgs) =>
      wixEntitlementsBackendLoader(context),

    'forum-backend': (context: WixCodeApiFactoryArgs) =>
      wixForumBackendLoader(context),

    'events-backend.v1': (context: WixCodeApiFactoryArgs) =>
      wixEventsBackendV1Loader(context),

    'data-index-service-v2': (context: WixCodeApiFactoryArgs) =>
      wixDataIndexServiceV2Loader(context),

    'category-backend': (context: WixCodeApiFactoryArgs) =>
      wixCategoryBackendLoader(context),

    'events.v2': (context: WixCodeApiFactoryArgs) =>
      wixEventsV2Loader(context),

    'categories-backend': (context: WixCodeApiFactoryArgs) =>
      wixCategoriesBackendLoader(context),

    'badges-backend.v3': (context: WixCodeApiFactoryArgs) =>
      wixBadgesBackendV3Loader(context),

    'badges-backend.v1': (context: WixCodeApiFactoryArgs) =>
      wixBadgesBackendV1Loader(context),

    'badges-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixBadgesBackendV2Loader(context),

    'notifications-backend': (context: WixCodeApiFactoryArgs) =>
      wixNotificationsBackendLoader(context),

    'atlas-backend': (context: WixCodeApiFactoryArgs) =>
      wixAtlasBackendLoader(context),

    'groups-backend.v3': (context: WixCodeApiFactoryArgs) =>
      wixGroupsBackendV3Loader(context),

    'marketing-backend.v2': (context: WixCodeApiFactoryArgs) =>
      wixMarketingBackendV2Loader(context),

    'data-collection-service-v2': (context: WixCodeApiFactoryArgs) =>
      wixDataCollectionServiceV2Loader(context),

    'bookings.v2': (context: WixCodeApiFactoryArgs) =>
      wixBookingsV2Loader(context),

    'os-backend': (context: WixCodeApiFactoryArgs) =>
      wixOsBackendLoader(context),

    'inbox.v2': (context: WixCodeApiFactoryArgs) =>
      wixInboxV2Loader(context),

    'email-marketing.v2': (context: WixCodeApiFactoryArgs) =>
      wixEmailMarketingV2Loader(context),

    'forum.v2': (context: WixCodeApiFactoryArgs) =>
      wixForumV2Loader(context),

    'loyalty.v2': (context: WixCodeApiFactoryArgs) =>
      wixLoyaltyV2Loader(context),

    'activity-counters.v2': (context: WixCodeApiFactoryArgs) =>
      wixActivityCountersV2Loader(context),

    'business-tools.v2': (context: WixCodeApiFactoryArgs) =>
      wixBusinessToolsV2Loader(context),

    'stores.v2': (context: WixCodeApiFactoryArgs) =>
      wixStoresV2Loader(context),

    'marketing-tags.v2': (context: WixCodeApiFactoryArgs) =>
      wixMarketingTagsV2Loader(context),

    'redirects-api.v1': (context: WixCodeApiFactoryArgs) =>
      wixRedirectsApiV1Loader(context),

    'ads-txt.v1': (context: WixCodeApiFactoryArgs) =>
      wixAdsTxtV1Loader(context),

    'sender-details.v2': (context: WixCodeApiFactoryArgs) =>
      wixSenderDetailsV2Loader(context),

    'media.v2': (context: WixCodeApiFactoryArgs) =>
      wixMediaV2Loader(context),
  };
}

const wixMediaV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-media.v2" */
    '@wix/wix-media.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixSenderDetailsV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-sender-details.v2" */
    '@wix/wix-sender-details.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixAdsTxtV1Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-ads-txt.v1" */
    '@wix/wix-ads-txt.v1/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixRedirectsApiV1Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-redirects-api.v1" */
    '@wix/wix-redirects-api.v1/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixMarketingTagsV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-marketing-tags.v2" */
    '@wix/wix-marketing-tags.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixStoresV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-stores.v2" */
    '@wix/wix-stores.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBusinessToolsV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-business-tools.v2" */
    '@wix/wix-business-tools.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixActivityCountersV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-activity-counters.v2" */
    '@wix/wix-activity-counters.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixLoyaltyV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-loyalty.v2" */
    '@wix/wix-loyalty.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixForumV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-forum.v2" */
    '@wix/wix-forum.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEmailMarketingV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-email-marketing.v2" */
    '@wix/wix-email-marketing.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixInboxV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-inbox.v2" */
    '@wix/wix-inbox.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixOsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-os-backend" */
    '@wix/wix-os-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBookingsV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-bookings.v2" */
    '@wix/wix-bookings.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixDataCollectionServiceV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-data-collection-service-v2" */
    '@wix/wix-data-collection-service-v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixMarketingBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-marketing-backend.v2" */
    '@wix/wix-marketing-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixGroupsBackendV3Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-groups-backend.v3" */
    '@wix/wix-groups-backend.v3/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixAtlasBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-atlas-backend" */
    '@wix/wix-atlas-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixNotificationsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-notifications-backend" */
    '@wix/wix-notifications-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBadgesBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-badges-backend.v2" */
    '@wix/wix-badges-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBadgesBackendV1Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-badges-backend.v1" */
    '@wix/wix-badges-backend.v1/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBadgesBackendV3Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-badges-backend.v3" */
    '@wix/wix-badges-backend.v3/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixCategoriesBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-categories-backend" */
    '@wix/wix-categories-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEventsV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-events.v2" */
    '@wix/wix-events.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixCategoryBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-category-backend" */
    '@wix/wix-category-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixDataIndexServiceV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-data-index-service-v2" */
    '@wix/wix-data-index-service-v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEventsBackendV1Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-events-backend.v1" */
    '@wix/wix-events-backend.v1/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixForumBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-forum-backend" */
    '@wix/wix-forum-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEntitlementsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-entitlements-backend" */
    '@wix/wix-entitlements-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixIdentityBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-identity-backend" */
    '@wix/wix-identity-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixGroupsBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-groups-backend.v2" */
    '@wix/wix-groups-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixInboxConversationsBackendV1Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-inbox-conversations.backend.v1" */
    '@wix/wix-inbox-conversations.backend.v1/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEventsBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-events-backend.v2" */
    '@wix/wix-events-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixContactsBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-contacts-backend.v2" */
    '@wix/wix-contacts-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixAppMarketBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-app-market-backend" */
    '@wix/wix-app-market-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixMarketingTagsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-marketing-tags-backend" */
    '@wix/wix-marketing-tags-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixCommentsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-comments-backend" */
    '@wix/wix-comments-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixSenderDetailsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-sender-details-backend" */
    '@wix/wix-sender-details-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixActivityCountersBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-activity-counters-backend" */
    '@wix/wix-activity-counters-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));

const wixEmailMarketingBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-email-marketing-backend" */
    '@wix/wix-email-marketing-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixRestaurantsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-restaurants-backend" */
    '@wix/wix-restaurants-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixStoresBackendPocV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-stores-backend-poc.v2" */
    '@wix/wix-stores-backend-poc.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixRecruitmentAgenciesInfoBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-recruitment-agencies-info-backend" */
    '@wix/wix-recruitment-agencies-info-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixRecruitmentAgenciesApplicationsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-recruitment-agencies-applications-backend" */
    '@wix/wix-recruitment-agencies-applications-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixRecruitmentAgenciesPositionsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-recruitment-agencies-positions-backend" */
    '@wix/wix-recruitment-agencies-positions-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixReviewsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-reviews-backend" */
    '@wix/wix-reviews-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixAlertEnricherBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-alert-enricher-backend" */
    '@wix/wix-alert-enricher-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixMembersFollowersBackendV3Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-members-followers-backend.v3" */
    '@wix/wix-members-followers-backend.v3/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixStoresBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-stores-backend.v2" */
    '@wix/wix-stores-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixMotionBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-motion-backend.v2" */
    '@wix/wix-motion-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixTableReservationsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-table-reservations-backend" */
    '@wix/wix-table-reservations-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixLoyaltyBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-loyalty-backend" */
    '@wix/wix-loyalty-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixProGalleryBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-pro-gallery-backend" */
    '@wix/wix-pro-gallery-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixFormsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-forms-backend" */
    '@wix/wix-forms-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixRatingsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-ratings-backend" */
    '@wix/wix-ratings-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixMetroBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-metro-backend" */
    '@wix/wix-metro-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBookingsBackendV2Loader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-bookings-backend.v2" */
    '@wix/wix-bookings-backend.v2/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixPortfolioBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-portfolio-backend" */
    '@wix/wix-portfolio-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixDataBackendPublicSdkPocLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-data-backend-public-sdk-poc" */
    '@wix/wix-data-backend-public-sdk-poc/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixCoreServicesDevLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-core-services-dev" */
    '@wix/wix-core-services-dev/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixBlogBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-blog-backend" */
    '@wix/wix-blog-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEcomBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-ecom-backend" */
    '@wix/wix-ecom-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixOnlineProgramsBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-online-programs-backend" */
    '@wix/wix-online-programs-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


const wixEchoBackendLoader = (context: WixCodeApiFactoryArgs): Promise<any> =>
  import(
    /* webpackChunkName: "wix-echo-backend" */
    '@wix/wix-echo-backend/frontend'
  ).then(({ sdkFactory }) => sdkFactory(context));


export { namespacesSdkFactory };
