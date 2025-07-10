import { useState, useEffect, useCallback, useMemo } from 'react';
import { googlePlacesService } from '../services/googlePlaces';

interface ComputerShop {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  photo: string;
  isOpen: boolean;
  phone?: string;
  website?: string;
  priceLevel: number;
  services: string[];
  businessHours: string[];
  experience: number;
  completedJobs: number;
  responseTime: string;
  specialties: string[];
}

interface UseComputerShopsOptions {
  location?: { lat: number; lng: number };
  radius?: number;
  autoFetch?: boolean;
}

interface UseComputerShopsReturn {
  shops: ComputerShop[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchShops: (location?: { lat: number; lng: number }, radius?: number) => Promise<void>;
}

export function useComputerShops(options: UseComputerShopsOptions = {}): UseComputerShopsReturn {
  const { location, radius = 10000, autoFetch = true } = options;
  
  const [shops, setShops] = useState<ComputerShop[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Stabilize location object to prevent infinite re-renders
  const stableLocation = useMemo(() => {
    return location || { lat: -1.9441, lng: 30.0619 }; // Default to Kigali
  }, [location?.lat, location?.lng]);

  const fetchShops = useCallback(async (
    searchLocation?: { lat: number; lng: number }, 
    searchRadius?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const targetLocation = searchLocation || stableLocation;
      const targetRadius = searchRadius || radius;
      
      const results = await googlePlacesService.searchComputerShops(targetLocation, targetRadius);
      setShops(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch computer shops';
      setError(errorMessage);
      console.error('Error fetching computer shops:', err);
    } finally {
      setLoading(false);
    }
  }, [stableLocation, radius]); // Use stable location

  const refetch = useCallback(() => fetchShops(), [fetchShops]);

  // Auto-fetch on mount if enabled - use a separate effect to avoid infinite loop
  useEffect(() => {
    if (autoFetch) {
      // Call the fetch function directly to avoid dependency issues
      const performInitialFetch = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const results = await googlePlacesService.searchComputerShops(stableLocation, radius);
          setShops(results);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch computer shops';
          setError(errorMessage);
          console.error('Error fetching computer shops:', err);
        } finally {
          setLoading(false);
        }
      };
      
      performInitialFetch();
    }
  }, [autoFetch, stableLocation, radius]); // Safe dependencies

  return {
    shops,
    loading,
    error,
    refetch,
    fetchShops
  };
}

// Hook for getting a specific shop by ID
export function useComputerShop(shopId: string) {
  const [shop, setShop] = useState<ComputerShop | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to get from cached shops
        const allShops = await googlePlacesService.searchComputerShops();
        const foundShop = allShops.find(s => s.id === shopId);
        
        if (foundShop) {
          setShop(foundShop);
        } else {
          // Try to get detailed information from Google Places
          const placeDetails = await googlePlacesService.getPlaceDetails(shopId);
          if (placeDetails) {
            // Transform place details to our shop format
            const shopData: ComputerShop = {
              id: placeDetails.place_id,
              name: placeDetails.name,
              rating: placeDetails.rating || 0,
              reviewCount: placeDetails.user_ratings_total || 0,
              address: placeDetails.vicinity,
              location: {
                lat: placeDetails.geometry.location.lat,
                lng: placeDetails.geometry.location.lng
              },
              photo: placeDetails.photos?.[0] 
                ? googlePlacesService.getPhotoUrl(placeDetails.photos[0].photo_reference)
                : '/images/default-shop.jpg',
              isOpen: placeDetails.opening_hours?.open_now ?? true,
              phone: placeDetails.formatted_phone_number,
              website: placeDetails.website,
              priceLevel: placeDetails.price_level || 2,
              services: ['Computer Repair', 'Tech Support'], // Default services
              businessHours: placeDetails.opening_hours?.weekday_text || [],
              experience: Math.floor(Math.random() * 10) + 2,
              completedJobs: Math.floor(Math.random() * 500) + 50,
              responseTime: 'Within 1 hour',
              specialties: ['General Repair', 'Tech Support']
            };
            setShop(shopData);
          } else {
            setError('Shop not found');
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shop details';
        setError(errorMessage);
        console.error('Error fetching shop details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchShop();
    }
  }, [shopId]);

  return { shop, loading, error };
}

// Hook for searching shops by service type
export function useComputerShopsByService(serviceType: string) {
  const { shops, loading, error, refetch } = useComputerShops();
  
  const filteredShops = shops.filter(shop => 
    shop.services.some(service => 
      service.toLowerCase().includes(serviceType.toLowerCase())
    ) ||
    shop.specialties.some(specialty => 
      specialty.toLowerCase().includes(serviceType.toLowerCase())
    )
  );

  return {
    shops: filteredShops,
    loading,
    error,
    refetch
  };
} 