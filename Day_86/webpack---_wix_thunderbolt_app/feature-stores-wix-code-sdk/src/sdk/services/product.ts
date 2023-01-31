import { STORES_APP_DEF_ID, WixStoresProductSdkInteraction, CATALOG_API_BASE_URL } from '../constants'
import {
	loadAmbassadorWixEcomCatalogReaderWebHttp,
	loadProductOptionsAvailabilityMapper,
	loadProductVariantsMapper,
} from '../dynamicImports'
import { WixStoresServiceSdk } from '../WixStoresServiceSdk'

export class ProductServiceSdk extends WixStoresServiceSdk {
	openQuickView(productId: string, options: { quantity?: number }): void {
		this.fedopsLogger.interactionStarted(WixStoresProductSdkInteraction.OPEN_QUICK_VIEW)
		this.appsPublicApisUtils.getPublicAPI(STORES_APP_DEF_ID).then(async (api: any) => {
			await api.product.openQuickView(productId, options)
			this.fedopsLogger.interactionEnded(WixStoresProductSdkInteraction.OPEN_QUICK_VIEW)
		})
	}

	async getOptionsAvailability(productId: string, options: { [key: string]: string } = {}): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresProductSdkInteraction.GET_PRODUCT_OPTIONS_AVAILABILITY)
		const { WixEcommerceCatalogReaderWeb } = await loadAmbassadorWixEcomCatalogReaderWebHttp()
		const { productOptionsAvailabilityMapper } = await loadProductOptionsAvailabilityMapper()

		const catalogApiFactory = WixEcommerceCatalogReaderWeb(CATALOG_API_BASE_URL).CatalogReadApi()
		const catalogApi = catalogApiFactory(this.getRequestHeaders())

		const res = await catalogApi.productOptionsAvailability({ id: productId, options })
		this.fedopsLogger.interactionEnded(WixStoresProductSdkInteraction.GET_PRODUCT_OPTIONS_AVAILABILITY)
		return productOptionsAvailabilityMapper(res as any)
	}

	async getVariants(productId: string, options: { [key: string]: string } = {}): Promise<any> {
		this.fedopsLogger.interactionStarted(WixStoresProductSdkInteraction.GET_PRODUCT_VARIANTS)
		const { WixEcommerceCatalogReaderWeb } = await loadAmbassadorWixEcomCatalogReaderWebHttp()
		const { productVariantsParamMapper, productVariantsMapper } = await loadProductVariantsMapper()

		const catalogApiFactory = WixEcommerceCatalogReaderWeb(CATALOG_API_BASE_URL).CatalogReadApi()
		const catalogApi = catalogApiFactory(this.getRequestHeaders())

		const res = await catalogApi.queryVariants({ id: productId, ...productVariantsParamMapper(options) })
		this.fedopsLogger.interactionEnded(WixStoresProductSdkInteraction.GET_PRODUCT_VARIANTS)
		return productVariantsMapper(res as any)
	}
}
