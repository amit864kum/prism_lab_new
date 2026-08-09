import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
export { formatDate } from '@/utils/date'
export { truncate } from '@/utils/format'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

