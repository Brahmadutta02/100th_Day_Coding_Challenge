import React, { ComponentType, ReactNode } from 'react'

export type DivWithChildrenCompProps = {
	children: () => ReactNode
	id: string
	className: string
}

const DivWithChildren: ComponentType<DivWithChildrenCompProps> = ({ children, id, className }) => {
	return (
		<div id={id} className={className}>
			{children()}
		</div>
	)
}

export default DivWithChildren
