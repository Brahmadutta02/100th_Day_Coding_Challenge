export { getRepeaterCells } from './getRepeaterCells'
export { getNextCell } from './getNextCell'

export const supportedKeyboardKeys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

export type IdIndexMapType = Record<string, { row: number; column: number }>
export type CellsMapType = Array<Array<HTMLElement>>
