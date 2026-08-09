export function includesSearchTerm(value: string, searchTerm: string): boolean {
  return value.toLocaleLowerCase().includes(searchTerm.trim().toLocaleLowerCase())
}
