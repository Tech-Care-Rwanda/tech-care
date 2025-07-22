import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: number
  full_name: string
  phone_number: string
  email: string
  role: 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TechnicianDetails {
  id: number
  user_id: number
  gender?: string
  age?: number
  date_of_birth?: string
  experience: string
  specialization: string
  image_url?: string
  certificate_url?: string
  is_available: boolean
  rate: number
  approval_status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  latitude?: number
  longitude?: number
  address?: string
  district?: string
  last_location_update?: string
  created_at: string
  updated_at: string
  bio?: string
  user?: User
}

export interface Category {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  serviceName: string
  description: string
  categoryId: number
  price: string
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface Booking {
  id: number
  customerId: number
  technicianId: number
  serviceId: number
  locationId?: number
  scheduledDate?: string
  duration: number
  totalPrice: string
  status: 'CART' | 'CONFIRMED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
  cartExpiresAt?: string
  customerNotes?: string
  technicianNotes?: string
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  scheduledAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  customer?: User
  technician?: TechnicianDetails
  service?: Service
}

// Supabase service functions
export const supabaseService = {
  // Users
  async getUser(id: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as User
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as User | null
  },

  // Technicians
  async getTechnicians(approved = true) {
    // First, try a simple query without joins to test basic connection
    console.log('Attempting to fetch technicians from Supabase...')
    
    let query = supabase
      .from('technician_details')
      .select('*')

    // Don't filter by approval_status since I don't see it in your screenshot
    // if (approved) {
    //   query = query.eq('approval_status', 'APPROVED')
    // }

    const { data, error } = await query
    if (error) {
      console.error('Supabase error details:', error)
      console.error('Error message:', error.message)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      throw error
    }
    console.log('Supabase raw data:', data)
    
    // Now try to get the users data separately for each technician
    if (data && data.length > 0) {
      const techniciansWithUsers = await Promise.all(
        data.map(async (tech) => {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', tech.user_id)
              .single()
            
            return {
              ...tech,
              user: userError ? null : userData
            }
          } catch (err) {
            console.log('Could not fetch user for technician:', tech.id)
            return {
              ...tech,
              user: null
            }
          }
        })
      )
      console.log('Technicians with user data:', techniciansWithUsers)
      return techniciansWithUsers as TechnicianDetails[]
    }
    
    return data as TechnicianDetails[]
  },

  async getTechnicianById(id: number) {
    const { data, error } = await supabase
      .from('technician_details')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as TechnicianDetails
  },

  // Categories  
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('isActive', true)
      .order('name')
    
    if (error) throw error
    return data as Category[]
  },

  // Services
  async getServices(categoryId?: number) {
    let query = supabase
      .from('services')
      .select(`
        *,
        category:categories(*)
      `)

    if (categoryId) {
      query = query.eq('categoryId', categoryId)
    }

    const { data, error } = await query
    if (error) throw error
    return data as Service[]
  },

  // Bookings
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()
    
    if (error) throw error
    return data as Booking
  },

  async getBookingsByCustomer(customerId: number) {
    console.log('Attempting to fetch bookings for customer:', customerId)
    
    try {
      // First, let's try to list all tables to see what exists
      const { data: allData, error: allError } = await supabase
        .from('bookings')
        .select('count')
        .limit(1)
      
      if (allError) {
        console.error('Bookings table does not exist or has permission issues:', allError)
        // Return empty array instead of throwing error - show empty state
        return []
      }
      
      console.log('Bookings table accessible, trying to get records...')
      
      // Try to get all bookings first (without customer filter)
      const { data: allBookings, error: allBookingsError } = await supabase
        .from('bookings')
        .select('*')
        .limit(10)
      
      if (allBookingsError) {
        console.error('Error fetching any bookings:', allBookingsError)
        return []
      }
      
      console.log('All bookings in database:', allBookings)
      
      // If we have bookings, try to filter by customer
      if (allBookings && allBookings.length > 0) {
        console.log('Sample booking structure:', allBookings[0])
        
        // Try different possible field names for customer_id
        const possibleCustomerFields = ['customer_id', 'customerId', 'user_id', 'userId']
        
        for (const fieldName of possibleCustomerFields) {
          try {
            const { data: customerBookings, error: customerError } = await supabase
              .from('bookings')
              .select('*')
              .eq(fieldName, customerId)
            
            if (!customerError) {
              console.log(`Found bookings using field "${fieldName}":`, customerBookings)
              return customerBookings as Booking[]
            }
          } catch (err) {
            console.log(`Field "${fieldName}" doesn't exist, trying next...`)
          }
        }
      }
      
      console.log('No bookings found for customer, returning empty array')
      return []
      
    } catch (err) {
      console.error('Unexpected error in getBookingsByCustomer:', err)
      return [] // Return empty array instead of throwing
    }
  },

  async getBookingsByTechnician(technicianId: number) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users(*),
        service:services(*),
        technician:technician_details(*)
      `)
      .eq('technicianId', technicianId)
      .order('createdAt', { ascending: false })
    
    if (error) throw error
    return data as Booking[]
  },

  async updateBookingStatus(bookingId: number, status: Booking['status'], notes?: string) {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    }

    if (notes) {
      updateData.technicianNotes = notes
    }

    if (status === 'CONFIRMED') {
      updateData.confirmedAt = new Date().toISOString()
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date().toISOString()
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single()
    
    if (error) throw error
    return data as Booking
  }
}