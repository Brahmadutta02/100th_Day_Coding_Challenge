import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { CaptchaApiSymbol } from '@wix/thunderbolt-symbols'
import { Captcha } from './captcha'

export const site: ContainerModuleLoader = (bind) => {
	bind(CaptchaApiSymbol).to(Captcha)
}

export * from './symbols'
export * from './types'
