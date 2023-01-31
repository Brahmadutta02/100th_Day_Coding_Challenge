export default function shouldExposeNewDashboardSdk({ locationHref }: { locationHref: string }) {
	const isDashbordSdkAvailable = new URL(locationHref).searchParams.get('dashboardSdkAvailable') === 'true'
	return isDashbordSdkAvailable
}
