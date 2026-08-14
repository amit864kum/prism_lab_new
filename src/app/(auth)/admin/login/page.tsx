'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import SafeImage from '@/components/ui/SafeImage'
import ThemeToggle from '@/components/layout/ThemeToggle'

const PRISM_EMBLEM = '/images/prism-emblem.png'

export default function LoginPage() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Unable to sign in right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page relative min-h-screen overflow-hidden bg-slate-100 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.22),transparent_32%),radial-gradient(circle_at_82%_78%,rgba(37,99,235,0.18),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(148,163,184,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.4)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <motion.div
          aria-hidden="true"
          className="absolute -left-32 top-1/3 h-80 w-80 rounded-full border border-cyan-300/15"
          animate={reduceMotion ? undefined : { rotate: 360, scale: [1, 1.08, 1] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-blue-300/15"
          animate={reduceMotion ? undefined : { rotate: -360, scale: [1, 0.94, 1] }}
          transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
        />
      </div>

      <div className="absolute right-4 top-4 z-20 sm:right-7 sm:top-7">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/10 bg-slate-950 px-12 py-10 text-white lg:flex xl:px-20 xl:py-14">
          <Link
            href="/"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to PRISM Lab
          </Link>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <div className="mb-8 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-cyan-200/25 bg-white p-2 shadow-[0_0_60px_rgba(34,211,238,0.18)]">
              <SafeImage
                src={PRISM_EMBLEM}
                alt="PRISM Lab emblem"
                className="h-full w-full rounded-full object-contain"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Secure administration
            </div>

            <h1 className="text-5xl font-black leading-[0.96] tracking-tight xl:text-6xl">
              PRISM Lab
              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Content Console
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-slate-300 xl:text-lg">
              Manage research, people, publications, projects, and laboratory updates from one protected workspace.
            </p>
          </motion.div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            Authorized PRISM Lab administrators only
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-24 sm:px-8 lg:px-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.12, ease: 'easeOut' }}
            className="w-full max-w-[480px]"
          >
            <div className="mb-8 text-center lg:text-left">
              <Link href="/" className="mb-7 inline-flex lg:hidden">
                <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-cyan-200/25 bg-white p-2 shadow-[0_0_45px_rgba(34,211,238,0.16)]">
                  <SafeImage
                    src={PRISM_EMBLEM}
                    alt="PRISM Lab emblem"
                    className="h-full w-full rounded-full object-contain"
                    loading="eager"
                  />
                </span>
              </Link>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600 dark:text-cyan-300">
                Administrator access
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Welcome back
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Enter your authorized credentials to continue to the dashboard.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.07] dark:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Email address
                  </label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600 dark:text-slate-500 dark:group-focus-within:text-cyan-300" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="username"
                      inputMode="email"
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-950 caret-blue-600 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/55 dark:text-white dark:caret-cyan-300 dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:border-cyan-400/70 dark:focus:ring-cyan-400/10"
                      placeholder="name@iitp.ac.in"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Password
                  </label>
                  <div className="group relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600 dark:text-slate-500 dark:group-focus-within:text-cyan-300" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      autoComplete="current-password"
                      disabled={loading}
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-14 text-base text-slate-950 caret-blue-600 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-slate-950/55 dark:text-white dark:caret-cyan-300 dark:placeholder:text-slate-600 dark:hover:border-white/20 dark:focus:border-cyan-400/70 dark:focus:ring-cyan-400/10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      disabled={loading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:ring-cyan-400"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Use the eye button to show or hide your password.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    aria-live="polite"
                    className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-700 dark:text-rose-200"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={reduceMotion || loading ? undefined : { y: -2 }}
                  whileTap={reduceMotion || loading ? undefined : { scale: 0.985 }}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 text-sm font-black text-white shadow-[0_16px_40px_rgba(37,99,235,0.25)] outline-none transition hover:shadow-[0_20px_48px_rgba(37,99,235,0.36)] focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Signing in securely…
                    </>
                  ) : (
                    <>
                      Sign in to dashboard
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-slate-500 dark:text-slate-500">
              Protected by encrypted, HTTP-only session authentication.
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
