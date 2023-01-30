import _ from 'lodash'

const SINGLE_COMP_FUNCTIN = {
	scrollTo: true,
}

function getDescriptorRecursively(object: Record<string, any> | undefined, property: string): PropertyDescriptor | undefined {
	if (_.isUndefined(object)) {
		return undefined
	}
	const descriptor = Object.getOwnPropertyDescriptor(object, property)
	return descriptor || getDescriptorRecursively(Object.getPrototypeOf(object), property)
}

function isPropertyFunction(object: Record<string, any> | undefined, property: string) {
	const descriptor = getDescriptorRecursively(object, property)
	return descriptor && _.isFunction(descriptor.value)
}

function getBatchedResultsFor(batch: Instances, property: string, argumentsForProperty: Array<any>) {
	const first = _.first(batch)
	if (!first) {
		return
	}
	if (_.get(SINGLE_COMP_FUNCTIN, property)) {
		// why is this really needed?
		return first[property](...argumentsForProperty)
	}
	return _.map(batch, (batchItem) => batchItem[property](...argumentsForProperty))
}

const defineBatchFunctionWithMultipleResults = (instances: Instances, property: string) =>
	function batchFunction(...args: Array<any>) {
		return getBatchedResultsFor(instances, property, args)
	}

const defineBatchFunction = (instances: Instances, property: string) =>
	function batchFunction(...args: Array<any>) {
		return _.first(getBatchedResultsFor(instances, property, args))
	}

const setterFunctionFor = (instances: Instances, property: string) => (value: any) => {
	instances.forEach((batchItem) => {
		batchItem[property] = value
	})
}

function getterFunctionFor(instances: Instances, property: string) {
	if (property === 'style') {
		const allStyles = _.without(
			_.map(instances, (component) => component.style),
			undefined
		)
		const targetObject = createCommonAPIs(allStyles, {})
		return () => targetObject
	}

	return () => _.first(instances)![property]
}

const defineGetterSetterFor = (instances: Instances, property: string, descriptor: PropertyDescriptor) => {
	const desc: Partial<Pick<PropertyDescriptor, 'get' | 'set'>> = {}
	if (descriptor.get) {
		desc.get = getterFunctionFor(instances, property)
	}
	if (descriptor.set) {
		desc.set = setterFunctionFor(instances, property)
	}
	return desc
}

const defineGetterSetter = (instances: Instances, batchItem: Record<string, any> | undefined, property: string) => {
	const descriptor = getDescriptorRecursively(batchItem, property)
	return descriptor ? defineGetterSetterFor(instances, property, descriptor) : undefined
}

const createInstancesCommonAPI = (instances: Instances, propertiesToAssign: Array<string>) => {
	const batchItem = _.first(instances)
	return propertiesToAssign.map((prop) => {
		let impl: PropertyDescriptor | Function | undefined
		if (prop === 'toJSON') {
			impl = defineBatchFunctionWithMultipleResults(instances, prop)
		} else if (isPropertyFunction(batchItem, prop)) {
			impl = defineBatchFunction(instances, prop)
		} else {
			impl = defineGetterSetter(instances, batchItem, prop)
		}
		return {
			key: prop,
			impl,
		}
	})
}

const createCommonAPIs = (instances: Instances, target: any) => {
	const propertiesPerInstance = instances.map(Object.keys)
	const propertiesToAssign = _.intersection(...propertiesPerInstance)
	const instancesCommonAPI = createInstancesCommonAPI(instances, propertiesToAssign)
	instancesCommonAPI.forEach(({ key, impl }) => {
		if (!impl) {
			return
		}
		if (typeof impl === 'function') {
			target[key] = impl
		} else {
			Object.defineProperty(target, key, impl)
		}
	})
	return target
}

type Instances = Array<Record<string, any>>

export type InstancesObject = Instances & Record<string, any>

export default function instancesObjectFactory(instances: Instances): InstancesObject {
	return instances.length > 0 ? createCommonAPIs(instances, [...instances]) : []
}
