import type { CellsMapType, IdIndexMapType } from './index'

export const getNextCell = (cellsMap: CellsMapType, idIndexMap: IdIndexMapType, id: string, key: string) => {
	const lastRowIndex = cellsMap.length - 1
	const lastColumnIndex = cellsMap[lastRowIndex].length - 1
	const { row, column } = idIndexMap[id]

	const nextStateByKey: Record<string, [number, number]> = {
		ArrowDown: [row + 1, column],
		ArrowUp: [row - 1, column],
		ArrowRight: [row, column + 1],
		ArrowLeft: [row, column - 1],
		Home: [0, 0],
		End: [lastRowIndex, lastColumnIndex],
	}

	const [nextRow, nextColumn] = nextStateByKey[key]

	return cellsMap[nextRow]?.[nextColumn]
}
