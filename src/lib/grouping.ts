import type { IMember, MemberGroup } from '@/types/member'

export type { MemberGroup } from '@/types/member'

/**
 * Groups members based on role, status, and year joined:
 * 1. PhD Scholars are grouped together without year grouping.
 * 2. Masters, Undergraduate, and Research Assistants are grouped by join year (descending).
 * 3. Inside each year group, members are sub-grouped by status ('current' -> ongoing, 'alumni' -> completed).
 */
export function groupMembers(members: IMember[]): MemberGroup {
  // Filter PhD Scholars
  const phdScholars = members
    .filter((m) => m.role === 'PhD Scholar')
    .sort((a, b) => (a.yearJoined || 0) - (b.yearJoined || 0)) // Sort oldest first (custom order fallback)

  const others = members.filter((m) => m.role !== 'PhD Scholar')

  const yearsMap: { [key: number]: { ongoing: IMember[]; completed: IMember[] } } = {}
  const unspecifiedYear: { ongoing: IMember[]; completed: IMember[] } = { ongoing: [], completed: [] }

  others.forEach((m) => {
    const year = m.yearJoined
    const targetGroup = m.status === 'current' ? 'ongoing' : 'completed'
    if (year) {
      if (!yearsMap[year]) {
        yearsMap[year] = { ongoing: [], completed: [] }
      }
      yearsMap[year][targetGroup].push(m)
    } else {
      unspecifiedYear[targetGroup].push(m)
    }
  })

  // Sort years in descending order
  const otherScholarsByYear = Object.keys(yearsMap)
    .map(Number)
    .sort((a, b) => b - a)
    .map((year) => ({
      year,
      ongoing: yearsMap[year].ongoing,
      completed: yearsMap[year].completed,
    }))

  return {
    phdScholars,
    otherScholarsByYear,
    unspecifiedYear,
  }
}
