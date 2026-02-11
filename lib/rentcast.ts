import { RentCastSearchResponse, RentCastComparable } from '@/types/rentcast'

const RENTCAST_API_BASE = 'https://api.rentcast.io/v1'

export async function searchComparables(
  address: string,
  limit: number = 5
): Promise<RentCastSearchResponse> {
  const apiKey = process.env.RENTCAST_API_KEY
  
  if (!apiKey) {
    throw new Error('RENTCAST_API_KEY is not configured')
  }
  
  // Use Value Estimate endpoint which returns property value and comparables
  const valueResponse = await fetch(
    `${RENTCAST_API_BASE}/avm/value?address=${encodeURIComponent(address)}&limit=${limit}`,
    {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  )
  
  if (!valueResponse.ok) {
    const errorText = await valueResponse.text()
    let error
    try {
      error = JSON.parse(errorText)
    } catch {
      error = { message: errorText || 'Unknown error' }
    }
    throw new Error(`RentCast API error: ${error.message || valueResponse.statusText}`)
  }
  
  const valueData = await valueResponse.json()
  
  if (!valueData) {
    throw new Error('Property not found')
  }
  
  // Extract property info and comparables from the value estimate response
  // The response structure may vary, so we'll adapt based on actual API response
  const property = {
    id: valueData.propertyId || valueData.id || '',
    address: valueData.address || address,
    city: valueData.city || '',
    state: valueData.state || '',
    zipCode: valueData.zipCode || valueData.zip || '',
    latitude: valueData.latitude,
    longitude: valueData.longitude,
    propertyType: valueData.propertyType,
    bedrooms: valueData.bedrooms,
    bathrooms: valueData.bathrooms,
    squareFootage: valueData.squareFootage,
    lotSize: valueData.lotSize,
    yearBuilt: valueData.yearBuilt,
    estimatedValue: valueData.avm || valueData.estimate || valueData.value,
    estimatedRent: valueData.rent,
    lastSoldDate: valueData.lastSoldDate,
    lastSoldPrice: valueData.lastSoldPrice,
  }
  
  // Extract comparables from the response
  // The API may return comparables in different formats
  const comparables = (valueData.comparables || valueData.comps || valueData.sales || []).slice(0, limit).map((comp: any) => ({
    property: {
      id: comp.id || comp.propertyId || '',
      address: comp.address || '',
      city: comp.city || '',
      state: comp.state || '',
      zipCode: comp.zipCode || comp.zip || '',
      latitude: comp.latitude,
      longitude: comp.longitude,
      propertyType: comp.propertyType,
      bedrooms: comp.bedrooms,
      bathrooms: comp.bathrooms,
      squareFootage: comp.squareFootage,
      lotSize: comp.lotSize,
      yearBuilt: comp.yearBuilt,
      estimatedValue: comp.avm || comp.estimate || comp.value,
      estimatedRent: comp.rent,
      lastSoldDate: comp.lastSoldDate,
      lastSoldPrice: comp.lastSoldPrice || comp.salePrice,
    },
    distance: comp.distance,
    similarityScore: comp.similarityScore,
  }))
  
  return {
    property,
    comparables: comparables || [],
  }
}
