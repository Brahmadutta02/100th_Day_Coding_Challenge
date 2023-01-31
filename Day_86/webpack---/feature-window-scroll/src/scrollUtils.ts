import { unzip } from 'lodash'

// copied from https://github.com/wix-private/santa-core/blob/c31a6e6a261566d3bfbfc049e5f6489911f9f106/santa-core-utils/src/coreUtils/core/scrollUtils.js#L20

function map(value: number, x1: number, x2: number, y1: number, y2: number) {
	return (value - x1) * ((y2 - y1) / (x2 - x1)) + y1
}

function interpolateSegmentsFunction(couples: Array<Array<number>>) {
	const xys = unzip(couples)
	const xs = xys[0]
	const ys = xys[1]

	return function (val: number) {
		let seg = 0

		while (seg < xs.length - 2 && val > xs[seg + 1]) {
			seg++
		}

		return map(val, xs[seg], xs[seg + 1], ys[seg], ys[seg + 1])
	}
}

let scrollDurationByDistance: { desktop: (val: number) => number; mobile: (val: number) => number } | null = null

const MOBILE = 'mobile' as const
const DESKTOP = 'desktop' as const

export function calcScrollDuration(currentY: number, targetY: number, isMobile: boolean) {
	scrollDurationByDistance = scrollDurationByDistance || {
		desktop: interpolateSegmentsFunction([
			[0, 0.6],
			[360, 0.8],
			[720, 1],
			[1440, 1.2],
			[7200, 2.8],
			[9600, 3],
			[10000, 3],
		]),
		mobile: interpolateSegmentsFunction([
			[0, 0.5],
			[360, 0.7],
			[720, 0.9],
			[1440, 1.1],
			[7200, 2.7],
			[9600, 2.9],
			[10000, 2.9],
		]),
	}
	const delta = Math.abs(targetY - currentY)
	const mode = isMobile ? MOBILE : DESKTOP
	return scrollDurationByDistance[mode](delta)
}
