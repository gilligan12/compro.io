'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // Create profile with free tier
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          subscription_tier: 'free',
          subscription_status: 'active',
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // Continue anyway - profile might already exist
      }

      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-4xl font-bold text-deep-green">Compro</h1>
          </Link>
          <h2 className="text-3xl font-extrabold text-deep-green">
            Create your account
          </h2>
          <p className="mt-2 text-gray-700">
            Start finding comparable properties today
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8 border border-deep-green/10">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-deep-green mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-deep-green sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-deep-green mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-deep-green sm:text-sm"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-deep-green hover:bg-deep-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-deep-green hover:text-deep-green-dark">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-deep-green hover:text-deep-green-dark">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
