import {
	ReportBI,
	SendBeat,
	BIReporter,
	BISymbol,
	WixBiSessionSymbol,
	ReportPageNavigation,
	ReportPageNavigationDone,
} from '@wix/thunderbolt-symbols'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../types/Environment'

const consoleReportBi = (...args: Array<any>) => console.log('[TB] ', ...args)

export function createBiReporter(
	reportBI: ReportBI = consoleReportBi,
	sendBeat: SendBeat = consoleReportBi,
	setDynamicSessionData: BIReporter['setDynamicSessionData'] = () => {},
	reportPageNavigation: ReportPageNavigation = consoleReportBi,
	reportPageNavigationDone: ReportPageNavigationDone = consoleReportBi
): BIReporter {
	return {
		reportBI,
		sendBeat,
		setDynamicSessionData,
		reportPageNavigation,
		reportPageNavigationDone,
	}
}

export const site = ({ biReporter, wixBiSession }: Environment): ContainerModuleLoader => (bind) => {
	bind(WixBiSessionSymbol).toConstantValue(wixBiSession)
	bind(BISymbol).toConstantValue(biReporter)
}
