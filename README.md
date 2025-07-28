# Tech-Care Platform

> **Connect customers with qualified technicians through a streamlined booking system**

[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-Next.js%2015%20%7C%20React%2019%20%7C%20TypeScript%20%7C%20Supabase-blue)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](https://github.com/Tech-Care-Rwanda/tech-care)

Tech-Care is a comprehensive platform designed to bridge the gap between customers seeking technical services and qualified technicians in Rwanda. Our platform provides a stable, end-to-end experience where customers can easily find, view, and book technicians, while providing technicians with effective tools to manage their bookings and profiles.

[![Tech-Care Platform Demo](https://img.youtube.com/vi/lTIZ2oLgR8A/maxresdefault.jpg)](https://youtu.be/lTIZ2oLgR8A)

*Click above to watch our platform demo video*

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tech-Care-Rwanda/tech-care.git
   cd tech-care
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create `.env.local` in the frontend directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
   
   Create `.env` in the backend directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   PORT=3001
   ```

4. **Database Setup**
   
   Set up your Supabase database with the following tables:
   - `users` - Customer and technician profiles
   - `technician_details` - Extended technician information
   - `bookings` - Service bookings and requests
   - `services` - Available service types
   - `categories` - Service categories

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend server
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🏗️ Architecture

### System Overview

Tech-Care utilizes a modern monorepo architecture with clear separation between frontend and backend services.

```
tech-care/
├── frontend/          # Next.js 15 + React 19 application
│   ├── src/
│   │   ├── app/       # Next.js App Router pages
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/       # Utilities, services, and contexts
│   │   └── types/     # TypeScript type definitions
│   └── public/        # Static assets
├── backend/           # Express.js server
│   ├── services/      # Supabase integration services
│   ├── uploads/       # File upload storage
│   └── server.js      # Express server configuration
└── package.json       # Root package configuration
```

### Tech Stack

**Frontend**
- **Framework:** Next.js 15 with Turbopack
- **UI Library:** React 19 with TypeScript 5
- **Styling:** Tailwind CSS + Radix UI
- **Mapping:** Google Maps API + Leaflet
- **State Management:** React Context + Supabase client
- **Authentication:** Supabase Auth

**Backend**
- **Server:** Express.js (minimal)
- **Database:** Supabase (PostgreSQL)
- **File Upload:** Multer middleware
- **Security:** CORS + Helmet

**Database**
- **Provider:** Supabase
- **Type:** PostgreSQL with Row Level Security (RLS)
- **Features:** Real-time subscriptions, Auth integration

## 🎯 Features

### For Customers

- **🗺️ Interactive Map** - Find technicians on an interactive map with real-time locations
- **🔍 Smart Search** - Filter technicians by specialization, rating, and availability
- **👤 Detailed Profiles** - View comprehensive technician profiles with certifications
- **📅 Easy Booking** - Streamlined booking process with status tracking
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🔔 Real-time Updates** - Get instant notifications on booking status changes

### For Technicians

- **📊 Dashboard** - Comprehensive dashboard showing earnings and booking statistics
- **✅ Booking Management** - Accept or decline booking requests with one click
- **📝 Profile Management** - Update profile information, upload certificates
- **💰 Earnings Tracking** - Track monthly earnings and completed jobs
- **📸 Media Upload** - Upload profile pictures and certification documents
- **📍 Location Services** - Manage service areas and availability

### Platform Features

- **🔐 Role-based Authentication** - Separate customer and technician experiences
- **🛡️ Security** - Row Level Security policies and secure file uploads
- **⚡ Performance** - Optimized with Next.js 15 and Turbopack
- **📊 Analytics** - Built-in analytics for tracking platform usage
- **🌐 API-First** - RESTful API design for future mobile apps

## 📱 User Interface

### Customer Journey
1. **Browse Technicians** - View available technicians on interactive map
2. **Filter & Search** - Use filters to find the right technician
3. **View Profile** - Check technician details, ratings, and certifications
4. **Book Service** - Complete booking with service details
5. **Track Status** - Monitor booking progress in real-time

### Technician Journey
1. **Registration** - Sign up with professional details and certifications
2. **Profile Setup** - Complete profile with specializations and rates
3. **Receive Requests** - Get notified of new booking requests
4. **Manage Bookings** - Accept, decline, or update booking status
5. **Track Earnings** - Monitor income and performance metrics

## 🛠️ Development

### Project Structure

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── book/              # Booking pages
│   ├── dashboard/         # User dashboards
│   ├── technician/        # Technician profiles
│   └── layout.tsx         # Root layout
├── components/            # UI Components
│   ├── auth/              # Authentication components
│   ├── booking/           # Booking-related components
│   ├── layout/            # Layout components
│   ├── maps/              # Map components
│   └── ui/                # Base UI components
├── lib/                   # Utilities & Services
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── utils/             # Utility functions
└── types/                 # TypeScript definitions
```

### Available Scripts

**Frontend**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

**Backend**
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run build        # No-op build command
```

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Backend (.env)**
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=3001
```

## 🗄️ Database Schema

### Core Tables

**users**
- Stores both customers and technicians
- Includes authentication and basic profile info
- Role-based access control

**technician_details**
- Extended technician information
- Specializations, certifications, rates
- Availability and location data

**bookings**
- Service requests and bookings
- Status tracking and pricing
- Customer-technician relationships

**services & categories**
- Service type definitions
- Categorized service offerings

### Row Level Security (RLS)

All tables implement RLS policies ensuring:
- Users can only access their own data
- Technicians can view relevant booking information
- Anonymous users can browse technicians and create bookings

## 🚀 Deployment

### Supabase Setup

1. Create a new Supabase project
2. Run the database migrations
3. Configure RLS policies
4. Set up file storage buckets
5. Configure authentication providers

### Frontend Deployment (Vercel)

```bash
# Build and deploy to Vercel
npm run build
vercel --prod
```

### Backend Deployment (Railway/Render)

```bash
# Deploy backend to Railway or Render
railway up
# or
render deploy
```

## 🧪 Testing

### Running Tests

```bash
# Run frontend tests
cd frontend
npm test

# Run e2e tests (if configured)
npm run test:e2e
```

### Test Structure

- **Unit Tests** - Component and utility function tests
- **Integration Tests** - API endpoint and service tests
- **E2E Tests** - Full user workflow tests

## 📊 Performance

### Optimization Features

- **Next.js 15** - Latest optimizations and Turbopack
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic route-based code splitting
- **Bundle Analysis** - Built-in bundle analyzer
- **Caching** - Supabase query caching and React Query

### Performance Metrics

- **Lighthouse Score** - 90+ on all metrics
- **Core Web Vitals** - Excellent ratings
- **Bundle Size** - Optimized for fast loading

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (Prettier)
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **ChristianTonny** - Lead Developer & Architecture
- **devark28** - Frontend Specialist
- **Mbonyumugisha-Prince** - Full-Stack Developer
- **isamuella** - Quality Assurance

## 🆘 Support

If you have any questions or issues:

1. Check the [Issues](https://github.com/Tech-Care-Rwanda/tech-care/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🛣️ Roadmap

### Phase 1 - Current (Completed)
- ✅ User authentication and profiles
- ✅ Technician discovery and booking
- ✅ Interactive mapping
- ✅ Booking management

### Phase 2 - Next Release
- 🔄 Real-time messaging
- 🔄 Payment integration
- 🔄 Push notifications
- 🔄 Mobile app (React Native)

### Phase 3 - Future
- 🔮 AI-powered matching
- 🔮 Advanced analytics
- 🔮 Multi-language support
- 🔮 IoT device integration

## 📈 Analytics

The platform includes built-in analytics for:
- User engagement tracking
- Booking conversion rates
- Technician performance metrics
- Platform usage statistics

---

**Built with ❤️ in Rwanda**

For more information, visit our [GitHub repository](https://github.com/Tech-Care-Rwanda/tech-care) or watch our [demo video](https://youtu.be/lTIZ2oLgR8A).