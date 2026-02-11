interface PricingCardProps {
  name: string
  price: number
  searches: number | null
  comparables: number
  features: string[]
  onSelect: () => void
  loading?: boolean
  highlighted?: boolean
}

export default function PricingCard({
  name,
  price,
  searches,
  comparables,
  features,
  onSelect,
  loading = false,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-8 ${
        highlighted ? 'ring-2 ring-blue-500 scale-105' : ''
      }`}
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-extrabold text-gray-900">${price}</span>
          <span className="text-gray-600 ml-2">/month</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            {searches === null ? 'Unlimited' : `${searches} searches`} / month
          </p>
          <p className="text-sm text-gray-600">{comparables} comparables per search</p>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSelect}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
          highlighted
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : price === 0 ? 'Current Plan' : 'Subscribe'}
      </button>
    </div>
  )
}
