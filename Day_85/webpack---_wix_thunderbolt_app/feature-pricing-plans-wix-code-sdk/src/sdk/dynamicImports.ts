export function loadAmbassadorMembershipApiHttp() {
	return import('@wix/ambassador-membership-api/http' /* webpackChunkName: "ambassadorMembershipApi" */)
}

export function loadAmbassadorMemberOrdersHttp() {
	return import(
		'@wix/ambassador-pricing-plans-member-orders/http' /* webpackChunkName: "ambassadorPricingPlansMemberOrders" */
	)
}
