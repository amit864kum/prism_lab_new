import { setServers } from 'node:dns'
import { getServerEnvironment } from './env'

let dnsConfigured = false

export function configureMongoDns() {
  if (dnsConfigured) return
  dnsConfigured = true

  const configuredServers = getServerEnvironment().MONGODB_DNS_SERVERS
  if (!configuredServers) return

  const servers = configuredServers.split(',').map((server) => server.trim()).filter(Boolean)
  if (servers.length === 0) throw new Error('MONGODB_DNS_SERVERS must contain at least one DNS server')
  setServers(servers)
}

export function getMongoConnectionUri() {
  return getServerEnvironment().MONGODB_URI
}
