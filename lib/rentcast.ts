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
  
  // Helper function to construct full address from components
  const buildAddressFromData = (data: any, fallback: string): string => {
    if (data.address) return data.address
    if (data.formattedAddress) return data.formattedAddress
    if (data.streetAddress || data.street) {
      const street = data.streetAddress || data.street || ''
      const city = data.city || ''
      const state = data.state || ''
      const zip = data.zipCode || data.zip || ''
      const parts = [street, city, state, zip].filter(Boolean)
      return parts.length > 0 ? parts.join(', ') : fallback
    }
    return fallback
  }

  // Helper function to build property URL for subject property
  const buildSubjectPropertyUrl = (data: any, fallbackAddress: string): string | undefined => {
    if (data.url || data.propertyUrl || data.listingUrl || data.zillowUrl || data.redfinUrl) {
      return data.url || data.propertyUrl || data.listingUrl || data.zillowUrl || data.redfinUrl
    }
    
    const propAddress = buildAddressFromData(data, fallbackAddress)
    if (propAddress && propAddress !== fallbackAddress) {
      const encodedAddress = encodeURIComponent(propAddress)
      return `https://www.zillow.com/homes/${encodedAddress}`
    }
    
    if (data.latitude && data.longitude) {
      return `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    }
    
    return undefined
  }

  // Extract property info and comparables from the value estimate response
  // The response structure may vary, so we'll adapt based on actual API response
  const property = {
    id: valueData.propertyId || valueData.id || '',
    address: buildAddressFromData(valueData, address),
    city: valueData.city || '',
    state: valueData.state || '',
    zipCode: valueData.zipCode || valueData.zip || valueData.postalCode || '',
    latitude: valueData.latitude,
    longitude: valueData.longitude,
    propertyType: valueData.propertyType || valueData.type,
    bedrooms: valueData.bedrooms || valueData.beds,
    bathrooms: valueData.bathrooms || valueData.baths,
    squareFootage: valueData.squareFootage || valueData.sqft || valueData.squareFeet,
    lotSize: valueData.lotSize || valueData.lotSquareFeet,
    yearBuilt: valueData.yearBuilt || valueData.year,
    estimatedValue: valueData.avm || valueData.estimate || valueData.value || valueData.estimatedValue,
    estimatedRent: valueData.rent || valueData.estimatedRent,
    lastSoldDate: valueData.lastSoldDate || valueData.soldDate || valueData.saleDate || valueData.dateSold || valueData.transactionDate || valueData.closingDate,
    lastSoldPrice: valueData.lastSoldPrice || valueData.salePrice || valueData.price || valueData.soldPrice,
    imageUrl: (() => {
      let imgUrl = valueData.imageUrl || valueData.image || valueData.photo || valueData.photoUrl || valueData.thumbnail || valueData.thumbnailUrl || valueData.picture || valueData.pictureUrl || valueData.primaryImage || valueData.primaryImageUrl
      // Fallback to Google Street View if no image provided and we have coordinates
      if (!imgUrl && valueData.latitude && valueData.longitude) {
        imgUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${valueData.latitude},${valueData.longitude}&fov=90&heading=235&pitch=10&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`
      }
      return imgUrl
    })(),
    propertyUrl: buildSubjectPropertyUrl(valueData, address),
  }
  
  // Helper function to construct full address from components
  const buildAddress = (comp: any): string => {
    // Try various address field names
    if (comp.address) return comp.address
    if (comp.formattedAddress) return comp.formattedAddress
    if (comp.streetAddress || comp.street) {
      const street = comp.streetAddress || comp.street || ''
      const city = comp.city || ''
      const state = comp.state || ''
      const zip = comp.zipCode || comp.zip || ''
      return [street, city, state, zip].filter(Boolean).join(', ')
    }
    // Fallback: construct from components
    const parts = [
      comp.streetAddress || comp.street || comp.addressLine1,
      comp.city,
      comp.state,
      comp.zipCode || comp.zip || comp.postalCode
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : ''
  }

  // Helper function to build property URL (Zillow, Redfin, etc.)
  const buildPropertyUrl = (comp: any): string | undefined => {
    // Check if API provides a direct link
    if (comp.url || comp.propertyUrl || comp.listingUrl || comp.zillowUrl || comp.redfinUrl) {
      return comp.url || comp.propertyUrl || comp.listingUrl || comp.zillowUrl || comp.redfinUrl
    }
    
    // Build Zillow URL from address if we have address components
    if (comp.address || (comp.streetAddress && comp.city && comp.state)) {
      const address = comp.address || buildAddress(comp)
      if (address) {
        const encodedAddress = encodeURIComponent(address)
        return `https://www.zillow.com/homes/${encodedAddress}`
      }
    }
    
    // Build Google Maps URL as fallback
    if (comp.latitude && comp.longitude) {
      return `https://www.google.com/maps?q=${comp.latitude},${comp.longitude}`
    }
    
    return undefined
  }

  // Extract comparables from the response
  // The API may return comparables in different formats
  // Filter to only include properties that have been sold (have sale price data)
  const allComparables = (valueData.comparables || valueData.comps || valueData.sales || []).map((comp: any) => {
    const salePrice = comp.lastSoldPrice || comp.salePrice || comp.price || comp.soldPrice
    // Extract sale date from various possible field names
    const saleDate = comp.lastSoldDate || comp.soldDate || comp.saleDate || comp.dateSold || comp.transactionDate || comp.closingDate
    // Extract image URL from various possible field names
    let imageUrl = comp.imageUrl || comp.image || comp.photo || comp.photoUrl || comp.thumbnail || comp.thumbnailUrl || comp.picture || comp.pictureUrl || comp.primaryImage || comp.primaryImageUrl
    
    // Fallback to Google Street View if no image provided and we have coordinates
    if (!imageUrl && comp.latitude && comp.longitude) {
      imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${comp.latitude},${comp.longitude}&fov=90&heading=235&pitch=10&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`
    }
    
    return {
      property: {
        id: comp.id || comp.propertyId || '',
        address: buildAddress(comp),
        city: comp.city || '',
        state: comp.state || '',
        zipCode: comp.zipCode || comp.zip || comp.postalCode || '',
        latitude: comp.latitude,
        longitude: comp.longitude,
        propertyType: comp.propertyType || comp.type,
        bedrooms: comp.bedrooms || comp.beds,
        bathrooms: comp.bathrooms || comp.baths,
        squareFootage: comp.squareFootage || comp.sqft || comp.squareFeet,
        lotSize: comp.lotSize || comp.lotSquareFeet,
        yearBuilt: comp.yearBuilt || comp.year,
        estimatedValue: comp.avm || comp.estimate || comp.value || comp.estimatedValue,
        estimatedRent: comp.rent || comp.estimatedRent,
        lastSoldDate: saleDate,
        lastSoldPrice: salePrice,
        imageUrl: imageUrl,
        propertyUrl: buildPropertyUrl(comp),
      },
      distance: comp.distance,
      similarityScore: comp.similarityScore || comp.score,
    }
  })
  
  // Filter to only include sold properties (those with a sale price)
  const soldComparables = allComparables.filter((comp: any) => comp.property.lastSoldPrice != null && comp.property.lastSoldPrice > 0)
  
  // Limit to the requested number of comparables
  const comparables = soldComparables.slice(0, limit)
  
  return {
    property,
    comparables: comparables || [],
  }
}
