'use client'

import { useEffect, useState } from 'react'
import SearchHistoryCard from './SearchHistoryCard'

interface Search {
  id: string
  property_address: string
  comparables_count: number
  created_at: string
}

export default function HistoricalSearches() {
  const [searches, setSearches] = useState<Search[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/searches/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setSearches(data.searches || [])
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-500">Loading search history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading search history: {error}
      </div>
    )
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No searches yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by searching for your first property.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {searches.map((search) => (
        <SearchHistoryCard
          key={search.id}
          id={search.id}
          address={search.property_address}
          comparablesCount={search.comparables_count}
          createdAt={search.created_at}
        />
      ))}
    </div>
  )
}
