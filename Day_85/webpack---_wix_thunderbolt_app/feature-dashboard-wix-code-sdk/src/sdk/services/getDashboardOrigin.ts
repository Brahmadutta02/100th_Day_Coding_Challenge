export default function getDashboardOrigin(url: string) {
	return new URL(url).searchParams.get('origin')
}
