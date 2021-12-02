export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export const toString = (v: unknown) => Object.prototype.toString.call(v)

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {}
