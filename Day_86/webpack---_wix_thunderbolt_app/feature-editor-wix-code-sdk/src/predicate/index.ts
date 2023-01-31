import type { PlatformEnvData } from '@wix/thunderbolt-symbols'

export const isWixEditorRequired = ({ platformEnvData }: { platformEnvData: PlatformEnvData }): boolean => {
	// We want to turn on loading editor/widget features for ds mode so that
	// ds implementations of our namespaces are loaded and we can run our velo code
	// over those implementations in panel builder preview
	if (process.env.PACKAGE_NAME === 'thunderbolt-ds') {
		return true
	}

	const url = new URL(platformEnvData.location.rawUrl)
	const sdkVersion = url.searchParams.get('sdkVersion')
	const componentRef = url.searchParams.get('componentRef')

	return sdkVersion !== null && componentRef !== null
}
