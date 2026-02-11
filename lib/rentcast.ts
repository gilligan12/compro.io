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
  
  // First, get property details using RentCast API
  // Note: Adjust the endpoint based on actual RentCast API documentation
  const propertyResponse = await fetch(
    `${RENTCAST_API_BASE}/properties?address=${encodeURIComponent(address)}`,
    {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  )
  
  if (!propertyResponse.ok) {
    const errorText = await propertyResponse.text()
    let error
    try {
      error = JSON.parse(errorText)
    } catch {
      error = { message: errorText || 'Unknown error' }
    }
    throw new Error(`RentCast API error: ${error.message || propertyResponse.statusText}`)
  }
  
  const property = await propertyResponse.json()
  
  if (!property || !property.id) {
    throw new Error('Property not found')
  }
  
  // Then get comparables
  const comparablesResponse = await fetch(
    `${RENTCAST_API_BASE}/properties/${property.id}/comps?limit=${limit}`,
    {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  )
  
  if (!comparablesResponse.ok) {
    const errorText = await comparablesResponse.text()
    let error
    try {
      error = JSON.parse(errorText)
    } catch {
      error = { message: errorText || 'Unknown error' }
    }
    throw new Error(`RentCast API error: ${error.message || comparablesResponse.statusText}`)
  }
  
  const comparablesData = await comparablesResponse.json()
  
  return {
    property,
    comparables: comparablesData || [],
  }
}
