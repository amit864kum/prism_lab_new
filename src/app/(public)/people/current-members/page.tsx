import { getPublicMembers } from '@/services/public-content.service'
import CurrentMembersClient from '@/components/members/CurrentMembersClient'
import { toMemberListViewModel } from '@/components/members/member-list.view-model'
import { Users } from 'lucide-react'

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

  const allMembers = [...ongoingMembers, ...completedMembers]

  // Serialize ObjectIds and dates for client component safety
  const serializedMembers = allMembers.map(toMemberListViewModel)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-blue-200">
            <Users className="h-3.5 w-3.5" />
            People at PRISM
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Research Team</h1>
          <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
            Meet our guide, research scholars, graduate researchers, undergraduate developers, and alumni.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <CurrentMembersClient initialMembers={serializedMembers} />
      </div>
    </div>
  )
}
