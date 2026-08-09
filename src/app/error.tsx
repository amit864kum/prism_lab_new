'use client'

import { useEffect } from 'react'
import { Database, RefreshCw, ServerOff, WifiOff } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Captured application error', { digest: error.digest })
  }, [error.digest])

  const isMongoConnectionError = 
    error.message?.includes('MongooseServerSelectionError') || 
    error.message?.includes('MongoNetworkError') ||
    error.message?.includes('Could not connect to any servers')

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6 selection:bg-blue-600/30">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl md:p-12 shadow-2xl">
        {/* Decorative Gradients */}
        <div className="absolute -left-12 -top-12 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          {/* Header Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 border border-slate-700 text-blue-500 shadow-inner">
            {isMongoConnectionError ? (
              <ServerOff className="h-8 w-8 text-rose-500" />
            ) : (
              <WifiOff className="h-8 w-8" />
            )}
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              {isMongoConnectionError ? 'Database Connection Failed' : 'Something Went Wrong'}
            </h1>
            <p className="text-slate-400 max-w-md text-sm md:text-base leading-relaxed">
              The request could not be completed. Retry the operation, and contact the site administrator if the problem continues.
            </p>
          </div>

          {/* Details / Diagnostics */}
          <div className="w-full text-left bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Troubleshooting Checklist
            </h2>
            <ul className="text-xs md:text-sm text-slate-300 space-y-3">
              {isMongoConnectionError ? (
                <>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs">1</span>
                    <div>
                      <strong className="text-slate-200">Verify network access:</strong> Ensure only the application server&apos;s trusted address is allowed by the database network policy.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs">2</span>
                    <div>
                      <strong className="text-slate-200">Check MongoDB URI config:</strong> Verify the connection string configured in <code className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-blue-400">.env.local</code> matches your database coordinates.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs">3</span>
                    <div>
                      <strong className="text-slate-200">Local Database:</strong> If running a local database, verify your mongod process is running and accessible at port 27017.
                    </div>
                  </li>
                </>
              ) : (
                <li className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 font-bold text-xs">!</span>
                  <div>
                    <span className="text-slate-200">Reference:</span> <code className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-rose-400">{error.digest || 'unavailable'}</code>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-98"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Connection
            </button>
            <a
              href="https://www.mongodb.com/docs/atlas/security-whitelist/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold transition"
            >
              <Database className="h-4 w-4 text-blue-400" />
              View Atlas Security Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
