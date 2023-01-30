export type CompAction = Function
export type ActionProps = Record<string, CompAction>
export type EventActionOptions = { addCompId: boolean }

type TComponentEvents<T> = { [K in keyof T]: Function }

export type CompEventsRegistrarSubscriber = (compId: string, newActions: ActionProps) => void
export interface ICompEventsRegistrar {
	register: <T extends TComponentEvents<T>>(
		compId: string,
		eventName: keyof T,
		compAction: T[keyof T],
		options?: EventActionOptions
	) => Function
	unregister: (compId: string, eventName: string, compAction: CompAction) => void
	subscribeToChanges: (callback: CompEventsRegistrarSubscriber) => void
}

export const CompEventsRegistrarSym = Symbol.for('CompEventsRegistrar')
