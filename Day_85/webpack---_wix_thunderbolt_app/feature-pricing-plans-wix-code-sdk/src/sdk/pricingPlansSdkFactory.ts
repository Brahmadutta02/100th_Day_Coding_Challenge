import { WixCodeApiFactoryArgs } from '@wix/thunderbolt-symbols'
import { CurrentMemberFilterOptions, namespace, Paging, PricingPlansWixCodeSdkWixCodeApi } from '..'
import { API_BASE_PATH, APP_DEF_ID } from './constants'
import { validateGuid } from './validation'
import { PricingPlansAmbassador } from './pricingPlansAmbassador'
import { CancellationEffectiveAtEnum, PricingPlansApi } from './pricingPlansApi'
import { Sorting } from '@wix/ambassador-pricing-plans-member-orders/src/types'
import { isArray, isPlainObject, mapKeys, transform } from 'lodash'

const TO_CORVID_ENTITY_RENAMED_KEYS: Record<string, string> = {
	id: '_id',
	createdDate: '_createdDate',
	updatedDate: '_updatedDate',
}
const toCorvidName = (object: any) => mapKeys(object, (v, k) => TO_CORVID_ENTITY_RENAMED_KEYS[k] || k)

const mapObjectDeep = (object: any, renameObjectKeys: any) =>
	renameObjectKeys(
		transform(object, (acc, value, key) => {
			// eslint-disable-next-line no-use-before-define
			acc[key] = mapDeep(value, renameObjectKeys)
		})
	)

const mapDeep = (payload: any, renameObjectKeys: any): any => {
	if (isPlainObject(payload)) {
		return mapObjectDeep(payload, renameObjectKeys)
	}

	if (isArray(payload)) {
		return payload.map((item) => mapDeep(item, renameObjectKeys))
	}

	return payload
}

const toCorvidEntity = (payload: any) => mapDeep(payload, toCorvidName)

export function PricingPlansSdkFactory({
	platformUtils,
	wixCodeNamespacesRegistry,
}: WixCodeApiFactoryArgs): {
	[namespace]: PricingPlansWixCodeSdkWixCodeApi
} {
	const { sessionService } = platformUtils

	const ppAmbassador = new PricingPlansAmbassador(API_BASE_PATH, () => sessionService.getInstance(APP_DEF_ID))
	const api = new PricingPlansApi(ppAmbassador)

	async function ensureMemberIsLoggedIn() {
		const siteMembers = wixCodeNamespacesRegistry.get('user')
		if (!siteMembers.currentUser.loggedIn) {
			await siteMembers.promptLogin()
		}
	}

	const pricingPlansSdk: PricingPlansWixCodeSdkWixCodeApi = {
		checkout: {
			async createOnlineOrder(planId: string, startDate?: Date) {
				validateGuid(planId)
				await ensureMemberIsLoggedIn()

				return api.startOnlineOrder(planId, startDate).then(toCorvidEntity)
			},

			async startOnlinePurchase(planId: string, startDate?: Date) {
				validateGuid(planId)
				await ensureMemberIsLoggedIn()

				const wixPay = wixCodeNamespacesRegistry.get('pay')

				const order = await api.startOnlineOrder(planId, startDate).then(toCorvidEntity)

				if (!order.wixPayOrderId) {
					return { order }
				}

				const { status: wixPayStatus } = await wixPay.startPayment(order.wixPayOrderId, {
					showThankYouPage: true,
				})

				return {
					order,
					wixPayStatus,
				}
			},
		},

		orders: {
			async listCurrentMemberOrders(filter: CurrentMemberFilterOptions, sorting?: Sorting, paging?: Paging) {
				await ensureMemberIsLoggedIn()
				return api
					.listCurrentMemberOrders({
						...filter,
						sorting,
						limit: paging?.limit,
						offset: paging?.skip,
					})
					.then((orders) => orders.map(toCorvidEntity))
			},

			async requestCurrentMemberOrderCancellation(
				orderId: string,
				cancellationEffectiveAt: CancellationEffectiveAtEnum
			) {
				validateGuid(orderId)
				await ensureMemberIsLoggedIn()

				await api.requestMemberOrderCancellation(orderId, cancellationEffectiveAt)
			},
		},
	}

	return {
		[namespace]: pricingPlansSdk,
	}
}
