const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const AutheticationRoutes = require('./routes/AutheticationRoutes');
const CustomerRoutes = require('./routes/CustomerRoutes')
const AdminRoutes = require('./routes/AdminRoutes')
const BookingRoutes = require('./routes/BookingRoutes')
const TechnicianRoutes = require('./routes/TechnicianRoutes')
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cores configuration 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// All routes
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Serve password reset form
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Serve login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve forgot password form
app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forgot-password.html'));
});

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Set up routes
app.use('/api/v1/auth', AutheticationRoutes);
app.use('/api/v1/customer',  CustomerRoutes);
app.use('/api/v1/admin', AdminRoutes);
app.use('/api/v1/bookings', BookingRoutes);
app.use('/api/v1/technicians', TechnicianRoutes);

// Health check route
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'OK', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'Error', database: 'Disconnected', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// database  connection 
prisma.$connect().then(() => {
  console.log('Database connected successfully');
}).catch(error => {
  console.error('Database connection failed:', error);
})