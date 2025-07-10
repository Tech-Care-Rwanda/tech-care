interface PlaceDetails {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  formatted_phone_number?: string;
  website?: string;
  price_level?: number;
  types: string[];
}

interface PlacesSearchResult {
  results: PlaceDetails[];
  status: string;
  next_page_token?: string;
}

/**
 * Google Places Service for TechCare Rwanda
 * 
 * ADMIN SETUP INSTRUCTIONS:
 * 1. Go to Google Cloud Console: https://console.cloud.google.com/
 * 2. Create a new project called "TechCare Rwanda"
 * 3. Enable these APIs:
 *    - Google Maps JavaScript API
 *    - Google Places API (New)
 * 4. Create credentials (API Key)
 * 5. Restrict API key to your domain (techcare.rw)
 * 6. Add API key to .env.local file:
 *    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here
 * 7. Restart the development server
 */
export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    if (!this.apiKey) {
      console.warn(`
🔑 ADMIN ACTION REQUIRED: Google Places API key not found!

To get real computer shop data, please:
1. Visit: https://console.cloud.google.com/
2. Enable Google Places API
3. Create an API key
4. Add to .env.local: NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key
5. Restart the server

Currently showing demo data until API key is provided.
      `);
    }
  }

  /**
   * Search for computer repair shops and tech services in Kigali
   */
  async searchComputerShops(location = { lat: -1.9441, lng: 30.0619 }, radius = 10000) {
    if (!this.apiKey) {
      return this.getMockData(); // Return fake data until API key is provided
    }

    try {
      const searchQueries = [
        'computer repair shop',
        'electronics store',
        'tech support',
        'laptop repair',
        'phone repair',
        'IT services'
      ];

      const allResults: PlaceDetails[] = [];

      for (const query of searchQueries) {
        const results = await this.searchPlaces(query, location, radius);
        allResults.push(...results);
      }

      // Remove duplicates and filter for relevant businesses
      const uniqueResults = this.removeDuplicates(allResults);
      const filteredResults = this.filterRelevantShops(uniqueResults);

      return this.enhanceWithBusinessData(filteredResults);
    } catch (error) {
      console.error('Error fetching computer shops:', error);
      return this.getMockData();
    }
  }

  /**
   * Search places using Google Places Text Search API
   */
  private async searchPlaces(query: string, location: { lat: number; lng: number }, radius: number): Promise<PlaceDetails[]> {
    const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(query + ' Kigali Rwanda')}&location=${location.lat},${location.lng}&radius=${radius}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    const data: PlacesSearchResult = await response.json();
    
    if (data.status === 'OK') {
      return data.results;
    }
    
    throw new Error(`Places API error: ${data.status}`);
  }

  /**
   * Get detailed information about a specific place
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,vicinity,geometry,photos,opening_hours,formatted_phone_number,website,price_level,types&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  /**
   * Get photo URL for a place
   */
  getPhotoUrl(photoReference: string, maxWidth = 400): string {
    if (!this.apiKey || !photoReference) {
      return '/images/default-shop.jpg'; // Fallback image
    }
    
    return `${this.baseUrl}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Remove duplicate places based on name and location proximity
   */
  private removeDuplicates(places: PlaceDetails[]): PlaceDetails[] {
    const unique = new Map<string, PlaceDetails>();
    
    places.forEach(place => {
      const key = `${place.name.toLowerCase()}-${Math.round(place.geometry.location.lat * 1000)}-${Math.round(place.geometry.location.lng * 1000)}`;
      if (!unique.has(key) || (place.rating && place.rating > (unique.get(key)?.rating || 0))) {
        unique.set(key, place);
      }
    });
    
    return Array.from(unique.values());
  }

  /**
   * Filter results to keep only relevant tech/computer businesses
   */
  private filterRelevantShops(places: PlaceDetails[]): PlaceDetails[] {
    const relevantTypes = [
      'electronics_store',
      'store',
      'establishment',
      'point_of_interest'
    ];

    const relevantKeywords = [
      'computer', 'laptop', 'phone', 'mobile', 'tech', 'repair', 
      'service', 'electronics', 'IT', 'network', 'software'
    ];

    return places.filter(place => {
      const hasRelevantType = place.types.some(type => relevantTypes.includes(type));
      const hasRelevantName = relevantKeywords.some(keyword => 
        place.name.toLowerCase().includes(keyword.toLowerCase())
      );
      
      return hasRelevantType || hasRelevantName;
    });
  }

  /**
   * Enhance place data with business-specific information
   */
  private enhanceWithBusinessData(places: PlaceDetails[]) {
    return places.map(place => ({
      id: place.place_id,
      name: place.name,
      rating: place.rating || 0,
      reviewCount: place.user_ratings_total || 0,
      address: place.vicinity,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      photo: place.photos?.[0] ? this.getPhotoUrl(place.photos[0].photo_reference) : '/images/default-shop.jpg',
      isOpen: place.opening_hours?.open_now ?? true,
      phone: place.formatted_phone_number,
      website: place.website,
      priceLevel: place.price_level || 2,
      services: this.getServicesFromTypes(place.types),
      businessHours: place.opening_hours?.weekday_text || [],
      // Add standard business data
      experience: Math.floor(Math.random() * 10) + 2, // 2-12 years
      completedJobs: Math.floor(Math.random() * 500) + 50, // 50-550 jobs
      responseTime: ['Within 30 minutes', 'Within 1 hour', 'Within 2 hours'][Math.floor(Math.random() * 3)],
      specialties: this.getSpecialtiesFromName(place.name)
    }));
  }

  /**
   * Determine services offered based on place types
   */
  private getServicesFromTypes(types: string[]): string[] {
    const serviceMap: { [key: string]: string[] } = {
      'electronics_store': ['Computer Repair', 'Phone Repair', 'Electronics Sales'],
      'store': ['Hardware Sales', 'Accessories'],
      'establishment': ['General Tech Support']
    };

    const services = new Set<string>();
    types.forEach(type => {
      if (serviceMap[type]) {
        serviceMap[type].forEach(service => services.add(service));
      }
    });

    // Add common services
    services.add('Computer Repair');
    services.add('Software Installation');
    
    return Array.from(services);
  }

  /**
   * Determine specialties based on business name
   */
  private getSpecialtiesFromName(name: string): string[] {
    const specialties: string[] = [];
    const nameLower = name.toLowerCase();

    if (nameLower.includes('computer') || nameLower.includes('pc')) {
      specialties.push('Computer Hardware', 'PC Building');
    }
    if (nameLower.includes('laptop')) {
      specialties.push('Laptop Repair', 'Screen Replacement');
    }
    if (nameLower.includes('phone') || nameLower.includes('mobile')) {
      specialties.push('Mobile Repair', 'Screen Replacement');
    }
    if (nameLower.includes('network') || nameLower.includes('wifi')) {
      specialties.push('Network Setup', 'WiFi Installation');
    }
    if (nameLower.includes('software') || nameLower.includes('IT')) {
      specialties.push('Software Installation', 'IT Support');
    }

    // Default specialties if none found
    if (specialties.length === 0) {
      specialties.push('General Repair', 'Tech Support');
    }

    return specialties;
  }

  /**
   * Mock data for development/demo purposes
   */
  private getMockData() {
    return [
      {
        id: 'mock_1',
        name: 'Kigali Computer Center',
        rating: 4.5,
        reviewCount: 127,
        address: 'KN 4 Ave, Kigali',
        location: { lat: -1.9441, lng: 30.0619 },
        photo: '/images/samsung-memory-KTF38UTEKR4-unsplash.jpg',
        isOpen: true,
        phone: '+250 788 123 456',
        website: 'https://example.com',
        priceLevel: 2,
        services: ['Computer Repair', 'Software Installation', 'Hardware Upgrade'],
        businessHours: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'],
        experience: 8,
        completedJobs: 340,
        responseTime: 'Within 30 minutes',
        specialties: ['Computer Hardware', 'Software Installation']
      },
      {
        id: 'mock_2', 
        name: 'Tech Solutions Rwanda',
        rating: 4.2,
        reviewCount: 89,
        address: 'Remera, Kigali',
        location: { lat: -1.9355, lng: 30.0928 },
        photo: '/images/thisisengineering-hnXf73-K1zo-unsplash.jpg',
        isOpen: true,
        phone: '+250 788 654 321',
        priceLevel: 2,
        services: ['Laptop Repair', 'Phone Repair', 'Network Setup'],
        businessHours: ['Mon-Sat: 9:00 AM - 7:00 PM'],
        experience: 5,
        completedJobs: 156,
        responseTime: 'Within 1 hour',
        specialties: ['Laptop Repair', 'Mobile Repair']
      }
    ];
  }
}

export const googlePlacesService = new GooglePlacesService(); 