import sharp from 'sharp'
import { MAX_IMAGE_DIMENSION, MAX_IMAGE_PIXELS } from '@/constants/upload'

export async function prepareImageForStorage(buffer: Buffer, extension: string) {
  const image = sharp(buffer, {
    failOn: 'error',
    limitInputPixels: MAX_IMAGE_PIXELS,
    animated: false,
  })
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height || (metadata.pages ?? 1) !== 1) {
    throw new Error('Image dimensions or frame count are invalid')
  }

  const normalized = image.rotate().resize({
    width: MAX_IMAGE_DIMENSION,
    height: MAX_IMAGE_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  })

  if (extension === 'png') return normalized.png({ compressionLevel: 9 }).toBuffer()
  if (extension === 'webp') return normalized.webp({ quality: 85 }).toBuffer()
  return normalized.jpeg({ quality: 85, mozjpeg: true }).toBuffer()
}
