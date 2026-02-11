import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-deep-green">
              Compro
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-deep-green transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-deep-green text-white px-4 py-2 rounded-md hover:bg-deep-green-dark transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Comparable Properties
            <span className="block text-deep-green mt-2">In Seconds</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Enter any property address and instantly get comparable properties with detailed market data, valuations, and insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-deep-green text-white rounded-lg font-medium hover:bg-deep-green-dark transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:border-gray-400 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-4 px-6 bg-deep-green">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">Start with 5 free searches per month</span>
              <Link
                href="/signup"
                className="text-white font-semibold hover:text-gray-100 underline underline-offset-2"
              >
                Create account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-deep-green rounded-full flex items-center justify-center text-white font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Enter Property Address</h3>
                      <p className="text-gray-600">Type in any property address in the United States</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-deep-green rounded-full flex items-center justify-center text-white font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Get Comparables</h3>
                      <p className="text-gray-600">Receive a list of similar properties with detailed data</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-deep-green rounded-full flex items-center justify-center text-white font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Review & Save</h3>
                      <p className="text-gray-600">View property details, valuations, and save searches for later</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="font-semibold text-gray-900 mb-4">What You Get</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Property details (bedrooms, bathrooms, square footage, year built)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Comparable properties with similar characteristics</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Estimated property values and rental rates</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-green mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Complete search history saved automatically</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pricing</h2>
            <p className="text-gray-600">Start free, upgrade when you need more</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Free</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-base text-gray-500 font-normal">/month</span></div>
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="text-gray-700">5 searches per month</li>
                <li className="text-gray-700">5 comparables per search</li>
                <li className="text-gray-700">Search history</li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-gray-100 text-gray-900 py-2.5 rounded-md font-medium hover:bg-gray-200 transition-colors mt-auto"
              >
                Get started
              </Link>
            </div>
            <div className="bg-white border-2 border-deep-green rounded-lg p-8 relative flex flex-col">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-deep-green text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Pro</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">$20<span className="text-base text-gray-500 font-normal">/month</span></div>
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="text-gray-700">25 searches per month</li>
                <li className="text-gray-700">10 comparables per search</li>
                <li className="text-gray-700">Search history</li>
                <li className="text-gray-700">Priority support</li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-deep-green text-white py-2.5 rounded-md font-medium hover:bg-deep-green-dark transition-colors mt-auto"
              >
                Get started
              </Link>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Premium</h3>
              <div className="text-3xl font-bold text-gray-900 mb-6">$50<span className="text-base text-gray-500 font-normal">/month</span></div>
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="text-gray-700">Unlimited searches</li>
                <li className="text-gray-700">15 comparables per search</li>
                <li className="text-gray-700">Search history</li>
                <li className="text-gray-700">Priority support</li>
                <li className="text-gray-700">Advanced analytics</li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-deep-green text-white py-2.5 rounded-md font-medium hover:bg-deep-green-dark transition-colors mt-auto"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-deep-green">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/90 mb-8">No credit card required. Start with 5 free searches per month.</p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-white text-deep-green rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Get started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-semibold text-deep-green">Compro</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/pricing" className="hover:text-deep-green">Pricing</Link>
              <Link href="/login" className="hover:text-deep-green">Log in</Link>
              <Link href="/signup" className="hover:text-deep-green">Sign up</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Compro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
