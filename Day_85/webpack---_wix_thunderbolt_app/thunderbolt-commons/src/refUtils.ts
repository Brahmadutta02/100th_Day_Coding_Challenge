export const REF_DELIMITER = '_r_'

export const getUniqueId = (refId: string, originalId: string) => `${refId}${REF_DELIMITER}${originalId}`

export const getRefCompIdFromInflatedId = (id: string): string => id.split(`${REF_DELIMITER}`)[0]

// Will give different result than getRefCompIdFromInflatedId()
// in case of widget-in-widget. for example:
// id='firstRefComp_r_secondRefComp_r_innerCompId' -> return 'firstRefComp_r_secondRefComp'
export const getMultipleRefCompsIdFromInflatedId = (id: string): string => {
	return id.substring(0, id.lastIndexOf(`${REF_DELIMITER}`)) || id
}
export const getTemplateFromInflatedId = (id: string): string | undefined => id.split(REF_DELIMITER).pop()
