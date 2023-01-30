import {SiteStore} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/site-store/SiteStore';
import {QuickViewActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/QuickViewActions/QuickViewActions';
import {
  PageMap,
  AddToCartActionOption,
  STORAGE_PAGINATION_KEY,
  BiButtonActionType,
} from '@wix/wixstores-client-core/dist/es/src/constants';
import {IProductWidgetDTO} from '../types/app-types';
import {IWidgetControllerConfig} from '@wix/native-components-infra/dist/src/types/types';
import {FedopsLogger} from '@wix/fedops-logger';
import {IStoreFrontNavigationContext} from '@wix/wixstores-client-core/dist/es/src/types/site-map';
import {origin} from '../constants';
import {
  actualPrice,
  actualSku,
  hasSubscriptionPlans,
} from '@wix/wixstores-client-core/dist/es/src/productOptions/productUtils';
import {CartActions} from '@wix/wixstores-client-storefront-sdk/dist/es/src/actions/CartActions/CartActions';
import {clickAddToCartWithOptionsSf} from '@wix/bi-logger-ec-sf/v2';

export class ProductService {
  private readonly quickviewActions: QuickViewActions;
  private readonly cartActions: CartActions;

  constructor(
    private readonly siteStore: SiteStore,
    private readonly compId: IWidgetControllerConfig['compId'],
    private readonly externalId: string,
    private readonly fedopsLogger: FedopsLogger
  ) {
    this.quickviewActions = new QuickViewActions(this.siteStore);
    this.cartActions = new CartActions({siteStore: this.siteStore, origin});
  }

  private hasSubscriptions(product: IProductWidgetDTO) {
    return hasSubscriptionPlans(product);
  }

  private storeNavigationHistory() {
    const pageId = this.siteStore.siteApis.currentPage.id;
    const history: IStoreFrontNavigationContext = {
      pageId,
      paginationMap: [],
    };
    this.siteStore.storage.local.setItem(STORAGE_PAGINATION_KEY, JSON.stringify(history));
  }

  public handleClick(product: IProductWidgetDTO, navigate: boolean): Promise<any> {
    if (navigate) {
      this.storeNavigationHistory();

      return this.siteStore.navigate(
        {
          sectionId: PageMap.PRODUCT,
          state: product.urlPart,
          queryParams: undefined,
        },
        true
      );
    } else if (!product.hasOptions && !this.hasSubscriptions(product)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.fedopsLogger.interactionStarted('add-to-cart');
      return this.cartActions.addToCart(
        {
          productId: product.id,
          quantity: 1,
          addToCartAction: AddToCartActionOption.MINI_CART,
          onSuccess: () => this.fedopsLogger.interactionEnded('add-to-cart'),
        },
        {
          id: product.id,
          name: product.name,
          price: actualPrice(product),
          sku: actualSku(product),
          type: product.productType,
          buttonType: BiButtonActionType.AddToCart,
          appName: 'productWidgetApp',
          isNavigateCart: this.cartActions.shouldNavigateToCart(),
          navigationClick: this.cartActions.shouldNavigateToCart() ? 'cart' : 'mini-cart',
          productType: product.productType as any,
        }
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.siteStore.webBiLogger.report(
        clickAddToCartWithOptionsSf({
          appName: 'productWidgetApp',
          origin,
          hasOptions: true,
          productId: product.id,
          productType: product.productType,
          navigationClick: this.siteStore.isMobile() ? 'product-page' : 'quick-view',
        })
      );
      return this.quickviewActions.quickViewProduct({
        origin: 'productwidget',
        urlPart: product.urlPart,
        compId: this.compId,
        externalId: this.externalId,
      });
    }
  }
}
