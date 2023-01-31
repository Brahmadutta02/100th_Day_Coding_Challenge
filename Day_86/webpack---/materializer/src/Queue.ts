export class Queue<T> {
	queue: Array<T>
	enqueueIndex: number = 0
	dequeueIndex: number = 0
	initialQueueSize: number = 0

	constructor(initialQueueSize: number) {
		this.queue = new Array(initialQueueSize)
		this.initialQueueSize = initialQueueSize
	}

	enqueue(item: T) {
		this.enqueueIndex < this.initialQueueSize
			? (this.queue[this.enqueueIndex++] = item)
			: ++this.enqueueIndex && this.queue.push(item)
	}

	dequeue() {
		const item = this.queue[this.dequeueIndex++]
		if (this.dequeueIndex === this.enqueueIndex) {
			this.enqueueIndex = 0
			this.dequeueIndex = 0
		}
		return item
	}

	isEmpty() {
		return this.enqueueIndex === 0
	}
}
