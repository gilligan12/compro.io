interface ComparablesCardProps {
  property: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    bedrooms?: number
    bathrooms?: number
    squareFootage?: number
    estimatedValue?: number
    estimatedRent?: number
    lastSoldPrice?: number
    lastSoldDate?: string
    yearBuilt?: number
    propertyType?: string
  }
  distance?: number
  similarityScore?: number
}

export default function ComparablesCard({ property, distance, similarityScore }: ComparablesCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {property.address || 'Address not available'}
          </h3>
          <p className="text-sm text-gray-600">
            {[property.city, property.state, property.zipCode].filter(Boolean).join(', ')}
          </p>
        </div>
        {similarityScore && (
          <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {Math.round(similarityScore * 100)}% match
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {property.bedrooms !== undefined && (
          <div>
            <p className="text-xs text-gray-500">Bedrooms</p>
            <p className="text-sm font-medium text-gray-900">{property.bedrooms}</p>
          </div>
        )}
        {property.bathrooms !== undefined && (
          <div>
            <p className="text-xs text-gray-500">Bathrooms</p>
            <p className="text-sm font-medium text-gray-900">{property.bathrooms}</p>
          </div>
        )}
        {property.squareFootage && (
          <div>
            <p className="text-xs text-gray-500">Square Feet</p>
            <p className="text-sm font-medium text-gray-900">
              {property.squareFootage.toLocaleString()}
            </p>
          </div>
        )}
        {property.yearBuilt && (
          <div>
            <p className="text-xs text-gray-500">Year Built</p>
            <p className="text-sm font-medium text-gray-900">{property.yearBuilt}</p>
          </div>
        )}
      </div>

      {(property.estimatedValue || property.estimatedRent || property.lastSoldPrice) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-4 flex-wrap">
            {property.lastSoldPrice && (
              <div>
                <p className="text-xs text-gray-500">Sale Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${property.lastSoldPrice.toLocaleString()}
                </p>
                {property.lastSoldDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sold: {new Date(property.lastSoldDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {property.estimatedValue && (
              <div>
                <p className="text-xs text-gray-500">Estimated Value</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${property.estimatedValue.toLocaleString()}
                </p>
              </div>
            )}
            {property.estimatedRent && (
              <div>
                <p className="text-xs text-gray-500">Estimated Rent</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${property.estimatedRent.toLocaleString()}/mo
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {distance !== undefined && (
        <p className="mt-2 text-xs text-gray-500">
          {distance.toFixed(2)} miles away
        </p>
      )}
    </div>
  )
}
