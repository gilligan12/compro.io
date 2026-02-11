import Link from 'next/link'
import { format } from 'date-fns'

interface SearchHistoryCardProps {
  id: string
  address: string
  comparablesCount: number
  createdAt: string
}

export default function SearchHistoryCard({
  id,
  address,
  comparablesCount,
  createdAt,
}: SearchHistoryCardProps) {
  const date = new Date(createdAt)
  const formattedDate = format(date, 'MMM d, yyyy')

  return (
    <Link
      href={`/search/${id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{address}</h3>
          <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {comparablesCount} comparables found
            </span>
          </div>
        </div>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}
