export const importWidgetSdkFactory = async () => {
	const { WidgetSdkFactory } =
		process.env.PACKAGE_NAME === 'thunderbolt-ds'
			? await import('feature-widget-wix-code-sdk/dsFactory' /* webpackChunkName: "feature-ds-widget-wix-code-sdk" */)
			: await import('feature-widget-wix-code-sdk/factory' /* webpackChunkName: "feature-widget-wix-code-sdk" */)
	return WidgetSdkFactory
}
