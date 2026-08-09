const { loadEnvConfig } = require('@next/env')
const { setServers } = require('node:dns')

loadEnvConfig(process.cwd())

const servers = process.env.MONGODB_DNS_SERVERS
  ?.split(',')
  .map((server) => server.trim())
  .filter(Boolean)

if (servers?.length) setServers(servers)
