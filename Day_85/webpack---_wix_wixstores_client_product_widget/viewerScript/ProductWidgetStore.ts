/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {getTranslations, isWorker} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/utils';
import {MULTILINGUAL_TO_TRANSLATIONS_MAP, SPECS, translationPath} from '../constants';
import {IControllerConfig, IWidgetControllerConfig} from '@wix/native-components-infra/dist/src/types/types';
import {ProductApi} from '../services/ProductApi';
import {MultilingualService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/MultilingualService/MultilingualService';
import {ProductService} from '../services/ProductService';
import {getProductWidgetSettings} from '../commons/styleParamsService';
import {WidgetActionEnum, WidgetPresetIdEnum} from '../commons/enums';
import {
  IProductWidgetDTO,
  IProductWidgetStyleParams,
  IPropsInjectedByViewerScript,
  TranslationDictionary,
  IHtmlTags,
} from '../types/app-types';
import {PageMap, APP_DEFINITION_ID, StoresWidgetID} from '@wix/wixstores-client-core/dist/es/src/constants';
import {FetchError} from '@wix/wixstores-client-core/dist/es/src/http/FetchError';
import {AddToCartService} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/AddToCartService';
import {AddToCartState} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/AddToCartService/constants';
import {
  actualPrice,
  hasDiscount,
  hasSubscriptionPlans,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {CustomUrlApi} from '@wix/wixstores-client-storefront-sdk/dist/es/src/utils/CustomUrl/CustomUrlApi';
import {HeadingTags} from '@wix/wixstores-client-core/dist/es/src/types/heading-tags';
import {ProductPriceRange} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceRange/ProductPriceRange';
import {ProductPriceBreakdown} from '@wix/wixstores-client-storefront-sdk/dist/es/src/services/ProductPriceBreakdown/ProductPriceBreakdown';
import {productWidgetLoadedSf, clickShippingInfoLinkSf} from '@wix/bi-logger-ec-sf/v2';

export class ProductWidgetStore {
  private readonly fedopsLogger;
  private isStartReported: boolean = false;
  private isExternalRequestsValid: boolean = true;
  private readonly productApi: ProductApi;
  private translations: TranslationDictionary;
  private multilingualService: MultilingualService;
  private readonly productService: ProductService;
  private product: IProductWidgetDTO;
  private readonly addToCartService: AddToCartService;
  private readonly customUrlApi: CustomUrlApi;
  private isUrlWithOverrides: boolean = false;
  private productPriceBreakdown: ProductPriceBreakdown;

  constructor(
    public styleParams: IProductWidgetStyleParams,
    public publicData: IControllerConfig['publicData'],
    private readonly setProps: Function,
    private readonly siteStore: SiteStore,
    private readonly externalId: string,
    private readonly compId: IWidgetControllerConfig['compId'],
    private readonly reportError: (e) => any
  ) {
    const fedopsLoggerFactory = this.siteStore.platformServices.fedOpsLoggerFactory;
    this.fedopsLogger = fedopsLoggerFactory.getLoggerForWidget({
      appId: APP_DEFINITION_ID,
      widgetId: StoresWidgetID.PRODUCT_WIDGET,
    });

    if (isWorker()) {
      this.fedopsLogger.appLoadStarted();
      this.isStartReported = true;
    }

    if (this.publicData.COMPONENT === null || this.publicData.COMPONENT === undefined) {
      this.publicData.COMPONENT = {};
    }

    this.productApi = new ProductApi(this.siteStore);
    this.productService = new ProductService(siteStore, compId, externalId, this.fedopsLogger);
    this.addToCartService = new AddToCartService(siteStore, publicData);
    this.customUrlApi = new CustomUrlApi(this.siteStore.location.buildCustomizedUrl);
    this.handleCurrencyChange();
  }

  private handleCurrencyChange() {
    let currency = this.siteStore.location.query.currency;

    this.siteStore.location.onChange(() => {
      if (currency !== this.siteStore.location.query.currency) {
        currency = this.siteStore.location.query.currency;
        this.setInitialState().catch(this.reportError);
      }
    });
  }

  public onAppLoaded = () => {
    /* istanbul ignore next: hard to test it */
    if (!isWorker() || (this.siteStore.isInteractive() && this.isStartReported)) {
      this.fedopsLogger.appLoaded();
      this.reportBIOnAppLoaded();
    }
    this.isStartReported = false;
  };

  private isActionNavigate() {
    return (
      this.styleParams.fonts.widgetAction.value === WidgetActionEnum.NAVIGATE ||
      this.addToCartService.getButtonState({price: actualPrice(this.product), inStock: true}) ===
        AddToCartState.DISABLED
    );
  }

  private get shouldRenderPriceRange(): boolean {
    return new ProductPriceRange(this.siteStore).shouldShowPriceRange();
  }

  private readonly showButtonSetting = (settings): 'hover' | 'always' | 'never' => {
    if (!this.siteStore.isMobile() && settings.hoverButtonToggle) {
      return 'hover';
    }
    return settings.widgetButtonToggle ? 'always' : 'never';
  };

  private reportBIOnAppLoaded() {
    const settings = getProductWidgetSettings(this.styleParams);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.webBiLogger.report(
      productWidgetLoadedSf(
        this.product
          ? {
              isMobileFriendly: this.siteStore.isMobileFriendly,
              productId: this.product.id,
              hasPlans: hasSubscriptionPlans(this.product),
              navigationClick: this.isActionNavigate() ? 'navigate' : 'add-to-cart',
              hasOptions: this.product.hasOptions,
              buttonType: this.showButtonSetting(settings),
              type: this.styleParams.fonts.layout.value,
              productType: this.product.digitalProductFileItems.length ? 'digital' : 'physical',
              priceBreakdown: this.productPriceBreakdown.priceBreakdownBIParam,
            }
          : {productId: ''}
      )
    );
  }

  private getTexts() {
    return Object.keys(MULTILINGUAL_TO_TRANSLATIONS_MAP).reduce(
      (acc, translationKey) => {
        const multiligualKey = MULTILINGUAL_TO_TRANSLATIONS_MAP[translationKey];
        const override = this.multilingualService.get(multiligualKey);
        if (override) {
          acc[translationKey] = override;
        }
        return acc;
      },
      {...this.translations}
    );
  }

  private getProductWidgetTranslations(): Promise<TranslationDictionary> {
    return getTranslations(translationPath(this.siteStore.baseUrls.productWidgetBaseUrl, this.siteStore.locale));
  }

  private getDefaultProps() {
    return {
      cssBaseUrl: this.siteStore.baseUrls.productWidgetBaseUrl,
      onAppLoaded: this.onAppLoaded,
      horizontalLayout: this.widgetPreset === WidgetPresetIdEnum.HORIZONTAL && !this.siteStore.isMobile(),
      isInteractive: this.siteStore.isInteractive(),
      widgetPreset: this.widgetPreset,
      isMobile: this.siteStore.isMobile(),
      isRTL: this.siteStore.isRTL(),
      experiments: {
        showPreOrderPrice: this.siteStore.experiments.enabled(SPECS.SHOW_PRE_ORDER_PRICE),
        useNewQueriesWithDiscountOnProductWidget: this.siteStore.experiments.enabled(
          SPECS.USE_NEW_QUERIES_WITH_DISCOUNT_ON_PRODUCT_WIDGET
        ),
        ShowAutomaticDiscountDataOnProductWidget: this.siteStore.experiments.enabled(
          SPECS.SHOW_AUTOMATIC_DISCOUNT_DATA_ON_PRODUCT_WIDGET
        ),
      },
      texts: this.getTexts(),
      htmlTags: this.getHtmlTags(),
    };
  }

  private getHtmlTags(): IHtmlTags {
    return {
      productNameHtmlTag: this.publicData.COMPONENT.nameHtmlTag || HeadingTags.H3,
    };
  }

  private setEmptyStateProps() {
    this.setProps({
      ...this.getDefaultProps(),
      product: null,
      emptyState: true,
    } as IPropsInjectedByViewerScript);

    /* istanbul ignore next: add test */
    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  public async setInitialState(): Promise<void> {
    const externalResponses = await Promise.all([
      this.getProductWidgetTranslations(),
      this.productApi.getData(
        this.externalId || '',
        this.compId,
        this.shouldRenderPriceRange,
        this.siteStore.experiments.enabled(SPECS.USE_NEW_QUERIES_WITH_DISCOUNT_ON_PRODUCT_WIDGET)
      ),
      this.siteStore.getSectionUrl(PageMap.PRODUCT),
    ]).catch((e) => {
      this.reportError(e);
      this.isExternalRequestsValid = false;
    });

    this.isUrlWithOverrides = await this.customUrlApi.init();

    if (!this.isExternalRequestsValid) {
      return;
    }

    const [translations, gqlResponse, {url}]: any = externalResponses;
    const {data} = gqlResponse;

    //TODO: FOR LOGGING PURPOSES - Don't forget to erase
    /* istanbul ignore next: hard to test it */
    if (!data.appSettings) {
      const extraInfoLog = new FetchError('Got 200 from the server, but appSettings is undefined', {
        response: gqlResponse,
        responseData: data,
      });
      this.reportError(extraInfoLog);
    }

    this.translations = translations;

    this.productPriceBreakdown = new ProductPriceBreakdown(this.siteStore, this.translations, {
      excludedPattern: 'productWidget.price.tax.excludedParam.label',
      includedKey: 'productWidget.price.tax.included.label',
      includedPattern: 'productWidget.price.tax.includedParam.label',
      excludedKey: 'productWidget.price.tax.excluded.label',
    });

    this.multilingualService = new MultilingualService(
      this.siteStore,
      this.publicData.COMPONENT,
      data.appSettings.widgetSettings
    );

    /* istanbul ignore next: hard to test it */
    this.product = data?.catalog?.product;

    if (!this.product) {
      this.setEmptyStateProps();
      return;
    }

    const propsToInject: IPropsInjectedByViewerScript = {
      ...this.getDefaultProps(),
      experiments: {
        showPreOrderPrice: this.siteStore.experiments.enabled(SPECS.SHOW_PRE_ORDER_PRICE),
        useNewQueriesWithDiscountOnProductWidget: this.siteStore.experiments.enabled(
          SPECS.USE_NEW_QUERIES_WITH_DISCOUNT_ON_PRODUCT_WIDGET
        ),
        ShowAutomaticDiscountDataOnProductWidget: this.siteStore.experiments.enabled(
          SPECS.SHOW_AUTOMATIC_DISCOUNT_DATA_ON_PRODUCT_WIDGET
        ),
      },
      emptyState: false,
      handleAddToCart: this.handleAddToCart,
      hasDiscount: this.isDisabled ? this.product.comparePrice > 0 : hasDiscount(this.product),
      isDisabled: this.isDisabled,
      isSEO: this.siteStore.seo.isInSEO(),
      navigate: this.navigate,
      product: this.product,
      shouldRenderPriceRange: this.shouldRenderPriceRange,
      productPageUrl: this.product.urlPart ? this.getProductPageUrl(url, this.product.urlPart) : '',
      ravenUserContextOverrides: {id: this.siteStore.storeId, uuid: this.siteStore.uuid},
      shouldFocusAddToCartButton: false,
      clickShippingInfoLinkSf: this.sendClickShippingInfoLinkSf.bind(this),
      priceBreakdown: {
        shouldRenderTaxDisclaimer: this.productPriceBreakdown.shouldShowTaxDisclaimer,
        shippingDisclaimer: this.productPriceBreakdown.shippingDisclaimer,
        taxDisclaimer: this.productPriceBreakdown.taxDisclaimer,
      },
    };
    this.setProps(propsToInject);

    if (this.siteStore.isSSR()) {
      this.fedopsLogger.appLoaded();
    }
  }

  private sendClickShippingInfoLinkSf() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.siteStore.webBiLogger.report(clickShippingInfoLinkSf({productId: this.product.id}));
  }

  private getProductPageUrl(url: string, slug: string) {
    return this.isUrlWithOverrides ? this.customUrlApi.buildProductPageUrl({slug}) : `${url}/${this.product.urlPart}`;
  }

  private get isDisabled() {
    return (
      this.addToCartService.getButtonState({price: actualPrice(this.product), inStock: true}) ===
      AddToCartState.DISABLED
    );
  }

  private updatePublicData(newPublicData: IControllerConfig['publicData']) {
    Object.keys(newPublicData.COMPONENT).forEach((key) => {
      this.publicData.COMPONENT[key] = newPublicData.COMPONENT[key];
    });
  }

  public updateState(
    newStyleParams: IProductWidgetStyleParams,
    newPublicData: IControllerConfig['publicData'] & {appSettings?: any}
  ): void {
    this.updatePublicData(newPublicData);
    this.styleParams = newStyleParams;

    if (!this.siteStore.experiments.enabled(SPECS.EDITOR_OOI)) {
      this.multilingualService.setWidgetSettings(newPublicData.appSettings);
    }

    this.setProps({
      texts: this.getTexts(),
      htmlTags: this.getHtmlTags(),
    });
  }

  public updateAppSettings(appSettings?: any) {
    this.multilingualService.setWidgetSettings(appSettings);
    this.setProps({
      texts: this.getTexts(),
    });
  }

  private readonly handleAddToCart = async (): Promise<any> => {
    const eventId = this.siteStore.pubSubManager.subscribe(
      'Minicart.DidClose',
      () => {
        this.setProps({
          shouldFocusAddToCartButton: Math.random(),
        });

        this.siteStore.pubSubManager.unsubscribe('Minicart.DidClose', eventId);
      },
      true
    );

    return this.productService.handleClick(this.product, this.isActionNavigate());
  };

  private readonly navigate = async (): Promise<any> => {
    return this.productService.handleClick(this.product, true);
  };

  private get widgetPreset(): WidgetPresetIdEnum {
    return this.publicData.COMPONENT.presetId || WidgetPresetIdEnum.VERTICAL;
  }
}
