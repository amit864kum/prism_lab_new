export function compareOptionalNumbers(left?: number, right?: number): number {
  return (left ?? Number.MAX_SAFE_INTEGER) - (right ?? Number.MAX_SAFE_INTEGER)
}
