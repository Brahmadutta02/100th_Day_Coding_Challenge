import { PlatformEnvData } from '@wix/thunderbolt-symbols'

export const isDashboardWixCodeSdkRequired = ({ platformEnvData }: { platformEnvData: PlatformEnvData }) => {
	if (
		process.env.PACKAGE_NAME === 'thunderbolt-ds' ||
		!platformEnvData.site.experiments['thunderbolt.performance.removeDashboardFromWixCodeSdkChunk']
	) {
		return true
	}

	const url = new URL(platformEnvData.location.rawUrl)
	const inBizMgr = url.searchParams.get('inBizMgr')
	return inBizMgr === 'true'
}
