export const getRegularIdSelector = (compId: string) => `#${compId}`
export const getTemplateRepeaterIdSelector = (compId: string) => `[id^="${compId}__"]`
export const getInflatedRepeaterIdSelector = (compId: string) => `[id="${compId}"]`
