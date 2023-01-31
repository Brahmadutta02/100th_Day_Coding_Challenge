import { withDependencies } from '@wix/thunderbolt-ioc'
import { CompEventsRegistrarSym, ICompEventsRegistrar } from '@wix/thunderbolt-symbols'
import { EventsTrait, TraitProvider } from '../types'

const eventsTrait = (compEventsRegistrar: ICompEventsRegistrar): TraitProvider<EventsTrait> => {
	return (compId) => {
		return {
			onClick: (fn) => compEventsRegistrar.register(compId, 'onClick', fn),
			onMouseEnter: (fn) => compEventsRegistrar.register(compId, 'onMouseEnter', fn),
			onMouseLeave: (fn) => compEventsRegistrar.register(compId, 'onMouseLeave', fn),
			onChange: (fn) => compEventsRegistrar.register(compId, 'onChange', fn),
			onKeyDown: (fn) => compEventsRegistrar.register(compId, 'onKeyDown', fn),
		}
	}
}

export const EventsTraitFactory = withDependencies([CompEventsRegistrarSym], eventsTrait)
