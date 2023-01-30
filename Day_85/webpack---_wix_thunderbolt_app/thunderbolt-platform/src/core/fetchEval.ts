export const fetchEval = async (fileUrl: string, { beforeEval, afterEval }: { beforeEval?: Function; afterEval?: Function } = {}) => {
	const res = await self.fetch(fileUrl)
	const code = await res.text()
	beforeEval?.()
	try {
		eval.call(null, `${code}\n//# sourceURL=${fileUrl}`) // eslint-disable-line no-eval
	} finally {
		afterEval?.()
	}
}
