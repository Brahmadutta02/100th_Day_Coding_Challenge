type MarkType = 'PERMANENT' | 'TEMPORARY'

const MARKS: Record<string, MarkType> = {
	PERMANENT: 'PERMANENT',
	TEMPORARY: 'TEMPORARY',
}

export const toposort = (nodes: Set<string>, deps: Map<string, Set<string>>) => {
	const marks: Map<string, MarkType> = new Map()
	const output: Array<string> = new Array<string>(nodes.size)
	let i = nodes.size

	const visit = (node: string) => {
		const mark = marks.get(node)
		if (mark === MARKS.PERMANENT) {
			return
		}
		if (mark === MARKS.TEMPORARY) {
			throw new Error('Cyclic dependency')
		}
		marks.set(node, MARKS.TEMPORARY)
		if (deps.has(node)) {
			for (const dep of deps.get(node)!) {
				visit(dep)
			}
		}
		marks.set(node, MARKS.PERMANENT)
		--i
		output[i] = node
	}

	for (const node of nodes) {
		visit(node)
	}
	return output
}
