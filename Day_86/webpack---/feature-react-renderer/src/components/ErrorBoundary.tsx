import React, { Fragment, useContext } from 'react'
import type { ILogger } from '@wix/thunderbolt-symbols'
import type { RendererProps } from '../types'
import Context from './AppContext'

type Props = {
	id: string
	logger: ILogger
	Component?: React.ComponentType<any>
	compClassType: string
	recursiveChildren: (childScopeData?: {
		scopeId: string
		parentType: string
		itemIndex?: number
	}) => Array<JSX.Element>
	sentryDsn?: string
}

type State = {
	hasError: boolean
}

export class MissingCompError extends Error {
	constructor(componentType: string) {
		super(`${componentType} Component is missing from component library`)

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		} else {
			this.stack = new Error(this.message).stack
		}
	}
}

export class MissingCompStructureError extends Error {
	constructor() {
		super(`Component is missing from structure`)

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, this.constructor)
		} else {
			this.stack = new Error(this.message).stack
		}
	}
}

export const DeadComp = ({ id, children }: { id: string; children: React.ReactNode }) => {
	const { BaseComponent }: RendererProps = useContext(Context)
	return (
		<BaseComponent data-dead-comp={true} id={id}>
			{children}
		</BaseComponent>
	)
}

export class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		const { Component, compClassType } = props
		this.state = { hasError: !Component || !compClassType }
		if (!compClassType) {
			this.captureError(new MissingCompStructureError())
		} else if (!Component) {
			this.captureError(new MissingCompError(compClassType))
		}
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	private captureError(error: Error, componentStack: string = '') {
		this.props.logger.captureError(error, {
			tags: {
				componentType: this.props.compClassType,
				compId: this.props.id,
				componentName: 'dead-component',
			},
			extra: { componentStack },
		})
	}

	componentDidCatch(error: Error, { componentStack }: React.ErrorInfo) {
		this.captureError(error, componentStack)
	}

	render() {
		if (this.state.hasError) {
			/* TODO: remove recursiveChildren when we implement all components.
				dead comp shouldn't render it's children - potential bug
			 */
			return <DeadComp id={this.props.id}>{this.props.recursiveChildren()}</DeadComp>
		}

		return <Fragment>{this.props.children}</Fragment>
	}
}
