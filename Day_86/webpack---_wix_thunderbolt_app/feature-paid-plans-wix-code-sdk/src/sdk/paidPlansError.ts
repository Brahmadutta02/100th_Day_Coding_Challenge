export class PaidPlansError extends Error {
	constructor(public status: number, message: string) {
		super(message)
	}
}
