import { ExperimentsSymbol } from '@wix/thunderbolt-symbols'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../types/Environment'

export const site = ({ experiments }: Environment): ContainerModuleLoader => (bind) => {
	bind(ExperimentsSymbol).toConstantValue(experiments)
}
