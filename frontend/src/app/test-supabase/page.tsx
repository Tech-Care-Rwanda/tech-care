"use client"

import { useState } from 'react'
import { testSupabaseConnection, supabaseService, supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function TestSupabasePage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, result: any) => {
    setResults(prev => [...prev, { test, result, timestamp: new Date().toISOString() }])
  }

  const runTests = async () => {
    setLoading(true)
    setResults([])

    try {
      // Test 1: Basic connection
      console.log('Running basic connection test...')
      const connectionTest = await testSupabaseConnection()
      addResult('Basic Connection', connectionTest)

      // Test 2: Environment variables
      const envTest = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length,
        supabaseKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length
      }
      addResult('Environment Variables', envTest)

      // Test 3: Try to get technicians
      try {
        console.log('Testing getTechnicians...')
        const technicians = await supabaseService.getTechnicians()
        addResult('Get Technicians', { success: true, count: technicians.length, data: technicians })
      } catch (error) {
        addResult('Get Technicians', { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          fullError: error
        })
      }

      // Test 4: Try to get a specific technician using actual UUID
      try {
        console.log('Testing getTechnicianById...')
        const technician = await supabaseService.getTechnicianById('660e8400-e29b-41d4-a716-446655440001')
        addResult('Get Technician By ID', { success: true, data: technician })
      } catch (error) {
        addResult('Get Technician By ID', { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          fullError: error
        })
      }

      // Test 5: Check bookings table structure
      try {
        console.log('Testing bookings table access...')
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .limit(1)
        
        addResult('Bookings Table Access', { 
          success: !error, 
          data: data, 
          error: error?.message,
          tableColumns: data?.[0] ? Object.keys(data[0]) : [],
          isEmpty: data?.length === 0
        })
      } catch (error) {
        addResult('Bookings Table Access', { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          fullError: error
        })
      }

      // Test 6: Try to create a simple booking to see what fails
      try {
        console.log('Testing booking creation with minimal data...')
        const testBooking = {
          customer_id: '550e8400-e29b-41d4-a716-446655440001',
          technician_id: '660e8400-e29b-41d4-a716-446655440001',
          service_id: 1, // Integer for service ID
          duration: 60,
          total_price: '5000',
          status: 'CONFIRMED',
          customer_notes: 'Test booking'
        }
        
        const { data, error } = await supabase
          .from('bookings')
          .insert(testBooking)
          .select()
          .single()
        
        if (error) {
          addResult('Test Booking Creation', { 
            success: false, 
            error: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            testData: testBooking
          })
        } else {
          addResult('Test Booking Creation', { 
            success: true, 
            data: data,
            message: 'Booking created successfully!'
          })
        }
      } catch (error) {
        addResult('Test Booking Creation', { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          fullError: error
        })
      }

    } catch (error) {
      addResult('Test Suite Error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        fullError: error
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
        
        <Card className="p-6 mb-6">
          <Button onClick={runTests} disabled={loading} className="mb-4">
            {loading ? 'Running Tests...' : 'Run Supabase Tests'}
          </Button>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold text-lg mb-2">{result.test}</h3>
                <p className="text-sm text-gray-500 mb-2">{result.timestamp}</p>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}