export const importElementorySupportSdkFactory = async () => {
	const { ElementorySupportSdkFactory } = await import('feature-elementory-support-wix-code-sdk/factory' /* webpackChunkName: "feature-elementory-support-wix-code-sdk" */)

	return ElementorySupportSdkFactory
}
