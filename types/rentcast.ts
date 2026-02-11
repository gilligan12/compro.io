export interface RentCastProperty {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  propertyType?: string
  bedrooms?: number
  bathrooms?: number
  squareFootage?: number
  lotSize?: number
  yearBuilt?: number
  estimatedValue?: number
  estimatedRent?: number
  lastSoldDate?: string
  lastSoldPrice?: number
  propertyUrl?: string
}

export interface RentCastComparable {
  property: RentCastProperty
  distance?: number
  similarityScore?: number
}

export interface RentCastSearchResponse {
  property: RentCastProperty
  comparables: RentCastComparable[]
}
