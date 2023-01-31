import { withDependencies } from '@wix/thunderbolt-ioc'
import { BusinessLogger, BusinessLoggerSymbol, ILinkClickHandler } from '@wix/thunderbolt-symbols'

// eslint-disable-next-line no-restricted-syntax
import { isMailtoUrl, isPhoneUrl, isWhatsappLink } from '@wix/thunderbolt-commons/src/platform/linkPatternUtils'
import { UrlHistoryManagerSymbol } from './symbols'
import { IUrlHistoryManager } from './types'

export const ReportBiClickHandlerFactory = (
	businessLogger: BusinessLogger,
	urlHistoryManager: IUrlHistoryManager
): ILinkClickHandler => {
	const sendBi = (clickType: string, value: string, currentUrl: string) => {
		businessLogger.logger.log(
			{
				src: 76,
				evid: 1112,
				clickType,
				value,
				url: currentUrl,
			},
			{ endpoint: 'pa' }
		)
	}
	return {
		handleClick: (anchorTarget: HTMLElement) => {
			const href = anchorTarget.getAttribute('href') || ''
			const currentUrl = urlHistoryManager.getFullUrlWithoutQueryParams()
			if (isPhoneUrl(href)) {
				sendBi('phone-clicked', href, currentUrl)
			}
			if (isMailtoUrl(href)) {
				sendBi('email-clicked', href, currentUrl)
			}
			if (isWhatsappLink(href)) {
				sendBi('whatsapp-clicked', href, currentUrl)
			}
			return false
		},
	}
}

export const ReportBiClickHandler = withDependencies(
	[BusinessLoggerSymbol, UrlHistoryManagerSymbol],
	ReportBiClickHandlerFactory
)
