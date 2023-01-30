import type { MultipleComponentsLifecycle } from './types'

export const groupByMultipleComponentTypes = <T extends MultipleComponentsLifecycle>(array: Array<T>) => {
	return array.reduce<{ [componentType: string]: Array<T> }>((acc, x) => {
		x.componentTypes.forEach((componentType) => {
			acc[componentType] = acc[componentType] || []
			acc[componentType].push(x)
		})
		return acc
	}, {})
}
