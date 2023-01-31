export function loadProductOptionsAvailabilityMapper() {
	return import(
		'@wix/wixstores-platform-common/dist/src/productOptionsAvailability/productOptionsAvailability.mapper' /* webpackChunkName: "storesWixCodeVendors" */
	)
}

export function loadProductVariantsMapper() {
	return import(
		'@wix/wixstores-platform-common/dist/src/productVariants/productVariants.mapper' /* webpackChunkName: "storesWixCodeVendors" */
	)
}

export function loadCartMapper() {
	return import(
		'@wix/wixstores-platform-common/dist/src/carts/cart.mapper.client' /* webpackChunkName: "storesWixCodeVendors" */
	)
}

export function loadAmbassadorWixEcomCatalogReaderWebHttp() {
	return import(
		// @ts-ignore
		'@wix/ambassador-wix-ecommerce-catalog-reader-web/http' /* webpackChunkName: "storesWixCodeVendors" */
	)
}

export function loadAmbassadorWixEcomCartServicesWebHttp() {
	return import('@wix/ambassador-wix-ecommerce-cart-services-web/http' /* webpackChunkName: "storesWixCodeVendors" */)
}
