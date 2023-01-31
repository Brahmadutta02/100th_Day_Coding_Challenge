/**
 * Webpack types does not export this.
 */
export interface RequireContext {
	keys(): Array<string>
	(id: string): any
	<T>(id: string): T
	resolve(id: string): string
	/** The module id of the context module. This may be useful for module.hot.accept. */
	id: string
}

export function importAll<T>(requireContext: RequireContext): Array<T> {
	return requireContext.keys().map<T>((key) => requireContext(key).default)
}
