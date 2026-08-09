import mongoose from 'mongoose'
import Admin from '../src/models/Admin'
import { hashPassword } from '../src/lib/auth-node'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function initAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI!
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local')
    }
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required for administrator initialization')
    }
    if (ADMIN_PASSWORD.length < 12) {
      throw new Error('ADMIN_PASSWORD must contain at least 12 characters')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL })

    if (existingAdmin) {
      console.log('Admin user already exists with email:', ADMIN_EMAIL)
      return
    }

    // Create new admin
    const passwordHash = await hashPassword(ADMIN_PASSWORD)
    const admin = await Admin.create({
      email: ADMIN_EMAIL,
      passwordHash,
      name: 'Admin',
    })

    console.log('Admin user created successfully!')
    console.log('Email:', admin.email)
    console.log('The configured password was not written to logs.')
  } catch (error) {
    console.error('Error initializing admin:', error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

initAdmin()
