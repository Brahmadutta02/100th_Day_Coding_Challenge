export const updateCurrentPopup = (comps: Array<string>, currentPopupId?: string) => {
	return comps.reduce(
		(updatedObject: object, compId: string) => ({
			...updatedObject,
			...{
				[compId]: { currentPopupId },
			},
		}),
		{}
	)
}
