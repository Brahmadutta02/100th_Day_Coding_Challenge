import { loadCartMapper } from '../dynamicImports'
import { STORES_APP_DEF_ID, WixStoresCartSdkInteraction } from '../constants'
import { WixStoresServiceSdk } from '../WixStoresServiceSdk'

export class CartServiceSdk extends WixStoresServiceSdk {
	async getCurrentCart(): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.GET_CURRENT_CART)
		const { gqlCartMapperClient } = await loadCartMapper()
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			const cart = await api.cart.getCurrentCart()
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.GET_CURRENT_CART)
			return gqlCartMapperClient(cart)
		})
	}

	onChange(handler: (cart: any) => void) {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.ON_CART_CHANGED)
		this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then((api: any) => {
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.ON_CART_CHANGED)
			// @ts-ignore
			api.cart.onChange(() => {
				this.getCurrentCart().then((cart) => handler(cart))
			})
		})
	}

	removeProduct(cartItemId: number, options?: { silent: boolean }): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.REMOVE_PRODUCT_FROM_CART)
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			// @ts-ignore
			await api.cart.removeProduct(cartItemId, options)
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.REMOVE_PRODUCT_FROM_CART)
			return this.getCurrentCart()
		})
	}

	addCustomItems(customItems: Array<any>): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.ADD_CUSTOM_ITEMS_TO_CART)
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			await api.cart.addCustomItems(customItems)
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.ADD_CUSTOM_ITEMS_TO_CART)
			return this.getCurrentCart()
		})
	}

	applyCoupon(couponCode: string): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.APPLY_COUPON)
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			await api.cart.applyCoupon(couponCode)
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.APPLY_COUPON)
			return this.getCurrentCart()
		})
	}

	removeCoupon(): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.REMOVE_COUPON)
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			await api.cart.removeCoupon()
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.REMOVE_COUPON)
			return this.getCurrentCart()
		})
	}

	updateLineItemQuantity(cartItemId: number, quantity: number, options?: { silent: boolean }): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.UPDATE_LINE_ITEM_QUANTITY)
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			await api.cart.updateLineItemQuantity(cartItemId, quantity, options)
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.UPDATE_LINE_ITEM_QUANTITY)
			return this.getCurrentCart()
		})
	}

	addProducts(products: Array<any>, options?: { silent: boolean }): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.ADD_PRODUCTS_TO_CART)
		return this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			await api.cart.addProducts(products, options)
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.ADD_PRODUCTS_TO_CART)
			return this.getCurrentCart()
		})
	}

	showMiniCart(): void {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.SHOW_MINI_CART)
		this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then((api: any) => {
			api.cart.showMinicart()
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.SHOW_MINI_CART)
		})
	}

	hideMiniCart(): void {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.HIDE_MINI_CART)
		this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then((api: any) => {
			api.cart.hideMinicart()
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.HIDE_MINI_CART)
		})
	}

	reload(): void {
		this.fedopsLogger.interactionStarted(WixStoresCartSdkInteraction.RELOAD)
		this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			api.cart.reloadCart()
			this.fedopsLogger.interactionEnded(WixStoresCartSdkInteraction.RELOAD)
		})
	}
}
