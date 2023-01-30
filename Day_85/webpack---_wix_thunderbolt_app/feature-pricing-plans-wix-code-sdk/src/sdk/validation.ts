const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function validateGuid(id: string) {
	if (!uuidV4Regex.test(id)) {
		throw new Error(`Invalid guid: ${id}`)
	}
}
