import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { OoiTpaSharedConfig } from './ooiTpaSharedConfig'
import { OoiTpaSharedConfigSymbol } from './symbols'

export const page: ContainerModuleLoader = (bind) => {
	bind(OoiTpaSharedConfigSymbol).to(OoiTpaSharedConfig)
}

export const editorPage: ContainerModuleLoader = page

export { OoiTpaSharedConfigSymbol }
export * from './types'
