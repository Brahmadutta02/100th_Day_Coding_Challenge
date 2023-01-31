import React, { ReactNode, useImperativeHandle, useState } from 'react'
import { RendererProps } from '../types'
import { AppContextRef } from '@wix/thunderbolt-symbols'

const Context = React.createContext<RendererProps>({} as RendererProps)

export const AppContextProvider = React.forwardRef<
	AppContextRef,
	{ initialContextValue: RendererProps; children?: ReactNode }
>(({ initialContextValue, children }, ref) => {
	const [value, setValue] = useState(initialContextValue)

	useImperativeHandle(
		ref,
		() => ({
			updateTranslator: (translate: RendererProps['translate']) =>
				setValue((currentValue) => ({ ...currentValue, translate })),
		}),
		[]
	)
	return <Context.Provider value={value}>{children}</Context.Provider>
})

export default Context
