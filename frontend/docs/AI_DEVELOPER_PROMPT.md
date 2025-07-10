# 🤖 AI Developer Continuation Prompt

## **Context**
You're taking over development of **TechCare Rwanda**, a tech support booking platform. The previous AI developer completed **Week 1 (Map Integration)** of a 4-week roadmap. 

## **Current State**
- ✅ **Google Places API integration** - real Kigali computer shops (API keys in .env.local)
- ✅ **Interactive map system** - professional Google Maps with business markers  
- ✅ **Search results redesign** - real business cards vs fake technician data
- ✅ **Booking frontend UI** - works at http://localhost:3001/dashboard/book/mock_1
- ❌ **Booking backend** - not connected/working yet

## **Your Mission: Backend Integration & GitHub Issues**

**MANDATORY FIRST STEP:** Check GitHub backlog using MCP before ANY coding!

**Required Workflow:**
```bash
# 1. Check issues first (REQUIRED)
mcp_GitHub_list_issues --owner Tech-Care-Rwanda --repo tech-care

# 2. Get user approval for approach
# 3. Work issue by issue systematically  
# 4. Clear entire GitHub backlog
```

**Backend Focus:**
```typescript
// Frontend exists, backend needs:
POST /api/bookings        // Booking endpoints
JPA booking models        // Database entities
Email/SMS notifications   // Spring Boot integration
```

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui, Google Maps API

## **Key Files to Review First**
- `frontend/docs/MAP_INTEGRATION_SPEC.md` - Full technical specs
- `frontend/src/lib/services/googlePlaces.ts` - API service 
- `frontend/src/app/search-results/page.tsx` - Current UI
- `frontend/docs/DEVELOPER_HANDOFF.md` - Complete handoff guide

## **Critical Notes**
- **FIRST ACTION: Check GitHub issues** - Use MCP tools before starting
- **Don't touch map integration** - it's stable and working  
- **Frontend booking works** - Test at http://localhost:3001/dashboard/book/mock_1
- **Backend integration focus** - Make booking submissions actually work
- **Issue-driven development** - Clear GitHub backlog systematically

**App runs with:** `cd frontend && npm run dev` (frontend) + Java backend

**Goal:** Clear all GitHub issues and get booking backend working! 🎯 