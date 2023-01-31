export const name = 'codeEmbed' as const

export const HEAD = 'head'
export const BODY_START = 'bodyStart'
export const BODY_END = 'bodyEnd'
export const locations = [HEAD, BODY_START, BODY_END]

export const locationToHtmlEmbedsSectionBeginIds: any = {
	[HEAD]: 'pageHtmlEmbeds.head start',
	[BODY_START]: 'pageHtmlEmbeds.bodyStart start',
	[BODY_END]: 'pageHtmlEmbeds.bodyEnd start',
}

export const locationToHtmlEmbedsSectionEndIds: any = {
	[HEAD]: 'pageHtmlEmbeds.head end',
	[BODY_START]: 'pageHtmlEmbeds.bodyStart end',
	[BODY_END]: 'pageHtmlEmbeds.bodyEnd end',
}
