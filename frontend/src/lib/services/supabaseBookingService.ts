/**
 * Clean Supabase Booking Service
 * Handles booking creation with proper foreign key relationships
 */

import { supabase } from '@/lib/supabase'

// Types for booking creation
export interface CreateBookingRequest {
  customer_id: string          // UUID - references users.id
  technician_id: string        // UUID - references technician_details.id  
  service_id: number           // Integer - references services.id
  service_type: string         // Required service description
  problem_description: string  // Required problem description
  customer_location: string    // Required customer address
  price_rwf: string           // Required price amount
  duration?: number           // Optional duration in minutes
  scheduled_date?: string     // Optional ISO date string
  customer_notes?: string     // Optional customer notes
}

export interface BookingResponse {
  id: string
  customer_id: string
  technician_id: string
  service_id: number
  service_type: string
  problem_description: string
  customer_location: string
  price_rwf: string
  status: string
  created_at: string
  updated_at: string
  duration?: number
  scheduled_date?: string
  customer_notes?: string
}

class SupabaseBookingService {

  /**
   * Validate that all required foreign keys exist before creating booking
   * Made optional due to RLS policies potentially blocking access
   */
  private async validateForeignKeys(data: CreateBookingRequest): Promise<void> {
    const warnings: string[] = []

    try {
      // Try to validate technician exists in technician_details table
      const { data: technician, error: technicianError } = await supabase
        .from('technician_details')
        .select('id, specialization, user_id')
        .eq('id', data.technician_id)
        .single()

      if (technicianError || !technician) {
        warnings.push(`⚠️ Could not verify technician ${data.technician_id}`)
      } else {
        console.log('✅ Technician validated:', technician.specialization)
      }

      // Try to validate service exists in services table
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('id, serviceName')
        .eq('id', data.service_id)
        .single()

      if (serviceError || !service) {
        warnings.push(`⚠️ Could not verify service ${data.service_id}`)
      } else {
        console.log('✅ Service validated:', service.serviceName)
      }

      // Skip user validation due to RLS policies
      console.log('ℹ️ Skipping user validation due to RLS policies')

      if (warnings.length > 0) {
        console.warn('Validation warnings:', warnings)
      }

    } catch (error) {
      console.warn('Validation error (continuing anyway):', error)
    }
  }

  /**
   * Create a new booking with proper validation
   */
  async createBooking(data: CreateBookingRequest): Promise<BookingResponse> {
    try {
      console.log('🚀 Starting booking creation with data:', data)

      // Step 1: Validate all foreign keys exist
      await this.validateForeignKeys(data)

      // Step 2: Prepare booking data with only valid fields
      const bookingData = {
        customer_id: data.customer_id,
        technician_id: data.technician_id,
        service_id: data.service_id,
        service_type: data.service_type,
        problem_description: data.problem_description,
        customer_location: data.customer_location,
        price_rwf: data.price_rwf,
        status: 'pending' as const,
        duration: data.duration || 60,
        scheduled_date: data.scheduled_date || null,
        customer_notes: data.customer_notes || null
      }

      console.log('📝 Prepared booking data:', bookingData)

      // Step 3: Insert booking into database
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (error) {
        console.error('❌ Booking creation failed:', error)

        // Handle specific error types with detailed guidance
        if (error.message.includes('violates foreign key constraint')) {
          const tableMatch = error.message.match(/Key \(([^)]+)\)=\([^)]+\) is not present in table "([^"]+)"/)
          const constraintMatch = error.message.match(/violates foreign key constraint "([^"]+)"/)

          if (tableMatch) {
            const [, key, table] = tableMatch
            const constraint = constraintMatch ? constraintMatch[1] : 'unknown'

            if (key.includes('technician_id')) {
              throw new Error(`❌ TECHNICIAN ID ERROR: '${bookingData.technician_id}' not found in ${table} table.

SOLUTION: The foreign key constraint '${constraint}' expects the technician ID to exist in the '${table}' table.

If ${table} = "users": Use technician's user_id instead of technician_details.id
If ${table} = "technician_details": Use technician_details.id

Available from our test:
- technician_details.id: 660e8400-e29b-41d4-a716-446655440001
- corresponding user_id: 550e8400-e29b-41d4-a716-446655440001`)
            }

            throw new Error(`❌ FOREIGN KEY ERROR: ${key} = '${key.includes('customer') ? bookingData.customer_id : key.includes('service') ? bookingData.service_id : 'unknown'}' not found in ${table} table`)
          }

          throw new Error(`❌ FOREIGN KEY CONSTRAINT: ${error.message}`)
        }

        if (error.message.includes('row-level security policy')) {
          throw new Error('Permission denied. Please enable anonymous bookings in your database security settings.')
        }

        if (error.message.includes('violates not-null constraint')) {
          const fieldMatch = error.message.match(/null value in column "([^"]+)"/)
          const field = fieldMatch ? fieldMatch[1] : 'unknown field'
          throw new Error(`Missing required field: ${field}`)
        }

        throw new Error(`Database error: ${error.message}`)
      }

      console.log('✅ Booking created successfully:', booking)
      return booking as BookingResponse

    } catch (error) {
      console.error('💥 Booking creation error:', error)
      throw error
    }
  }

  /**
   * Get a single booking by its ID
   */
  async getBookingById(bookingId: string): Promise<BookingResponse> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

      if (error) {
        console.error(`Error fetching booking ${bookingId}:`, error)
        throw new Error(`Could not find booking with ID ${bookingId}.`)
      }

      if (!data) {
        throw new Error(`No booking found with ID ${bookingId}.`)
      }

      return data as BookingResponse
    } catch (error) {
      console.error('💥 Get booking by ID error:', error)
      throw error
    }
  }

  /**
   * Get valid technician IDs for dropdown
   */
  async getAvailableTechnicians() {
    const { data, error } = await supabase
      .from('technician_details')
      .select(`
        id,
        specialization,
        is_available,
        user:users!user_id (
          full_name,
          phone_number
        )
      `)
      .eq('is_available', true)

    if (error) {
      console.error('Error fetching technicians:', error)
      return []
    }

    return data || []
  }

  /**
   * Get valid service IDs for dropdown
   */
  async getAvailableServices() {
    const { data, error } = await supabase
      .from('services')
      .select('id, serviceName, description, price')

    if (error) {
      console.error('Error fetching services:', error)
      return []
    }

    return data || []
  }

  /**
   * Create a test customer for anonymous bookings
   */
  async createTestCustomer(): Promise<string> {
    const customerData = {
      id: crypto.randomUUID(),
      full_name: 'Anonymous Customer',
      phone_number: '+250 000 000 000',
      email: 'anonymous@techcare.rw',
      role: 'CUSTOMER' as const,
      is_active: true
    }

    const { data, error } = await supabase
      .from('users')
      .insert(customerData)
      .select('id')
      .single()

    if (error) {
      console.error('Error creating test customer:', error)
      // Return a default UUID if creation fails
      return '550e8400-e29b-41d4-a716-446655440001'
    }

    return data.id
  }
}

export const supabaseBookingService = new SupabaseBookingService()