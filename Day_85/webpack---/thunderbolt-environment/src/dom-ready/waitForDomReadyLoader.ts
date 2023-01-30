import { DomReadySymbol } from '@wix/thunderbolt-symbols'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../types/Environment'

export const site = ({ waitForDomReady }: Environment): ContainerModuleLoader => (bind) => {
	bind(DomReadySymbol).toConstantValue(waitForDomReady?.() || Promise.resolve())
}
