'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'

interface Member {
  _id: string
  slug: string
  name: string
  role: string
  imageUrl?: string
}

export default function MembersCarousel({ members }: { members: Member[] }) {
  if (members.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
      {members.map((member) => (
        <motion.div
          key={member._id}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center p-6 text-center"
        >
          {/* Profile Picture */}
          <div className="h-28 w-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-950 border-2 border-blue-500/20 group-hover:border-blue-500/80 transition-colors duration-300 flex-shrink-0 flex items-center justify-center relative mb-4">
            {member.imageUrl ? (
              <SafeImage
                src={member.imageUrl}
                alt={member.name}
                className="h-full w-full object-cover"
                fallback={<Users className="h-12 w-12 text-slate-400" />}
              />
            ) : (
              <Users className="h-12 w-12 text-slate-400" />
            )}
          </div>

          {/* Details */}
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base truncate w-full">
            {member.name}
          </h3>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
            {member.role}
          </p>

          <Link
            href={`/people/current-members/${member.slug}`}
            className="mt-4 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline"
          >
            View Profile &rarr;
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
