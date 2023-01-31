import { createCssCompNode } from '../cssCompNode'
import { createCompNode } from '@wix/thunderbolt-catharsis'
import { withModes } from '../modesCompNode'

const OVERRIDEN_PROPS = ['layout' as const]

const rotation = createCompNode({
	getDependencies: () => null,
	toViewItem: ({ layout: { rotationInDegrees } }) =>
		rotationInDegrees ? { transform: `rotate(${rotationInDegrees}deg)` } : null,
})

export const classicRotation = createCssCompNode(
	'classicRotation',
	'classicRotation',
	withModes(rotation, OVERRIDEN_PROPS)
)
