import mongoose from 'mongoose'
import Admin from '../models/Admin'
import { hashPassword } from '../lib/auth'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function initAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI!
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@iitp.ac.in'
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local')
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
    console.log('Password:', ADMIN_PASSWORD)
    console.log('\nPlease change the default password after first login.')
  } catch (error) {
    console.error('Error initializing admin:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

initAdmin()
