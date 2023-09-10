export default function assertIsDefined<T>(
  val: T
): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw Error("Expected 'val' to be defined but received " + val);
  }
}
