import type { TpaIncomingMessage } from './types'

export const isTpaMessage = (msg: TpaIncomingMessage<any>) => msg && ['TPA', 'TPA2'].includes(msg.intent)

export const editorOnlyHandlers = ['getWixUpgradeUrl', 'stylesReady', 'getViewModeInternal', 'setHelpArticle']
