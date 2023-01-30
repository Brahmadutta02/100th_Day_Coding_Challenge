import type { FedopsLogger } from '@wix/fe-essentials-viewer-platform/fedops'
import { ConsentPolicyInteraction, ConsentPolicyLogger, NonPromise } from './types'

export function createConsentPolicyLogger(fedopsLogger: FedopsLogger): ConsentPolicyLogger {
	return {
		executeAndLog<T>(action: () => NonPromise<T>, interaction: ConsentPolicyInteraction) {
			fedopsLogger.interactionStarted(interaction)
			const res = action()
			fedopsLogger.interactionEnded(interaction)
			return res
		},
		async executeAndLogAsync<T>(action: () => Promise<T>, interaction: ConsentPolicyInteraction): Promise<T> {
			fedopsLogger.interactionStarted(interaction)
			const res = await action()
			fedopsLogger.interactionEnded(interaction)
			return res
		},
	}
}
