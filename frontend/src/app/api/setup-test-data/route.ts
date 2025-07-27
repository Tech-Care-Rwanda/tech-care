/**
 * Setup Test Data Endpoint
 * Creates the missing users that technicians reference
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Setting up test data...')

    // Test technician data to populate the database
    const testTechnicians = [
      {
        user: {
          full_name: 'John Mugisha',
          email: 'john.mugisha@techcare.rw',
          phone_number: '+250788123456',
          role: 'TECHNICIAN',
          is_active: true
        },
        details: {
          specialization: 'Computer Repair',
          experience: '5+ years',
          is_available: true
        }
      },
      {
        user: {
          full_name: 'Sarah Uwimana',
          email: 'sarah.uwimana@techcare.rw',
          phone_number: '+250788123457',
          role: 'TECHNICIAN',
          is_active: true
        },
        details: {
          specialization: 'Phone Repair',
          experience: '3+ years',
          is_available: true
        }
      },
      {
        user: {
          full_name: 'David Nkurunziza',
          email: 'david.nkurunziza@techcare.rw',
          phone_number: '+250788123458',
          role: 'TECHNICIAN',
          is_active: true
        },
        details: {
          specialization: 'Network Setup',
          experience: '6+ years',
          is_available: true
        }
      },
      {
        user: {
          full_name: 'Alice Mukamana',
          email: 'alice.mukamana@techcare.rw',
          phone_number: '+250788123459',
          role: 'TECHNICIAN',
          is_active: true
        },
        details: {
          specialization: 'Laptop Repair',
          experience: '4+ years',
          is_available: true
        }
      },
      {
        user: {
          full_name: 'Eric Habimana',
          email: 'eric.habimana@techcare.rw',
          phone_number: '+250788123460',
          role: 'TECHNICIAN',
          is_active: true
        },
        details: {
          specialization: 'iPhone Repair',
          experience: '2+ years',
          is_available: true
        }
      }
    ]

    const results = []

    for (const techData of testTechnicians) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', techData.user.email)
          .single()

        let userId: string

        if (existingUser) {
          console.log(`✅ User already exists: ${techData.user.email}`)
          userId = existingUser.id
        } else {
          // Create user
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert(techData.user)
            .select('id')
            .single()

          if (userError) {
            console.error(`❌ Error creating user ${techData.user.email}:`, userError)
            results.push({ email: techData.user.email, status: 'user_error', error: userError.message })
            continue
          }

          userId = newUser.id
          console.log(`✅ Created user: ${techData.user.email} with ID: ${userId}`)
        }

        // Check if technician details already exist
        const { data: existingDetails } = await supabase
          .from('technician_details')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (existingDetails) {
          console.log(`✅ Technician details already exist for user: ${techData.user.email}`)
          results.push({ email: techData.user.email, status: 'already_exists', userId })
        } else {
          // Create technician details
          const { data: newDetails, error: detailsError } = await supabase
            .from('technician_details')
            .insert({
              user_id: userId,
              ...techData.details
            })
            .select('id')
            .single()

          if (detailsError) {
            console.error(`❌ Error creating technician details for ${techData.user.email}:`, detailsError)
            results.push({ email: techData.user.email, status: 'details_error', error: detailsError.message })
            continue
          }

          console.log(`✅ Created technician details for: ${techData.user.email}`)
          results.push({ email: techData.user.email, status: 'created', userId, detailsId: newDetails.id })
        }

      } catch (err) {
        console.error(`💥 Critical error processing ${techData.user.email}:`, err)
        results.push({
          email: techData.user.email,
          status: 'critical_error',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }

    // Summary
    const created = results.filter(r => r.status === 'created').length
    const existing = results.filter(r => r.status === 'already_exists').length
    const errors = results.filter(r => r.status.includes('error')).length

    console.log(`🎯 Test data setup complete: ${created} created, ${existing} already existed, ${errors} errors`)

    return NextResponse.json({
      success: true,
      message: 'Test technician data setup completed',
      summary: {
        created,
        existing,
        errors
      },
      details: results
    })

  } catch (error) {
    console.error('💥 Critical error in test data setup:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to setup test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}