import { SITE_CONTEXT_OTP_QUERY_PARAM } from '@wix/thunderbolt-symbols'

export const isSiteContextOverrideMessage = (msg: any) => msg.type === SITE_CONTEXT_OTP_QUERY_PARAM
