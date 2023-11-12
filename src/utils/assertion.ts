export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export function assert(condition?: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message || `'${condition}' is not Truthy`);
  }
}

export function assertIsString(value: unknown, message?: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new AssertionError(message || `'${value}' is not a string.`);
  }
}

export function assertIsNumber(value: unknown, message?: string): asserts value is number {
  if (typeof value !== 'number') {
    throw new AssertionError(message || `'${value}' is not a number.`);
  }
}

export function assertIsDefined<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value == null) {
    throw new AssertionError(message || 'Value is null');
  }
}
