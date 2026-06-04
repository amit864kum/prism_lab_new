import PIProfile from '@/models/PIProfile'
import Member from '@/models/Member'

/**
 * Validates a publication input:
 * 1. Checks if the Principal Investigator is listed in the author names (case-insensitive).
 * 2. Maps the author names (strings) to Member IDs for existing lab members (case-insensitive).
 * 
 * @param authorNames Array of author name strings
 */
export async function validatePublication(authorNames: string[]) {
  // 1. Fetch PI Profile to get their name
  const pi = await PIProfile.findOne()
  const piName = pi ? pi.name.trim().toLowerCase() : 'amit kumar' // Fallback to PRD default

  // Check if the PI's name matches one of the author names
  const hasPI = authorNames.some(
    (name) =>
      name.toLowerCase().includes(piName) ||
      piName.includes(name.toLowerCase())
  )

  if (!hasPI) {
    return {
      success: false,
      code: 'PI_REQUIRED',
      error: `The Principal Investigator (${pi ? pi.name : 'Amit Kumar'}) must be one of the authors.`,
    }
  }

  // 2. Match author names to Member IDs (case-insensitive)
  const linkedMemberIds: string[] = []
  for (const name of authorNames) {
    const member = await Member.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    })
    if (member) {
      linkedMemberIds.push(member._id.toString())
    }
  }

  return {
    success: true,
    memberIds: linkedMemberIds,
  }
}
