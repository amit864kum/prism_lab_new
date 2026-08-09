import {
  getMemberByExactNameForPublicationValidation,
  getPIForPublicationValidation,
} from '@/repositories/publication-validation.repository'

/**
 * Ensures the principal investigator is an author and resolves author names to
 * existing lab-member IDs.
 */
export async function validatePublication(authorNames: string[]) {
  const pi = await getPIForPublicationValidation()
  const piName = pi ? pi.name.trim().toLowerCase() : 'amit kumar'

  const hasPI = authorNames.some((name) => {
    const normalizedName = name.trim().toLowerCase()
    return normalizedName.includes(piName) || piName.includes(normalizedName)
  })

  if (!hasPI) {
    return {
      success: false,
      code: 'PI_REQUIRED',
      error: `The Principal Investigator (${pi ? pi.name : 'Amit Kumar'}) must be one of the authors.`,
    }
  }

  const linkedMemberIds: string[] = []
  for (const name of authorNames) {
    const member = await getMemberByExactNameForPublicationValidation(name)
    if (member) linkedMemberIds.push(member._id.toString())
  }

  return { success: true, memberIds: linkedMemberIds }
}
