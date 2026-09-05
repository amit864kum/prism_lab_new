declare global {
  var prismTempCleanupTimer: NodeJS.Timeout | undefined
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { configureMongoDns } = await import('./config/database')
  configureMongoDns()

  const { cleanAndMeasureTemporaryStorage } = await import('./lib/storage/upload')
  const { appLogger } = await import('./lib/logger')
  await cleanAndMeasureTemporaryStorage()
  if (!global.prismTempCleanupTimer) {
    global.prismTempCleanupTimer = setInterval(
      () => void cleanAndMeasureTemporaryStorage().catch((error) => {
        appLogger.error('Temporary upload cleanup failed', { error })
      }),
      60 * 60 * 1000
    )
    global.prismTempCleanupTimer.unref()
  }
}
