import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

// Enhanced database types with auth integration
export interface User {
  id: number
  full_name: string
  phone_number: string
  email: string
  role: 'ADMIN' | 'TECHNICIAN' | 'CUSTOMER'
  is_active: boolean
  supabase_user_id?: string // Link to Supabase Auth user
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
  customer_id: number
  technician_id: number
  service_id: number
  location_id?: number
  scheduled_date?: string
  duration: number
  total_price: string
  status: 'CART' | 'CONFIRMED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED'
  cart_expires_at?: string
  customer_notes?: string
  technician_notes?: string
  created_at: string
  updated_at: string
  confirmed_at?: string
  scheduled_at?: string
  completed_at?: string
  cancelled_at?: string
  cancellation_reason?: string
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
    console.log('Fetching technician by ID:', id)

    try {
      // First, test if we can access the table at all
      console.log('Testing table access...')
      const { data: testData, error: testError } = await supabase
        .from('technician_details')
        .select('id, specialization')
        .limit(1)

      if (testError) {
        console.error('Cannot access technician_details table:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        })
      } else {
        console.log('Table access OK. Sample data:', testData)
      }

      // Now get specific technician data
      const { data: techData, error: techError } = await supabase
        .from('technician_details')
        .select('*')
        .eq('id', id)
        .single()

      if (techError) {
        console.error('Error fetching technician:', {
          message: techError.message,
          details: techError.details,
          hint: techError.hint,
          code: techError.code
        })
        throw techError
      }

      console.log('Successfully fetched technician data:', techData)

      // Then get user data separately if user_id exists
      if (techData && techData.user_id) {
        console.log('Fetching user data for user_id:', techData.user_id)

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', techData.user_id)
          .single()

        if (userError) {
          console.log('Could not fetch user data:', {
            message: userError.message,
            details: userError.details,
            hint: userError.hint,
            code: userError.code
          })
          // Continue without user data
          return {
            ...techData,
            user: null
          } as TechnicianDetails
        }

        console.log('Successfully fetched user data:', userData)
        return {
          ...techData,
          user: userData
        } as TechnicianDetails
      }

      console.log('No user_id found, returning technician data only')
      return {
        ...techData,
        user: null
      } as TechnicianDetails

    } catch (err) {
      console.error('Unexpected error in getTechnicianById:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      })
      throw err
    }
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
  async createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
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
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:users!customer_id(*),
          technician:technician_details!technician_id(*),
          service:services!service_id(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching customer bookings:', error)
        return []
      }

      console.log('Successfully fetched customer bookings:', data)
      return data as Booking[]

    } catch (err) {
      console.error('Unexpected error in getBookingsByCustomer:', err)
      return []
    }
  },

  async getBookingsByTechnician(technicianId: number) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!customer_id(*),
        service:services!service_id(*),
        technician:technician_details!technician_id(*)
      `)
      .eq('technician_id', technicianId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Booking[]
  },

  async getBookingById(bookingId: number) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!customer_id(*),
        technician:technician_details!technician_id(*),
        service:services!service_id(*)
      `)
      .eq('id', bookingId)
      .single()

    if (error) throw error
    return data as Booking
  },

  async updateBookingStatus(bookingId: number, status: Booking['status'], notes?: string) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.technician_notes = notes
    }

    if (status === 'CONFIRMED') {
      updateData.confirmed_at = new Date().toISOString()
    } else if (status === 'COMPLETED') {
      updateData.completed_at = new Date().toISOString()
    } else if (status === 'CANCELLED') {
      updateData.cancelled_at = new Date().toISOString()
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