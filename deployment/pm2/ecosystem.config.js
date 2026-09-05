const path = require('path')

const appDirectory = process.env.PRISM_APP_DIR || path.resolve(__dirname, '..', '..')
const logsDirectory = process.env.LOGS_ROOT || path.join(appDirectory, 'logs')
const port = process.env.PORT || '3000'
const bindAddress = process.env.PRISM_BIND_ADDRESS || '127.0.0.1'

module.exports = {
  apps: [
    {
      name: 'prism-lab',
      cwd: appDirectory,
      script: path.join(appDirectory, 'node_modules', 'next', 'dist', 'bin', 'next'),
      args: `start -p ${port} --hostname ${bindAddress}`,
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '768M',
      kill_timeout: 10000,
      listen_timeout: 15000,
      time: true,
      merge_logs: true,
      out_file: path.join(logsDirectory, 'application.log'),
      error_file: path.join(logsDirectory, 'error.log'),
      env: {
        NODE_ENV: 'production',
        PORT: port,
        PRISM_BIND_ADDRESS: bindAddress,
      },
    },
  ],
}
