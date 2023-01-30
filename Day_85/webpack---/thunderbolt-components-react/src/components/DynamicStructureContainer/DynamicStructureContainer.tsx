import React, { ComponentType, ReactNode, Fragment } from 'react'

export type DynamicStructureContainerCompProps = {
	children: () => ReactNode
}

const DynamicStructureContainer: ComponentType<DynamicStructureContainerCompProps> = ({ children }) => {
	return <Fragment>{children()}</Fragment>
}

export default DynamicStructureContainer
