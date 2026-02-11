interface UsageMeterProps {
  used: number
  limit: number | null
  label?: string
}

export default function UsageMeter({ used, limit, label = 'Searches' }: UsageMeterProps) {
  const percentage = limit ? Math.min((used / limit) * 100, 100) : 0
  const isNearLimit = limit && used >= limit * 0.8
  const isAtLimit = limit && used >= limit

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-900'}`}>
          {used} / {limit === null ? '∞' : limit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all ${
            isAtLimit
              ? 'bg-red-600'
              : isNearLimit
              ? 'bg-yellow-500'
              : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isAtLimit && (
        <p className="mt-2 text-xs text-red-600">
          You've reached your monthly limit. Upgrade to continue searching.
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="mt-2 text-xs text-yellow-600">
          You're approaching your monthly limit.
        </p>
      )}
    </div>
  )
}
