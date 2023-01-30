import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { namespace, PaidPlansWixCodeSdkWixCodeApi } from '..'
import { PricingPlansApi } from './pricingPlansApi'
import { APP_DEF_ID } from './constants'
import { validateGuid } from './validation'
import { HttpApi } from './httpApi'

export function PaidPlansSdkFactory({
	platformUtils,
	wixCodeNamespacesRegistry,
}: WixCodeApiFactoryArgs): {
	[namespace]: PaidPlansWixCodeSdkWixCodeApi
} {
	const { locationManager, sessionService } = platformUtils
	const url = locationManager.getLocation()

	const getInstanceHeader = () => sessionService.getInstance(APP_DEF_ID)
	const apiUrl = { protocol: url.protocol, hostname: url.hostname }
	const httpApi = new HttpApi(apiUrl, getInstanceHeader)

	const api = new PricingPlansApi(httpApi)

	async function ensureMemberIsLoggedIn() {
		const siteMembers = wixCodeNamespacesRegistry.get('user')
		if (!siteMembers.currentUser.loggedIn) {
			await siteMembers.promptLogin()
		}
	}

	return {
		[namespace]: {
			async getCurrentMemberOrders(limit?: number, offset?: number) {
				await ensureMemberIsLoggedIn()
				return api.getCurrentMemberOrders(limit, offset)
			},

			async orderPlan(planId: string) {
				validateGuid(planId)
				await ensureMemberIsLoggedIn()

				return api.createOrder(planId)
			},

			async cancelOrder(orderId: string) {
				validateGuid(orderId)
				await ensureMemberIsLoggedIn()

				return api.cancelOrder(orderId)
			},

			async purchasePlan(planId: string) {
				validateGuid(planId)
				await ensureMemberIsLoggedIn()

				const wixPay = wixCodeNamespacesRegistry.get('pay')

				const { orderId, wixPayOrderId } = await api.createOrder(planId)

				if (!wixPayOrderId) {
					return { orderId }
				}

				const { status: wixPayStatus } = await wixPay.startPayment(wixPayOrderId, { showThankYouPage: true })

				return {
					orderId,
					wixPayOrderId,
					wixPayStatus,
				}
			},
		},
	}
}
