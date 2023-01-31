import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { RendererPropsExtenderSym, Translate } from '@wix/thunderbolt-symbols'
import { TranslationsImpl, TranslateBinder } from './translations'

export const site: ContainerModuleLoader = (bind) => {
	bind(Translate).to(TranslationsImpl)
	bind(RendererPropsExtenderSym).to(TranslateBinder)
}
