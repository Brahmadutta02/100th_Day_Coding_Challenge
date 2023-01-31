export const fixViewport = () => {
	const viewport = document.getElementById('wixMobileViewport')
	const setViewport = (scale?: number) =>
		viewport!.setAttribute('content', `width=320, user-scalable=yes${scale ? ` initial-scale=${scale}` : ''}`)
	setViewport(0)
	window.requestAnimationFrame(() => {
		setViewport(window.screen.width / 320)
		window.requestAnimationFrame(() => {
			setViewport()
		})
	})
}
