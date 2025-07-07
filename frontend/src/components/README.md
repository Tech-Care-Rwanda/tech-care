# TechCare Rwanda UI Foundation

This directory contains the core UI components and layout system for TechCare Rwanda, built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## 🎨 Design System

### Colors
- **Primary**: TechCare Blue (#0ea5e9) - Main brand color
- **Secondary**: Rwanda Yellow (#eab308) - Accent color  
- **Accent**: Rwanda Green (#22c55e) - Success states
- **Rwanda Gradient**: Special button variant using all flag colors

### Typography
- **Fonts**: Geist Sans and Geist Mono
- **Mobile-first**: Touch targets minimum 44px
- **Text scaling**: Automatic adjustment for different languages

## 📱 Layout Components

### Layout (`layout/layout.tsx`)
Main page wrapper with header and footer.

```tsx
import { Layout, PageWrapper } from "@/components/layout"

export default function MyPage() {
  return (
    <Layout userType="customer" containerSize="xl">
      <PageWrapper title="Page Title" description="Page description">
        {/* Page content */}
      </PageWrapper>
    </Layout>
  )
}
```

**Props:**
- `userType`: `"customer" | "technician" | "admin" | null`
- `showHeader`: boolean (default: true)
- `showFooter`: boolean (default: true)
- `containerSize`: `"sm" | "md" | "lg" | "xl" | "full"`

### Header (`layout/header.tsx`)
Responsive navigation with authentication states.

**Features:**
- Dynamic navigation based on user type
- Mobile-responsive with overlay menu
- Language switcher
- User avatar and notifications
- Authentication-aware button states

### Footer (`layout/footer.tsx`)
Site footer with Rwanda-specific information.

**Features:**
- Company info and contact details
- Service category links
- Social media links
- Legal links and language switcher

### DashboardLayout (`layout/dashboard-layout.tsx`)
Specialized layout for authenticated users.

```tsx
import { DashboardLayout, StatsCard } from "@/components/layout"

export default function Dashboard() {
  return (
    <DashboardLayout 
      userType="customer"
      userInfo={{ name: "John Doe", email: "john@example.com" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Bookings" 
          value={2} 
          icon={Calendar}
        />
      </div>
    </DashboardLayout>
  )
}
```

## 🧩 UI Components

### Button (`ui/button.tsx`)
Enhanced button with TechCare-specific variants.

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default" size="lg">Default Button</Button>
<Button variant="rwanda" size="xl">Rwanda Flag Colors</Button>
<Button variant="outline" size="touch">Mobile Optimized</Button>
```

**Variants:**
- `default`, `destructive`, `outline`, `secondary`, `accent`, `ghost`, `link`
- `rwanda`: Special gradient using Rwanda flag colors

**Sizes:**
- `default`, `sm`, `lg`, `xl`, `icon`
- `touch`: Mobile-optimized 44px minimum

### Card (`ui/card.tsx`)
Flexible card component for content sections.

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Service Name</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Service description...</p>
  </CardContent>
</Card>
```

### LanguageSwitcher (`ui/language-switcher.tsx`)
Multi-language support for Kinyarwanda, English, and French.

```tsx
import { LanguageSwitcher, useLanguage } from "@/components/ui/language-switcher"

// Hook usage
const { language, changeLanguage } = useLanguage()

// Component usage
<LanguageSwitcher 
  variant="dropdown" 
  onLanguageChange={(lang) => console.log(lang)}
/>
```

**Variants:**
- `dropdown`: Select dropdown (default)
- `inline`: Flag buttons
- `button`: Cycling button

## 🌍 Rwanda-Specific Features

### Language Support
- **Kinyarwanda**: Primary local language
- **English**: International communication
- **French**: Official language
- Automatic text scaling for different languages

### Mobile-First Design
- Touch targets: 44px minimum
- Responsive breakpoints optimized for mobile devices
- Rwanda mobile market considerations

### Service Categories
```tsx
import { serviceCategories } from "@/lib/utils"

// Available services
serviceCategories.forEach(service => {
  console.log(service.name, service.icon)
})
```

### Phone Number Formatting
```tsx
import { formatRwandaPhone } from "@/lib/utils"

const phone = formatRwandaPhone("788123456")
// Returns: "+250788123456"
```

## 🛠 Utilities

### CSS Classes
```tsx
// Mobile touch targets
<button className="touch-target">Mobile Button</button>

// Text balance for better typography
<h1 className="text-balance">Balanced Headlines</h1>
```

### Helper Functions
```tsx
import { cn, isMobileScreen, getTextScale } from "@/lib/utils"

// Combine classes
const classes = cn("base-class", condition && "conditional-class")

// Mobile detection
if (isMobileScreen()) {
  // Mobile-specific logic
}

// Language text scaling
const scale = getTextScale("rw") // Returns 1.2 for Kinyarwanda
```

## 🎯 Usage Examples

### Guest Landing Page
```tsx
import { Layout, PageWrapper } from "@/components/layout"

export default function Home() {
  return (
    <Layout userType={null}>
      <PageWrapper title="Welcome to TechCare">
        {/* Landing page content */}
      </PageWrapper>
    </Layout>
  )
}
```

### Customer Dashboard
```tsx
import { DashboardLayout, dashboardStats } from "@/components/layout"

export default function CustomerDashboard() {
  return (
    <DashboardLayout userType="customer">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardStats.customer.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </DashboardLayout>
  )
}
```

### Technician Profile
```tsx
import { Layout } from "@/components/layout"
import { Card, Button } from "@/components/ui"

export default function TechnicianProfile() {
  return (
    <Layout userType="technician" containerSize="lg">
      <Card>
        <CardContent>
          <Button variant="rwanda" size="xl">
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </Layout>
  )
}
```

## 🔧 Development Notes

### Theme Customization
Colors and spacing are defined in `tailwind.config.ts`. The design system uses CSS custom properties for consistency.

### Responsive Design
- Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- Special `mobile:` (360px) and `xs:` (475px) breakpoints for Rwanda market
- Touch-friendly sizing with `touch` size variants

### Accessibility
- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

### Performance
- Client-side language switching with localStorage persistence
- Lazy loading for complex components
- Optimized bundle size with tree shaking

---

**Built for Rwanda's Digital Transformation** 🇷🇼 