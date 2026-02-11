'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm border-b border-deep-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-deep-green">Compro</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-deep-green text-deep-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/search"
                className="border-transparent text-gray-600 hover:border-deep-green/30 hover:text-deep-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                New Search
              </Link>
              <Link
                href="/pricing"
                className="border-transparent text-gray-600 hover:border-deep-green/30 hover:text-deep-green inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleSignOut}
                className="text-deep-green hover:text-deep-green-dark px-3 py-2 text-sm font-medium"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-deep-green hover:text-deep-green-dark px-3 py-2 text-sm font-medium"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
