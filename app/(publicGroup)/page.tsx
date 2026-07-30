export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 pt-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Welcome to FixItNow
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
            Your trusted marketplace for professional home services
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Find Services
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Browse a wide range of home services from trusted professionals
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Book Appointments
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Schedule services at your convenience with flexible booking options
              </p>
            </div>
            
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Track & Review
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Monitor your bookings and share honest reviews with the community
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
