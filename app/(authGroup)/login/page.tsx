import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginForm from '../_components/loginFrom'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Login - FixItNow',
  description: 'Sign in to your FixItNow account to manage your home service requests.',
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/2 -top-1/2 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute -left-1/4 bottom-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/10" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Main container - Two column layout */}
        <div className="w-full max-w-6xl grid gap-8 md:grid-cols-2 items-center">
          {/* Left: Branding Section */}
          <div className="hidden md:flex flex-col justify-center space-y-8">
            {/* Logo and App Name */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-6"
                  >
                    <path d="M14 4v3h3m-3-3l3 3m-3 3h-3v3m3-3l-3 3M6 10v3h3m-3-3l3 3m-3 3H3v3m3-3l-3 3m12-8v8c0 2-1 4-3 4H3" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    FixItNow
                  </h1>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                Find trusted technicians, book services instantly, and manage your home service requests with ease.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">
                Connect with professional service providers in your area. Get real-time updates, transparent pricing, and 24/7 support.
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="size-3.5 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>Verified service professionals</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="size-3.5 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>Instant booking and confirmation</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg
                    className="size-3.5 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>Real-time service tracking</span>
              </li>
            </ul>
          </div>

          {/* Right: Login Card */}
          <div className="flex items-center justify-center">
            <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

