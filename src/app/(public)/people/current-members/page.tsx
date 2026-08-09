import { getPublicMembers } from '@/services/public-content.service'
import CurrentMembersClient from '@/components/members/CurrentMembersClient'
import { toMemberListViewModel } from '@/components/members/member-list.view-model'

// Force dynamic rendering to always fetch latest DB data
export const dynamic = 'force-dynamic'

export default async function CurrentMembersPage() {
const ongoingMembers = await getPublicMembers(
  { status: 'current' },
  { sort: { role: 1, displayOrder: 1, yearJoined: -1, name: 1 } }
)

// Fetch completed + alumni members
const completedMembers = await getPublicMembers(
  { statuses: ['completed', 'alumni'] },
  { sort: { yearJoined: -1, name: 1 } }
)

// Combine for serialization
const allMembers = [
  ...ongoingMembers,
  ...completedMembers,
]

  // Serialize ObjectIds and dates for client component safety
  const serializedMembers = allMembers.map(toMemberListViewModel)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* Title Banner */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-20 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">
            Research Team
          </h1>
          <p className="text-sm sm:text-base text-slate-405 max-w-xl font-medium">
            Meet our scholars, graduate researchers, and undergraduate developers working on cutting-edge systems and structures.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <CurrentMembersClient initialMembers={serializedMembers} />
      </div>
    </div>
  )
}
