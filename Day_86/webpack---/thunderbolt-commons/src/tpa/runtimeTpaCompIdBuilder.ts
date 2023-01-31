export const TPA_RUNTIME_COMP_ID_SEPARATOR = '_rtby_' // must be different than (and not start with) REPEATER_DELIMITER

export const runtimeTpaCompIdBuilder = {
	buildRuntimeCompId(prefix: string, originCompId: string): string {
		return `${prefix}${TPA_RUNTIME_COMP_ID_SEPARATOR}${originCompId}`
	},
	isRuntimeCompId(compId: string) {
		return compId.split(TPA_RUNTIME_COMP_ID_SEPARATOR).length > 1
	},
	getOriginCompId(compId: string): string {
		const [id, originCompId] = compId.split(TPA_RUNTIME_COMP_ID_SEPARATOR)
		return originCompId || id
	},
}
