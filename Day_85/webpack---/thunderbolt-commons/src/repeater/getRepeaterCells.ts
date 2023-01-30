import type { CellsMapType, IdIndexMapType } from './index'

type OffsetTopMapType = Record<number, Array<HTMLElement>>

const createOffsetTopMap = (items: Array<string>, repeater: HTMLElement) => {
	const offsetTopMap: OffsetTopMapType = {}

	items.forEach((itemId) => {
		const cell: HTMLElement | null = repeater.querySelector(`[id$="${itemId}"]`)
		if (!cell) {
			return
		}
		if (!offsetTopMap[cell.offsetTop]) {
			offsetTopMap[cell.offsetTop] = []
		}
		offsetTopMap[cell.offsetTop].push(cell)
	})

	return offsetTopMap
}

const createCellMap = (offsetTopMap: OffsetTopMapType) => {
	const cellsMap: CellsMapType = []

	Object.keys(offsetTopMap)
		.map((key) => Number(key))
		.sort((a, b) => (a < b ? -1 : 1))
		.forEach((offsetTop, index) => {
			cellsMap[index] = offsetTopMap[offsetTop]
		})

	cellsMap.forEach((row) => {
		row.sort((a, b) => (a.offsetLeft < b.offsetLeft ? -1 : 1))
	})

	return cellsMap
}

const createIndexMap = (cellsMap: CellsMapType) => {
	const idIndexMap: IdIndexMapType = {}

	cellsMap.forEach((cellRow, rowIndex) => {
		cellRow.forEach((cell, columnIndex) => {
			idIndexMap[cell.id] = { row: rowIndex, column: columnIndex }
		})
	})

	return idIndexMap
}

export const getRepeaterCells = (items: Array<string>, repeater: HTMLElement) => {
	const offsetTopMap = createOffsetTopMap(items, repeater)
	const cellsMap = createCellMap(offsetTopMap)
	const idIndexMap = createIndexMap(cellsMap)

	return { cellsMap, idIndexMap }
}
