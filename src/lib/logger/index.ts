import { redactLogValue } from './redact'

type LogLevel = 'info' | 'warn' | 'error'
type LogChannel = 'app' | 'api' | 'upload' | 'error'
type LogContext = Record<string, unknown>

function emit(level: LogLevel, channel: LogChannel, message: string, context: LogContext = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    channel,
    message,
    ...redactLogValue(context) as Record<string, unknown>,
  })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.info(entry)
}

function createLogger(channel: LogChannel) {
  return {
    info: (message: string, context?: LogContext) => emit('info', channel, message, context),
    warn: (message: string, context?: LogContext) => emit('warn', channel, message, context),
    error: (message: string, context?: LogContext) => emit('error', channel, message, context),
  }
}

export const appLogger = createLogger('app')
export const apiLogger = createLogger('api')
export const uploadLogger = createLogger('upload')
export const errorLogger = createLogger('error')
