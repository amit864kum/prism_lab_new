import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import { MEMBER_ROLES } from '@/lib/member-options'

async function main() {
  await connectDB()

  let updatedCount = 0

  for (const role of MEMBER_ROLES) {
    const members = await Member.find({ role }).sort({ displayOrder: 1, yearJoined: -1, name: 1 })

    for (let index = 0; index < members.length; index += 1) {
      const displayOrder = index + 1
      const member = members[index]

      if (!member.displayOrder || member.displayOrder !== displayOrder) {
        member.displayOrder = displayOrder
        await member.save()
        updatedCount += 1
      }
    }
  }

  console.log(`Migrated display order for ${updatedCount} member record(s).`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Member migration failed:', error)
    process.exit(1)
  })
