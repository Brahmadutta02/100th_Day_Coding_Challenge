export function getControllerNameFromUrl(controllerScriptUrl: string): string {
	return controllerScriptUrl.split('/').slice(-1)[0].split('.')[0]
}
