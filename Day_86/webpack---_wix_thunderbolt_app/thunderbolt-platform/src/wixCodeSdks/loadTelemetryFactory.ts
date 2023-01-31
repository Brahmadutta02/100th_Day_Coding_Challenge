export const importTelemetrySdkFactory = async () => {
	const { TelemetrySdkFactory } = await import('feature-telemetry-wix-code-sdk/factory' /* webpackChunkName: "feature-telemetry-wix-code-sdk" */)

	return TelemetrySdkFactory
}
