export const extractInnerRoute = (path: string, tpaPageUri?: string) => {
	const parts = path.split('/')
	const i = parts.indexOf(tpaPageUri || '')
	if (i < 0 || parts[i] !== tpaPageUri) {
		return null
	}
	const [, ...remains] = parts.splice(i)
	return remains
}
