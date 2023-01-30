import { loadAmbassadorMemberOrdersHttp, loadAmbassadorMembershipApiHttp } from './dynamicImports'

export class PricingPlansAmbassador {
	constructor(private readonly baseUrl: string, private readonly getInstanceHeader: () => string) {}

	checkoutService = async () => {
		const artifact = (await loadAmbassadorMembershipApiHttp()).MembershipApi(this.baseUrl)
		return artifact.CheckoutService()(this.getRequestHeaders())
	}

	memberOrdersService = async () => {
		const artifact = (await loadAmbassadorMemberOrdersHttp()).PricingPlansMemberOrders(this.baseUrl)
		return artifact.MemberOrdersService()(this.getRequestHeaders())
	}

	private getRequestHeaders = () => ({
		Authorization: this.getInstanceHeader(),
		Accept: 'application/json',
	})
}
