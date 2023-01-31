export function getCompClassType(componentType: string, uiType?: string) {
	return uiType ? `${componentType}_${uiType}` : componentType
}
