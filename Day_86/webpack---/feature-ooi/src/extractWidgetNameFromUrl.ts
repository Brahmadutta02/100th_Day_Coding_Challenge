export function extractWidgetNameFromUrl(url: string): string {
	const fileName = url.split('/').slice(-1)[0]
	return fileName.split('.')[0]
}
