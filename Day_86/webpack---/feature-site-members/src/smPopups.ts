import { ILightbox, LightboxEventListener } from 'feature-lightbox'
import { AUTH_RESULT_REASON } from './constants'

const DEFAULT_CONFIG = { isCloseable: true, returnPages: false }

export class SMPopups {
	popups?: ILightbox
	onReset?: () => void
	// We use the following identifier to determine whether the
	// user closed the custom popup by himself or it closed because
	// he prompt / navigated to another custom popup / popup
	shouldRunCustomPopupCloseCallback = true
	// We use the following to keep track on requestAuthentication
	// requests so we be able reject/resolve the original request even upon
	// further navigation's
	requestAuthenticationRejectInstance: any
	requestAuthenticationResolveInstance: any
	config: { isCloseable: boolean; returnPages: boolean }

	constructor(popups?: ILightbox, onReset?: () => void) {
		this.popups = popups
		this.onReset = onReset
		this.config = DEFAULT_CONFIG
	}

	async openPopupPage(pageId: string, closeHandler?: LightboxEventListener) {
		// We are doing the following in order to determine if it's the user who closed
		// the popup or it's just closed by opening another popup replacing the opened one.
		const previousShouldRunCustomPopupCloseCallback = this.shouldRunCustomPopupCloseCallback
		this.preventCustomPopupCloseCallback()
		await this.popups?.open(pageId, () => {
			if (this.shouldRunCustomPopupCloseCallback) {
				this.rejectAuthenticationRequest()
				if (closeHandler) {
					closeHandler()
				}
			}
		})
		this.shouldRunCustomPopupCloseCallback = previousShouldRunCustomPopupCloseCallback
	}

	preventCustomPopupCloseCallback() {
		this.shouldRunCustomPopupCloseCallback = false
	}

	allowCustomPopupCloseCallback() {
		this.shouldRunCustomPopupCloseCallback = true
	}
	// In order to prevent access to a private page we must be able to track and reject the initial authentication request
	assignRequestAuthenticationRejection(reject: any) {
		this.requestAuthenticationRejectInstance = this.requestAuthenticationRejectInstance || reject
	}
	// In order to prevent access to a private page we must be able to track and resolve the initial authentication request
	assignRequestAuthenticationResolveInstance(resolve: any) {
		this.requestAuthenticationResolveInstance = this.requestAuthenticationResolveInstance || resolve
	}
	// In order to prevent access to a private page we must be able to track and reject the initial authentication request
	assignRequestAuthenticationPromise(resolve: any, reject: any) {
		this.requestAuthenticationRejectInstance = this.requestAuthenticationRejectInstance || reject
		this.requestAuthenticationResolveInstance = this.requestAuthenticationResolveInstance || resolve
	}
	rejectAuthenticationRequest() {
		if (!this.requestAuthenticationRejectInstance) {
			return
		}
		this.requestAuthenticationRejectInstance(AUTH_RESULT_REASON.CANCELED)
		// Once we do reject the authentication request we stop track it and make a
		// room for another request to come.
		this.reset()
	}
	resolveAuthenticationRequest(resolveData?: any) {
		if (!this.requestAuthenticationRejectInstance) {
			return
		}
		this.requestAuthenticationResolveInstance(resolveData)
		// Once we do resolve the authentication request we stop track it and make a
		// room for another request to come.
		this.reset()
	}
	setConfig({ isCloseable = true, returnPages = false }) {
		this.config = { isCloseable, returnPages }
	}
	reset() {
		this.onReset?.()
		this.requestAuthenticationRejectInstance = undefined
		this.requestAuthenticationResolveInstance = undefined
		this.config = DEFAULT_CONFIG
	}
}
