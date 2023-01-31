import { withDependencies } from '@wix/thunderbolt-ioc'
import { getOpenCaptcha, getWithCaptchaChallengeHandler, ICaptchaDialog, ICaptchaApi } from '@wix/thunderbolt-commons'
import { ILanguage, LanguageSymbol, CaptchaApiSymbol } from '@wix/thunderbolt-symbols'

export const AuthenticationApi = withDependencies(
	[CaptchaApiSymbol, LanguageSymbol],
	(captcha: ICaptchaApi, language: ILanguage): ICaptchaDialog => {
		const openCaptchaDialog = getOpenCaptcha({ captcha, userLanguage: language.userLanguage })
		const api: ICaptchaDialog = {
			openCaptchaDialog,
			withCaptchaChallengeHandler: getWithCaptchaChallengeHandler({ openCaptchaDialog }),
		}
		return api
	}
)
