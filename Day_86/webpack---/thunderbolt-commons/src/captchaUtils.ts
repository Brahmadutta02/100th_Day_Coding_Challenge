import type { Language } from '@wix/thunderbolt-becky-types'

export interface ICaptchaDialog extends Record<string, Function> {
	openCaptchaDialog(): Promise<string | null>

	withCaptchaChallengeHandler<T extends (recaptchaToken?: string | null) => any>(cb: T): Promise<ReturnType<T>>
}

export const captchaChallengeActions = {
	login: 'LOGIN',
	signup: 'SIGNUP',
} as const
export type CaptchaChallengeActions = typeof captchaChallengeActions[keyof typeof captchaChallengeActions]

export const getWithCaptchaChallengeHandler = ({
	openCaptchaDialog,
}: {
	openCaptchaDialog: ICaptchaDialog['openCaptchaDialog']
}) => (cb: (token?: string | null) => any) => {
	const handler = async (token?: string | null): Promise<any> => {
		try {
			const response = await cb(token)
			return response
		} catch (error) {
			if (isCaptchaTokenRequired(error)) {
				// openCaptchaDialog might return empty string in case the captcha was closed
				token =
					(await openCaptchaDialog().catch(() => {
						throw error
					})) || undefined
				if (token) {
					return handler(token)
				}
			}
			throw error
		}
	}
	return handler()
}

export const getOpenCaptcha = ({
	captcha,
	userLanguage,
}: {
	captcha?: ICaptchaApi
	userLanguage: Language
}) => (): Promise<string> => {
	return captcha
		? new Promise((resolve, reject) => {
				captcha.close()
				captcha.open({
					onVerified: (token: string) => {
						captcha.close()
						resolve(token)
					},
					onClose: () => {
						captcha.close()
						reject()
					},
					language: userLanguage,
				})
		  })
		: Promise.resolve('')
}

export const isCaptchaTokenRequired = (error: any) => {
	const errorCode = error?.details?.errorcode || error?.details?.errorCode || error?.details?.applicationError?.code
	return CAPTCHA_ERROR_CODES.includes(errorCode)
}

export interface ICaptchaApi {
	open(props: CaptchaDialogProps): void
	close(): void
}

export type CaptchaDialogProps = {
	language: Language
	onVerified: (token: string) => void
	onClose: () => void
}

export const ERROR_CODES = {
	SM_CAPTCHA_REQUIRED: '-19971',
	SM_CAPTCHA_INVALID: '-19970',
	REQUEST_THROTTLED: '-19959',
}

export const CAPTCHA_ERROR_CODES = [
	ERROR_CODES.SM_CAPTCHA_REQUIRED,
	ERROR_CODES.SM_CAPTCHA_INVALID,
	ERROR_CODES.REQUEST_THROTTLED,
]
