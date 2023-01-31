import { createLoaders } from './loader'
import PlatformWorkerInitializer from './client/platformWorkerInitializer'

export const { site } = createLoaders(PlatformWorkerInitializer)

export * from './types'
