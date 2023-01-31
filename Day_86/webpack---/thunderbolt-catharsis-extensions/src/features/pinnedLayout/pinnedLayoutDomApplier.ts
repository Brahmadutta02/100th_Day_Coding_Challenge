import { DomApplier } from '../cssFeatures.types'

export const pinnedLayoutDomApplier: DomApplier<'pinnedLayout'> = (__, ___, ____, { pinnedStyle }) =>
	pinnedStyle && 'type' in pinnedStyle ? pinnedStyle.selectorObj : {}
