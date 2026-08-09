import { loadEnvConfig } from '@next/env'
import { MongoClient } from "mongodb";
import { setServers } from 'node:dns'

loadEnvConfig(process.cwd())

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('MONGODB_URI is required')
}
const mongoUri = uri

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean)
if (dnsServers?.length) setServers(dnsServers)

async function run() {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    console.log("✅ Authenticated and connected to MongoDB Atlas");

    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(d => d.name));
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
