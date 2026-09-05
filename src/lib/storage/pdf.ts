import { PDFDocument, PDFName } from 'pdf-lib'

const ACTIVE_PDF_TOKENS = ['/javascript', '/js', '/launch', '/embeddedfile', '/openaction', '/aa', '/richmedia', '/xfa']

export async function prepareSafePdf(buffer: Buffer): Promise<Buffer | null> {
  if (buffer.length < 8 || buffer.subarray(0, 5).toString('ascii') !== '%PDF-') return null
  if (!buffer.subarray(Math.max(0, buffer.length - 2048)).includes(Buffer.from('%%EOF'))) return null

  const sourceText = buffer.toString('latin1').toLowerCase()
  if (ACTIVE_PDF_TOKENS.some((token) => sourceText.includes(token))) return null

  try {
    const source = await PDFDocument.load(buffer, {
      ignoreEncryption: false,
      throwOnInvalidObject: true,
      updateMetadata: false,
    })
    if (source.isEncrypted || source.getPageCount() === 0 || source.getPageCount() > 500) return null

    const sanitized = await PDFDocument.create()
    const pages = await sanitized.copyPages(source, source.getPageIndices())
    for (const page of pages) {
      page.node.delete(PDFName.of('AA'))
      page.node.delete(PDFName.of('Annots'))
      sanitized.addPage(page)
    }
    return Buffer.from(await sanitized.save({ useObjectStreams: false }))
  } catch {
    return null
  }
}
