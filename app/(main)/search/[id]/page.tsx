import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ComparablesList from '@/components/ComparablesList'
import { Database } from '@/types/database'

type PropertySearch = Database['public']['Tables']['property_searches']['Row']

export default async function SearchResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: searchData, error } = await supabase
    .from('property_searches')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !searchData) {
    notFound()
  }

  const search = searchData as PropertySearch
  const property = search.property_data as any
  const comparables = (search.comparables_data || []) as any[]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {search.property_address}
          </h1>
          <p className="text-gray-600">
            Search completed on {new Date(search.created_at).toLocaleDateString()}
          </p>
        </div>
        <ComparablesList property={property} comparables={comparables} />
      </div>
    </div>
  )
}
