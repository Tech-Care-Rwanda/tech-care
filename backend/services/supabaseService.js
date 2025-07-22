const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

class SupabaseService {
  constructor() {
    this.supabase = supabase;
  }

  // User operations
  async createUser(userData) {
    const { data, error } = await this.supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async getUserByEmail(email) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  }

  async getUserById(id) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Technician operations
  async createTechnicianDetails(technicianData) {
    const { data, error } = await this.supabase
      .from('technician_details')
      .insert(technicianData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async getTechnicians(filters = {}) {
    let query = this.supabase
      .from('technician_details')
      .select(`
        *,
        user:users(*)
      `);

    if (filters.approved) {
      query = query.eq('approvalStatus', 'APPROVED');
    }

    if (filters.available) {
      query = query.eq('isAvailable', true);
    }

    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  }

  async getTechnicianById(id) {
    const { data, error } = await this.supabase
      .from('technician_details')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateTechnicianLocation(technicianId, latitude, longitude, address) {
    const { data, error } = await this.supabase
      .from('technician_details')
      .update({
        latitude,
        longitude,
        address,
        lastLocationUpdate: new Date().toISOString()
      })
      .eq('id', technicianId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Category operations
  async getCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('isActive', true);
    
    if (error) throw new Error(error.message);
    return data;
  }

  async createCategory(categoryData) {
    const { data, error } = await this.supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Service operations
  async getServices(categoryId = null) {
    let query = this.supabase
      .from('services')
      .select(`
        *,
        category:categories(*)
      `);

    if (categoryId) {
      query = query.eq('categoryId', categoryId);
    }

    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data;
  }

  async createService(serviceData) {
    const { data, error } = await this.supabase
      .from('services')
      .insert(serviceData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Booking operations
  async createBooking(bookingData) {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async getBookingsByCustomer(customerId) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        technician:technician_details(*),
        service:services(*),
        customer:users(*)
      `)
      .eq('customerId', customerId);
    
    if (error) throw new Error(error.message);
    return data;
  }

  async getBookingsByTechnician(technicianId) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        customer:users(*),
        service:services(*),
        technician:technician_details(*)
      `)
      .eq('technicianId', technicianId);
    
    if (error) throw new Error(error.message);
    return data;
  }

  async updateBookingStatus(bookingId, status, notes = null) {
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (notes) {
      updateData.technicianNotes = notes;
    }

    if (status === 'CONFIRMED') {
      updateData.confirmedAt = new Date().toISOString();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date().toISOString();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date().toISOString();
    }

    const { data, error } = await this.supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Health check
  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);
      
      return { connected: !error, error: error?.message };
    } catch (err) {
      return { connected: false, error: err.message };
    }
  }
}

module.exports = new SupabaseService();