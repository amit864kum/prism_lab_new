import PIProfile from '@/models/PIProfile'
import Member from '@/models/Member'

// These reads intentionally do not initialize a connection. The validation
// helper is invoked inside already-connected workflows and remains unit-testable
// with model doubles, matching its pre-refactor behavior.
export async function getPIForPublicationValidation() {
  const profile = await PIProfile.findOne()
  return profile && typeof profile.toObject === 'function' ? profile.toObject() : profile
}

export async function getMemberByExactNameForPublicationValidation(name: string) {
  const member = await Member.findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
  })
  return member && typeof member.toObject === 'function' ? member.toObject() : member
}
