'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PropertySearch() {
  const router = useRouter()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      // Redirect to view the search results
      router.push(`/search/${data.searchId}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Search for Comparables</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Property Address
          </label>
          <input
            id="address"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 123 Main St, New York, NY 10001"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a full address including street, city, state, and ZIP code
          </p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search for Comparables'}
        </button>
      </form>
    </div>
  )
}
