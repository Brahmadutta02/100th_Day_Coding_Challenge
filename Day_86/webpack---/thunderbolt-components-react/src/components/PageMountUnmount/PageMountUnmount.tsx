import React, { Fragment, ComponentType, ReactNode, useEffect, useLayoutEffect } from 'react'

const useIsomorphicLayoutEffect = process.env.browser ? useLayoutEffect : () => {}

export type PageMountUnmountProps = {
	children: () => ReactNode
	pageDidMount: (isMounted: boolean) => void
	codeEmbedsCallback?: Function
}

const PageMountUnmount: ComponentType<PageMountUnmountProps> = ({
	children,
	pageDidMount = () => {},
	codeEmbedsCallback,
}) => {
	useEffect(() => {
		pageDidMount(true)
		return () => pageDidMount(false)
	}, [pageDidMount])

	useIsomorphicLayoutEffect(() => codeEmbedsCallback?.())

	return <Fragment>{children()}</Fragment>
}

export default PageMountUnmount
