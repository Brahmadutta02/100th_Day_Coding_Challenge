import { createFedopsLogger } from '@wix/thunderbolt-commons'
import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, WixStoresWixCodeSdkWixCodeApi } from '..'
import { CartServiceSdk } from './services/cart'
import { NavigateServiceSdk } from './services/navigate'
import { ProductServiceSdk } from './services/product'

export function WixStoresSdkFactory({
	platformUtils,
}: WixCodeApiFactoryArgs): { [namespace]: WixStoresWixCodeSdkWixCodeApi } {
	const { sessionService, biUtils, appsPublicApisUtils, essentials } = platformUtils

	const biLoggerFactory = biUtils.createBiLoggerFactoryForFedops()
	const fedopsLogger = createFedopsLogger({
		biLoggerFactory,
		phasesConfig: 'SEND_START_AND_FINISH',
		appName: 'wixstores-wix-code-sdk',
		factory: essentials.createFedopsLogger,
	})

	const cartServiceSdk = new CartServiceSdk(sessionService, fedopsLogger, appsPublicApisUtils, platformUtils)
	const productServiceSdk = new ProductServiceSdk(sessionService, fedopsLogger, appsPublicApisUtils, platformUtils)
	const navigateServiceSdk = new NavigateServiceSdk(sessionService, fedopsLogger, appsPublicApisUtils, platformUtils)

	return {
		[namespace]: {
			async getProductOptionsAvailability(
				productId: string,
				options: { [key: string]: string } = {}
			): Promise<any> {
				return productServiceSdk.getOptionsAvailability(productId, options)
			},
			async getProductVariants(productId: string, options: { [key: string]: string } = {}): Promise<any> {
				return productServiceSdk.getVariants(productId, options)
			},
			async getCurrentCart(): Promise<any> {
				return cartServiceSdk.getCurrentCart()
			},
			onCartChanged(handler: (cart: any) => void) {
				cartServiceSdk.onChange(handler)
			},
			removeProductFromCart(cartItemId: number): Promise<any> {
				return cartServiceSdk.removeProduct(cartItemId)
			},
			addCustomItemsToCart(customItems: Array<any>): Promise<any> {
				return cartServiceSdk.addCustomItems(customItems)
			},
			product: {
				async getOptionsAvailability(productId: string, options: { [key: string]: string } = {}): Promise<any> {
					return productServiceSdk.getOptionsAvailability(productId, options)
				},
				async getVariants(productId: string, options: { [key: string]: string } = {}): Promise<any> {
					return productServiceSdk.getVariants(productId, options)
				},
				async openQuickView(productId: string, options: { quantity?: number }): Promise<any> {
					return productServiceSdk.openQuickView(productId, options)
				},
			},
			cart: {
				applyCoupon(couponCode: string): Promise<any> {
					return cartServiceSdk.applyCoupon(couponCode)
				},
				removeCoupon(): Promise<any> {
					return cartServiceSdk.removeCoupon()
				},
				updateLineItemQuantity(
					cartItemId: number,
					quantity: number,
					options?: { silent: boolean }
				): Promise<any> {
					return cartServiceSdk.updateLineItemQuantity(cartItemId, quantity, options)
				},
				addProducts(products: Array<any>, options?: { silent: boolean }): Promise<any> {
					return cartServiceSdk.addProducts(products, options)
				},
				showMiniCart(): void {
					cartServiceSdk.showMiniCart()
				},
				hideMiniCart(): void {
					cartServiceSdk.hideMiniCart()
				},
				async getCurrentCart(): Promise<any> {
					return cartServiceSdk.getCurrentCart()
				},
				onChange(handler: (cart: any) => void) {
					cartServiceSdk.onChange(handler)
				},
				removeProduct(cartItemId: number, options?: { silent: boolean }): Promise<any> {
					return cartServiceSdk.removeProduct(cartItemId, options)
				},
				addCustomItems(customItems: Array<any>): Promise<any> {
					return cartServiceSdk.addCustomItems(customItems)
				},
				reload(): void {
					cartServiceSdk.reload()
				},
			},
			navigate: {
				toCart(): Promise<any> {
					return navigateServiceSdk.toCart()
				},
				toThankYouPage(orderInformation: { orderId?: string; subscriptionId?: string }): Promise<any> {
					return navigateServiceSdk.toThankYouPage(orderInformation)
				},
			},
		},
	}
}
