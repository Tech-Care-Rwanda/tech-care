import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured. Using placeholder values for development.')
  console.warn('To connect to real database, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
}

// Create Supabase client with fallback values for development
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
)

// Enhanced database types with auth integration
export interface User {
  id: string
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
  id: string
  user_id: string
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
  id: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  serviceName: string
  description: string
  categoryId: string
  price: string
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface Booking {
  id: string // UUID for booking ID
  customer_id: string // UUID for customer
  technician_id: string // UUID for technician
  service_id: number // Integer for service ID
  service_type: string // Required service type field
  problem_description: string // Required problem description field
  customer_location: string // Required customer location field
  price_rwf: string // Required price in RWF field
  location_id?: number
  scheduled_date?: string
  duration: number
  total_price: string
  status: 'pending' | 'confirmed' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'expired'
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

// Test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase Key exists:', !!supabaseAnonKey)

    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error: error.message }
    }

    console.log('Supabase connection test successful')
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection test error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Supabase service functions
export const supabaseService = {
  // Users
  async getUser(id: string) {
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

    try {
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Check your environment variables.')
      }

      let query = supabase
        .from('technician_details')
        .select('*')

      // Don't filter by approval_status since I don't see it in your screenshot
      // if (approved) {
      //   query = query.eq('approval_status', 'APPROVED')
      // }

      const { data, error } = await query
      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database access error: ${error.message}`)
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

    } catch (err) {
      console.error('Unexpected error in getTechnicians:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      })
      throw err
    }
  },

  async getTechnicianById(id: string) {
    console.log('Fetching technician by ID:', id)

    try {
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Check your environment variables.')
      }

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
        throw new Error(`Database access error: ${testError.message}`)
      } else {
        console.log('Table access OK. Sample data:', testData)
      }

      // Try to get technician by technician_details.id first
      console.log('Searching by technician_details.id:', id)
      let { data: techData, error: techError } = await supabase
        .from('technician_details')
        .select('*')
        .eq('id', id)
        .single()

      // If not found, try searching by user_id
      if (techError && techError.code === 'PGRST116') {
        console.log('Not found by technician_details.id, trying user_id:', id)
        const { data: techDataByUserId, error: userIdError } = await supabase
          .from('technician_details')
          .select('*')
          .eq('user_id', id)
          .single()

        if (userIdError) {
          console.log('Also not found by user_id. Original error:', techError)
          throw new Error(`Technician with ID ${id} not found`)
        }

        techData = techDataByUserId
        techError = null
        console.log('Found technician by user_id:', techData)
      }

      if (techError) {
        console.error('Error fetching technician:', {
          message: techError.message,
          details: techError.details,
          hint: techError.hint,
          code: techError.code
        })

        if (techError.code === 'PGRST116') {
          throw new Error(`Technician with ID ${id} not found`)
        }

        throw new Error(`Database error: ${techError.message}`)
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

        if (userError && userError.code !== 'PGRST116') {
          console.log('Error fetching user data:', {
            message: userError.message,
            details: userError.details,
            hint: userError.hint,
            code: userError.code
          })
        }

        console.log('User data result:', userData)
        return {
          ...techData,
          user: userData || null
        } as TechnicianDetails
      }

      console.log('No user_id found, returning technician data only')
      return {
        ...techData,
        user: null
      } as TechnicianDetails

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      const errorStack = err instanceof Error ? err.stack : undefined

      console.error('Unexpected error in getTechnicianById:', {
        message: errorMessage,
        stack: errorStack,
        error: err,
        originalError: JSON.stringify(err)
      })

      // Create a new error with proper message
      throw new Error(`Failed to fetch technician: ${errorMessage}`)
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
    console.log('Creating booking in Supabase:', JSON.stringify(bookingData, null, 2))
    console.log('Booking data keys:', Object.keys(bookingData))
    console.log('Booking data values:', Object.values(bookingData))

    try {
      // Ensure anonymous authentication is enabled
      const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()

      if (authError) {
        console.error('Anonymous authentication failed:', authError)
        throw new Error(`Authentication failed: ${authError.message}. Please enable anonymous sign-ins in your Supabase project.`)
      }

      console.log('Anonymous user authenticated:', user?.id)

      // First, let's test what columns exist in the bookings table and what status values are used
      console.log('Testing bookings table structure...')
      const { data: testData, error: testError } = await supabase
        .from('bookings')
        .select('*')
        .limit(1)

      if (testError) {
        console.log('Table structure test error:', testError)
      } else {
        console.log('Bookings table sample record (to check column names):', testData)
        if (testData && testData.length > 0) {
          console.log('Available columns in bookings table:', Object.keys(testData[0]))
        }
      }

      // Test if the technician_id exists in technician_details table
      console.log('Verifying technician exists in technician_details table...')
      const { data: techTest, error: techTestError } = await supabase
        .from('technician_details')
        .select('id, user_id, specialization')
        .eq('id', bookingData.technician_id)
        .single()

      if (techTestError) {
        console.log('❌ Technician verification error:', techTestError)
        console.log('Technician ID being searched:', bookingData.technician_id)
        console.log('This explains the foreign key constraint error!')
      } else {
        console.log('✅ Technician found in technician_details table:', techTest)
        console.log('Foreign key constraint should work now')
      }

      // Now attempt to create the booking with anonymous user context
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) {
        console.error('Supabase booking creation error:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        console.error('Error code:', error.code)
        console.error('Booking data that failed:', JSON.stringify(bookingData, null, 2))

        // Provide specific error messages for common RLS issues
        if (error.message.includes('row-level security policy')) {
          throw new Error(`RLS Policy Error: Please run this SQL in your Supabase dashboard:

CREATE POLICY "Allow anonymous booking creation"
ON bookings
FOR INSERT
TO anon
WITH CHECK (true);

Error details: ${error.message}`)
        }

        // Handle missing required fields
        if (error.message.includes('null value in column') && error.message.includes('violates not-null constraint')) {
          const fieldMatch = error.message.match(/null value in column "([^"]+)"/);
          const fieldName = fieldMatch ? fieldMatch[1] : 'unknown field';
          throw new Error(`Database Error: Missing required field '${fieldName}'. Please ensure all required booking fields are provided.`)
        }

        // Handle check constraint violations (invalid enum values)
        if (error.message.includes('violates check constraint')) {
          const constraintMatch = error.message.match(/violates check constraint "([^"]+)"/);
          const constraintName = constraintMatch ? constraintMatch[1] : 'unknown constraint';

          if (constraintName.includes('status')) {
            throw new Error(`Database Error: Invalid status value. Please use one of: pending, confirmed, scheduled, in_progress, completed, cancelled, expired`)
          }

          throw new Error(`Database Error: Constraint violation '${constraintName}'. Please check your data values.`)
        }

        // Handle foreign key constraint violations
        if (error.message.includes('violates foreign key constraint')) {
          const constraintMatch = error.message.match(/violates foreign key constraint "([^"]+)"/);
          const constraintName = constraintMatch ? constraintMatch[1] : 'unknown constraint';

          if (constraintName.includes('fk_technician') || constraintName.includes('technician')) {
            throw new Error(`Database Error: Invalid technician ID '${bookingData.technician_id}'. This technician does not exist in the technician_details table. Please use a valid technician_details.id (like 660e8400-e29b-41d4-a716-446655440002).`)
          }

          if (constraintName.includes('customer')) {
            throw new Error(`Database Error: Invalid customer ID '${bookingData.customer_id}'. The customer may not exist in the users table.`)
          }

          if (constraintName.includes('service')) {
            throw new Error(`Database Error: Invalid service ID '${bookingData.service_id}'. The service may not exist in the services table.`)
          }

          throw new Error(`Database Error: Foreign key constraint violation '${constraintName}'. Referenced record may not exist. Data: ${JSON.stringify(bookingData, null, 2)}`)
        }

        throw new Error(`Failed to create booking: ${error.message}`)
      }

      console.log('Booking created successfully in Supabase:', data)
      return data as Booking
    } catch (err) {
      console.error('Unexpected error creating booking:', err)
      throw err
    }
  },

  async getBookingsByCustomer(customerId: string) {
    console.log('Attempting to fetch bookings for customer:', customerId)

    try {
      // Check if Supabase is properly configured
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase is not configured. Check your environment variables.')
      }

      // First test basic connection
      const { data: testData, error: testError } = await supabase
        .from('bookings')
        .select('id')
        .limit(1)

      if (testError) {
        console.error('Cannot access bookings table:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        })
        throw new Error(`Database access error: ${testError.message}`)
      }

      console.log('Bookings table access OK')

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
        console.error('Error fetching customer bookings:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database query error: ${error.message}`)
      }

      console.log('Successfully fetched customer bookings:', data)
      return data as Booking[]

    } catch (err) {
      console.error('Unexpected error in getBookingsByCustomer:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      })
      return []
    }
  },

  async getBookingsByTechnician(technicianId: string) {
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

  async getBookingById(bookingId: string) {
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

  async updateBookingStatus(bookingId: string, status: Booking['status'], notes?: string) {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.technician_notes = notes
    }

    if (status === 'confirmed') {
      updateData.confirmed_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    } else if (status === 'cancelled') {
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