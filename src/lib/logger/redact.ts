const SENSITIVE_KEYS = /password|passwordHash|token|authorization|cookie|secret|credential|email|phone/i

function safeError(error: Error) {
  return {
    name: error.name,
    message: error.message.slice(0, 500),
    ...(process.env.NODE_ENV !== 'production' && error.stack
      ? { stack: error.stack.split('\n').slice(0, 8).join('\n') }
      : {}),
  }
}

export function redactLogValue(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[MAX_DEPTH]'
  if (value instanceof Error) return safeError(value)
  if (Array.isArray(value)) return value.slice(0, 25).map((item) => redactLogValue(item, depth + 1))
  if (!value || typeof value !== 'object') {
    return typeof value === 'string' && value.length > 1000 ? `${value.slice(0, 1000)}…` : value
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      SENSITIVE_KEYS.test(key) ? '[REDACTED]' : redactLogValue(item, depth + 1),
    ])
  )
}
