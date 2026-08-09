export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return `${text.substring(0, length).trim()}...`
}

export function stripHtml(text = ''): string {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
