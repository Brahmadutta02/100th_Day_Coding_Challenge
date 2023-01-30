export const MAILTO_URL_REGEXP = /^mailto:([^?]*)(?:\?subject=(.*)?)?/
export const PHONE_URL_REGEXP = /^tel:(.*)/
export const WHATSAPP_LINK_PREFIX = `https://api.whatsapp.com/send?phone=`
export const isPhoneUrl = (url: string) => PHONE_URL_REGEXP.test(url)
export const isWhatsappLink = (url: string) => url.startsWith(WHATSAPP_LINK_PREFIX)
export const isMailtoUrl = (url: string) => MAILTO_URL_REGEXP.test(url)
