import type { CompRef, CompRefPromise } from './types'

export type AddCompRefById = (compId: string, compRef: CompRef) => void
export type GetCompRefById = (compId: string) => CompRefPromise
export type CompRefAPI = {
	getCompRefById: GetCompRefById
}

export const CompRefAPISym = Symbol.for('GetCompRefById')

export interface ICyclicTabbing {
	enableCyclicTabbing(cyclicTabbingParentCompIds: Array<string> | string): void
	disableCyclicTabbing(cyclicTabbingParentCompIds: Array<string> | string): void
}
