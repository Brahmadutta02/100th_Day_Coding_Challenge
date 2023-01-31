import { RendererProps } from '../types'
import Context from './AppContext'
import React, { useContext, ComponentType } from 'react'

export const DeletedComp: ComponentType = () => {
	const { BaseComponent }: RendererProps = useContext(Context)
	return (
		<BaseComponent
			style={{
				visibility: 'hidden',
				overflow: 'hidden',
				pointerEvents: 'none',
			}}
		/>
	)
}
