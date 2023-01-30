export const importDataSdkFactory = async () => {
	const { DataSdkFactory } = await import('feature-data-wix-code-sdk/factory' /* webpackChunkName: "feature-data-wix-code-sdk" */)
	return DataSdkFactory
}
