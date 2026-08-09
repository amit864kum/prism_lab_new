/**
 * Compression is deliberately disabled until image dimensions and visual output
 * can be regression-tested. This boundary allows a verified processor to be
 * introduced later without changing storage callers.
 */
export async function prepareImageForStorage(buffer: Buffer) {
  return buffer
}
