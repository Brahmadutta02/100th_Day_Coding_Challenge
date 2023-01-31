export function flow<T>(...fns: Array<(value: T) => T>) {
  return (value: T) => fns.reduce((output, fn) => fn(output), value);
}
