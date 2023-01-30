export const STORES_APP_DEF_ID = '1380b703-ce81-ff05-f115-39571d94dfcd'
export const CATALOG_API_BASE_URL = '/_api/catalog-reader-server'
export const CART_API_BASE_URL = '/_api/cart-server'

export enum WixStoresProductSdkInteraction {
	GET_PRODUCT_OPTIONS_AVAILABILITY = 'get-product-options-availability',
	GET_PRODUCT_VARIANTS = 'get-product-variants',
	OPEN_QUICK_VIEW = 'open-quick-view',
}

export enum WixStoresCartSdkInteraction {
	GET_CURRENT_CART = 'get-current-cart',
	APPLY_COUPON = 'cart-apply-coupon',
	REMOVE_COUPON = 'cart-remove-coupon',
	UPDATE_LINE_ITEM_QUANTITY = 'update-line-item-quantity',
	ADD_PRODUCTS_TO_CART = 'add-products-to-cart',
	SHOW_MINI_CART = 'show-mini-cart',
	HIDE_MINI_CART = 'hide-mini-cart',
	RELOAD = 'reload-cart',
	ON_CART_CHANGED = 'on-cart-changed',
	REMOVE_PRODUCT_FROM_CART = 'remove-product-from-cart',
	ADD_CUSTOM_ITEMS_TO_CART = 'add-custom-items-to-cart',
}

export enum WixStoresNavigateSdkInteraction {
	NAVIGATE_TO_CART = 'navigate-to-cart',
	NAVIGATE_TO_THANK_YOU_PAGE = 'navigate-to-thank-you-page',
}
