'use client'

import { useEffect, useState } from 'react'

interface NoSSRProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

/**
 * Component that only renders children on the client side to prevent hydration mismatches
 * Useful for components that depend on browser-specific APIs or have server/client differences
 */
export function NoSSR({ children, fallback = null }: NoSSRProps) {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return <>{fallback}</>
    }

    return <>{children}</>
} 