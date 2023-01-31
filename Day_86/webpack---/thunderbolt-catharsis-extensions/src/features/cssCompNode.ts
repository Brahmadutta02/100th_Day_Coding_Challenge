import { createCompNode } from '@wix/thunderbolt-catharsis'
import { TypedCompNodeFactory } from './cssFeatures.types'

const createCssCompNode: TypedCompNodeFactory = (feature, nodeName, obj) => createCompNode(obj)

export { createCssCompNode }
