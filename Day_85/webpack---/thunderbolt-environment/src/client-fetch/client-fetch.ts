import { Fetch } from '@wix/thunderbolt-symbols'
import type { ContainerModuleLoader } from '@wix/thunderbolt-ioc'
import { Environment } from '../types/Environment'

export const site = ({ fetchApi }: Environment): ContainerModuleLoader => (bind) => {
	bind(Fetch).toConstantValue(fetchApi)
}
