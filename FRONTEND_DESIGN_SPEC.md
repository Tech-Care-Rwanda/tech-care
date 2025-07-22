# TechCare MVP - Frontend Design Specification

**Version:** 1.0  
**Last Updated:** January 2025  
**Purpose:** Comprehensive design guidelines for TechCare frontend development

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Navigation System](#navigation-system)
3. [Mobile-First Responsive Design](#mobile-first-responsive-design)
4. [Page Structure & Layout](#page-structure--layout)
5. [Component Architecture](#component-architecture)
6. [Design Patterns](#design-patterns)
7. [UI/UX Guidelines](#uiux-guidelines)
8. [Technical Specifications](#technical-specifications)
9. [Code Conventions](#code-conventions)
10. [Implementation Checklist](#implementation-checklist)

---

## 🎯 Overview

### Project Goals
- **Primary Goal:** Simple, fast technician booking experience
- **Target Users:** Customers needing tech support in Kigali, Rwanda
- **Device Priority:** Mobile-first, desktop-enhanced
- **Core Actions:** Find technicians, book services, manage appointments

### Design Philosophy
- **Simplicity First:** Minimize clicks, maximize clarity
- **Mobile-First:** 80% of users on mobile devices
- **Accessibility:** WCAG 2.1 AA compliance
- **Performance:** < 3s load time, < 1s navigation

---

## 🧭 Navigation System

### Unified Navigation Bar
**Location:** Fixed top navigation on all pages  
**Behavior:** Always visible, responsive collapse on mobile

```tsx
// Navigation Structure
<nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Left: Logo + Primary Navigation */}
      <div className="flex items-center space-x-8">
        <Logo />
        <PrimaryNav /> {/* Desktop only */}
      </div>
      
      {/* Center: Search (Desktop) */}
      <SearchBar className="hidden md:block" />
      
      {/* Right: User Actions */}
      <UserActions />
      
      {/* Mobile Menu Toggle */}
      <MobileMenuToggle className="md:hidden" />
    </div>
  </div>
  
  {/* Mobile Navigation Overlay */}
  <MobileNavOverlay />
</nav>
```

### Navigation Items

#### **Desktop Navigation (Always Visible)**
```
┌─ TechCare Logo ─┬─ Find Technicians ─┬─ [Search Bar] ─┬─ My Bookings (2) ─┬─ [Profile Avatar] ─┐
│                 │ (Current page)      │               │                   │                    │
```

#### **Mobile Navigation (Hamburger Menu)**
```
☰ Menu:
├─ 🏠 Find Technicians
├─ 📋 My Bookings (2)
├─ 👤 Profile  
├─ 📞 Emergency: +250791995143
├─ ❓ Help & Support
└─ 🚪 Logout
```

### Navigation States
- **Active Page:** Bold text + colored underline
- **Booking Badge:** Red notification dot for pending bookings
- **Profile Avatar:** Shows user initial or photo
- **Mobile Breakpoint:** < 768px shows hamburger menu

---

## 📱 Mobile-First Responsive Design

### Breakpoint Strategy
```css
/* Mobile First Approach */
.container {
  /* Base: Mobile styles (320px+) */
  padding: 1rem;
  
  /* Small Mobile (375px+) */
  @screen sm {
    padding: 1.5rem;
  }
  
  /* Tablet (768px+) */
  @screen md {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 300px;
  }
  
  /* Desktop (1024px+) */
  @screen lg {
    padding: 3rem;
    max-width: 7xl;
    margin: 0 auto;
  }
  
  /* Large Desktop (1280px+) */
  @screen xl {
    grid-template-columns: 1fr 400px;
  }
}
```

### Mobile-Specific Components

#### **Mobile Map Interface**
```
┌─ Navigation (Fixed Top) ──────────────┐
├─ Search Bar ─────────────────────────┤
├─ Map View (60% height) ──────────────┤
│  └─ Floating "List View" Button      │
├─ Quick Actions (Sticky) ─────────────┤
│  [Emergency Call] [Filter] [List]    │
├─ Technician Cards (Swipeable) ──────┤  
│  ┌─ Card 1 ─┐ ┌─ Card 2 ─┐          │
│  └─────────┘ └─────────┘            │
└─ Bottom Tab Bar (iOS Style) ────────┘
```

#### **Mobile Booking Flow**
```
┌─ Booking Modal (Full Screen) ────────┐
│ ← Back          Book John D.    [×]  │
├─────────────────────────────────────┤
│ 👤 John Doe - Computer Repair       │
│ ⭐ 4.8 • 2.3km away • Available     │
├─────────────────────────────────────┤
│ Service Type:                       │
│ ┌─ Computer Repair (Selected) ──────┐│
│ └─ Laptop • Phone • Network ───────┘│
├─────────────────────────────────────┤
│ Describe the Problem:               │
│ ┌─ Text Area ────────────────────────┐│
│ │ My laptop won't start up...       ││
│ └───────────────────────────────────┘│
├─────────────────────────────────────┤
│ When:                               │
│ ● Now  ○ Today  ○ Tomorrow          │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Book & Call (+250791995143) ────┐ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Responsive Layout Patterns

#### **Homepage Layout**
```css
/* Mobile: Stack vertically */
.homepage-mobile {
  display: flex;
  flex-direction: column;
}

.map-section { height: 60vh; }
.sidebar-section { 
  height: 40vh; 
  overflow-y: scroll;
}

/* Desktop: Side by side */
.homepage-desktop {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  height: calc(100vh - 4rem);
}
```

#### **Touch-Friendly Interactions**
- **Button Size:** Minimum 44px (iOS guidelines)  
- **Touch Targets:** 8px spacing between clickable elements
- **Swipe Gestures:** Horizontal scroll for technician cards
- **Pull-to-Refresh:** On booking lists and map data

---

## 📐 Page Structure & Layout

### Page Hierarchy
```
/
├─ layout.tsx (Root Layout)
│  ├─ Navigation Component
│  ├─ Toast Notifications  
│  └─ Auth Provider
│
├─ page.tsx (Homepage - Find Technicians)
│  ├─ Map Component (Primary)
│  ├─ Technician Sidebar (Secondary)
│  └─ Quick Booking Modal
│
├─ dashboard/
│  └─ page.tsx (Bookings Management)
│     ├─ Booking List
│     ├─ Communication Panel
│     └─ Quick Actions
│
├─ login/page.tsx (Authentication)
└─ signup/page.tsx (Registration)
```

### Layout Components Structure

#### **Root Layout Template**
```tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            {/* Fixed Navigation */}
            <NavigationBar />
            
            {/* Main Content Area */}
            <main className="flex-1 pt-16">
              {children}
            </main>
            
            {/* Mobile Bottom Navigation (when needed) */}
            <MobileBottomNav className="md:hidden" />
          </div>
          
          {/* Global Components */}
          <ToastProvider />
          <ModalProvider />
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## 🏗️ Component Architecture

### Component Hierarchy
```
src/components/
├─ layout/
│  ├─ NavigationBar.tsx
│  ├─ MobileBottomNav.tsx
│  └─ PageLayout.tsx
│
├─ map/
│  ├─ TechnicianMap.tsx
│  ├─ MapMarker.tsx
│  └─ MapControls.tsx
│
├─ booking/
│  ├─ BookingModal.tsx
│  ├─ BookingCard.tsx
│  └─ QuickBookButton.tsx
│
├─ technician/
│  ├─ TechnicianCard.tsx
│  ├─ TechnicianList.tsx
│  └─ TechnicianProfile.tsx
│
├─ ui/ (shadcn/ui components)
│  ├─ button.tsx
│  ├─ card.tsx
│  ├─ modal.tsx
│  └─ ...
│
└─ shared/
   ├─ LoadingSpinner.tsx
   ├─ ErrorBoundary.tsx
   └─ EmptyState.tsx
```

### Component Design Patterns

#### **Container-Presentational Pattern**
```tsx
// Container Component (Logic)
export function TechnicianListContainer() {
  const { technicians, loading } = useTechnicians()
  
  if (loading) return <LoadingSpinner />
  
  return (
    <TechnicianListPresentation 
      technicians={technicians}
      onBooking={handleBooking}
    />
  )
}

// Presentational Component (UI)
export function TechnicianListPresentation({ technicians, onBooking }) {
  return (
    <div className="space-y-4">
      {technicians.map(tech => (
        <TechnicianCard 
          key={tech.id}
          technician={tech}
          onBook={() => onBooking(tech.id)}
        />
      ))}
    </div>
  )
}
```

#### **Compound Component Pattern**
```tsx
// BookingModal compound component
export const BookingModal = {
  Root: BookingModalRoot,
  Header: BookingModalHeader,
  Content: BookingModalContent,
  Actions: BookingModalActions,
}

// Usage
<BookingModal.Root open={isOpen}>
  <BookingModal.Header>
    <h2>Book {technician.name}</h2>
  </BookingModal.Header>
  <BookingModal.Content>
    <ServiceSelector />
    <ProblemDescription />
  </BookingModal.Content>
  <BookingModal.Actions>
    <Button>Book Now</Button>
  </BookingModal.Actions>
</BookingModal.Root>
```

---

## 🎨 Design Patterns

### Color System
```css
:root {
  /* Primary Brand Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;  /* Main brand blue */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  /* Status Colors */
  --success: #10b981;      /* Available/confirmed */
  --warning: #f59e0b;      /* Pending */
  --error: #ef4444;        /* Urgent/cancelled */
  
  /* Neutral Colors */
  --gray-50: #f9fafb;      /* Background */
  --gray-100: #f3f4f6;     /* Card backgrounds */
  --gray-500: #6b7280;     /* Text secondary */
  --gray-900: #111827;     /* Text primary */
}
```

### Typography Scale
```css
/* Font System */
.text-display {     /* Page titles */
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 2.5rem;
}

.text-heading {     /* Section titles */  
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
}

.text-body {        /* Main content */
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
}

.text-caption {     /* Helper text */
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
}
```

### Spacing System
```css
/* Consistent spacing using Tailwind scale */
.space-xs { margin: 0.25rem; }    /* 4px */
.space-sm { margin: 0.5rem; }     /* 8px */
.space-md { margin: 1rem; }       /* 16px */
.space-lg { margin: 1.5rem; }     /* 24px */
.space-xl { margin: 2rem; }       /* 32px */
.space-2xl { margin: 3rem; }      /* 48px */
```

### Component States
```tsx
// Button state variants
const buttonVariants = {
  default: "bg-primary-500 hover:bg-primary-600 text-white",
  outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
  ghost: "hover:bg-gray-100 text-gray-700",
  destructive: "bg-red-500 hover:bg-red-600 text-white",
}

// Loading states
const LoadingState = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
)
```

---

## 🎭 UI/UX Guidelines

### Interaction Principles

#### **Feedback & Confirmation**
- **Immediate Feedback:** Button states change on click
- **Progress Indicators:** Show loading for actions > 1 second  
- **Success Messages:** Toast notifications for completed actions
- **Error Handling:** Clear, actionable error messages

#### **Information Hierarchy**
```
Priority 1: Action buttons (Book Now, Call)
Priority 2: Technician name and rating  
Priority 3: Service type and distance
Priority 4: Additional details
```

#### **Touch & Click Targets**
```css
/* Minimum touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 0.5rem 1rem;
}

/* Button spacing */
.button-group {
  gap: 0.5rem;  /* 8px minimum between buttons */
}
```

### Accessibility Standards

#### **WCAG 2.1 AA Compliance**
- **Color Contrast:** 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation:** All interactive elements focusable
- **Screen Reader Support:** Proper ARIA labels and roles
- **Focus Indicators:** Visible focus rings on all interactive elements

```tsx
// Accessible component example
<button
  aria-label={`Book appointment with ${technician.name}`}
  className="focus:ring-2 focus:ring-primary-500 focus:outline-none"
>
  Book Now
</button>
```

---

## ⚙️ Technical Specifications

### Framework & Libraries
```json
{
  "framework": "Next.js 15.3.4",
  "ui": "shadcn/ui + Tailwind CSS",
  "state": "React Context + useState/useReducer",
  "forms": "React Hook Form + Zod validation",
  "maps": "Google Maps JavaScript API",
  "icons": "Lucide React",
  "animations": "Framer Motion (optional)"
}
```

### Performance Requirements
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s  
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3s
- **Bundle Size:** < 500KB initial load

### Browser Support
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **No IE Support:** Modern browsers only

---

## 📝 Code Conventions

### File Structure
```
src/
├─ app/                    # Next.js App Router
├─ components/             # React components
├─ lib/                    # Utilities & services
│  ├─ hooks/              # Custom React hooks
│  ├─ services/           # API services  
│  ├─ utils/              # Helper functions
│  └─ contexts/           # React contexts
├─ types/                  # TypeScript type definitions
└─ styles/                 # Global styles
```

### Naming Conventions
```tsx
// Components: PascalCase
export const TechnicianCard = () => {}

// Hooks: camelCase with 'use' prefix
export const useTechnicians = () => {}

// Constants: SCREAMING_SNAKE_CASE
export const API_ENDPOINTS = {}

// Variables: camelCase
const technicianList = []

// CSS Classes: kebab-case (Tailwind)
className="technician-card bg-white"
```

### Component Structure Template
```tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useTechnicians } from '@/lib/hooks/useTechnicians'
import type { Technician } from '@/types/technician'

interface TechnicianCardProps {
  technician: Technician
  onBook: (id: string) => void
  className?: string
}

export function TechnicianCard({ 
  technician, 
  onBook, 
  className = "" 
}: TechnicianCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleBooking = async () => {
    setIsLoading(true)
    try {
      await onBook(technician.id)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <h3 className="font-semibold text-gray-900">
        {technician.name}
      </h3>
      
      <Button 
        onClick={handleBooking}
        disabled={isLoading}
        className="w-full mt-3"
      >
        {isLoading ? 'Booking...' : 'Book Now'}
      </Button>
    </div>
  )
}

// Export type for external use
export type { TechnicianCardProps }
```

---

## ✅ Implementation Checklist

### Phase 1: Core Structure
- [ ] Create unified navigation component
- [ ] Implement mobile-first responsive layouts
- [ ] Set up consistent color and typography system
- [ ] Create base component templates

### Phase 2: Homepage Implementation  
- [ ] Build interactive map component
- [ ] Create technician card/list components
- [ ] Implement booking modal with simple flow
- [ ] Add search and filter functionality

### Phase 3: Dashboard Implementation
- [ ] Create booking management interface
- [ ] Implement communication features (+250791995143)
- [ ] Add profile management section
- [ ] Build notification system

### Phase 4: Mobile Optimization
- [ ] Test all components on mobile devices
- [ ] Implement touch-friendly interactions
- [ ] Add mobile-specific features (bottom nav, swipe gestures)
- [ ] Optimize performance for mobile networks

### Phase 5: Testing & Polish
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Performance optimization  
- [ ] User acceptance testing

---

## 📞 Contact & Support

**Emergency Contact Integration:**  
All Call/Message buttons should use: **+250791995143**

```tsx
// Standard implementation
const EMERGENCY_NUMBER = "+250791995143"

const handleCall = () => {
  window.open(`tel:${EMERGENCY_NUMBER}`)
}

const handleMessage = () => {
  window.open(`sms:${EMERGENCY_NUMBER}?body=Hi, I need technical support...`)
}
```

---

**Document Version:** 1.0  
**For Questions:** Share this document with any frontend developer joining the project  
**Next Review:** After Phase 1 implementation
