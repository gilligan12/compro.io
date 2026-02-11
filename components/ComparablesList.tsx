import ComparablesCard from './ComparablesCard'

interface ComparablesListProps {
  property: any
  comparables: any[]
}

export default function ComparablesList({ property, comparables }: ComparablesListProps) {
  return (
    <div className="space-y-6">
      {/* Main Property */}
      <div className="bg-blue-50 rounded-lg shadow p-6 border-2 border-blue-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Subject Property</h2>
        <ComparablesCard property={property} />
      </div>

      {/* Comparables */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Comparable Properties ({comparables.length})
        </h2>
        <div className="space-y-4">
          {comparables.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comparables found.</p>
          ) : (
            comparables.map((comp, index) => (
              <ComparablesCard
                key={index}
                property={comp.property || comp}
                distance={comp.distance}
                similarityScore={comp.similarityScore}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
