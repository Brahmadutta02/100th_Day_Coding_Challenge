import { TpaCompData } from '@wix/thunderbolt-symbols'

const chatWidgetId = '14517f3f-ffc5-eced-f592-980aaa0bbb5c'

export const getTemplateOrUniqueId = (id: string, tpaCompData: TpaCompData) =>
	isResponsiveChat(tpaCompData) ? tpaCompData.templateId || id : id

export const isResponsiveChat = ({ isResponsive, widgetId }: TpaCompData) => isResponsive && widgetId === chatWidgetId
