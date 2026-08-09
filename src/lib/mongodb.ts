import mongoose from 'mongoose'
import { configureMongoDns, getMongoConnectionUri } from '@/config/database'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

function isSrvResolverRefusal(error: unknown) {
  if (!error || typeof error !== 'object') return false
  const details = error as { code?: unknown; syscall?: unknown }
  return details.code === 'ECONNREFUSED' && details.syscall === 'querySrv'
}

async function createConnection(connectionUri: string, options: Parameters<typeof mongoose.connect>[1]) {
  try {
    return await mongoose.connect(connectionUri, options)
  } catch (error) {
    if (!isSrvResolverRefusal(error)) throw error

    // Some local DNS proxies briefly refuse Atlas SRV queries as a server
    // worker starts. The configured resolver is already process-wide; retry
    // this narrowly identified lookup failure once before surfacing it.
    await new Promise((resolve) => setTimeout(resolve, 150))
    return mongoose.connect(connectionUri, options)
  }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    configureMongoDns()
    const connectionUri = getMongoConnectionUri()
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast — 5s instead of default 30s
      connectTimeoutMS: 5000,
    }

    cached.promise = createConnection(connectionUri, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
