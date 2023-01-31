export const importDashboardSdkFactory = async () => {
	const { DashboardSdkFactory } = await import('feature-dashboard-wix-code-sdk/factory' /* webpackChunkName: "feature-dashboard-wix-code-sdk" */)
	return DashboardSdkFactory
}
