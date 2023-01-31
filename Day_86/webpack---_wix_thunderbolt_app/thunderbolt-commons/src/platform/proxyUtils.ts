export const createProxy = <T>(memberFactory: (member: string) => T) =>
	new Proxy({}, { get: (__, member) => memberFactory(member as string) })
