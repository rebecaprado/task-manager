"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from 'authstore/authStore'
import { authClient } from '@/lib/auth-client'

export function useAuth(redirectTo?: string) {
  const { setUser, setLoading, setError, setIsAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    setLoading(true)
    setError(null)

    authClient.getSession()
      .then((session) => {
        if (!isMounted) return

        const user = session.data?.user
        if (user) {
          setUser({
            ...user,
            image: user.image ?? undefined
          })
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
          if (redirectTo) router.push(redirectTo)
        }
      })
      .catch(() => {
        if (!isMounted) return
        setError("Erro ao buscar sessão")
        setUser(null)
        setIsAuthenticated(false)
        if (redirectTo) router.push(redirectTo)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [redirectTo, router, setUser, setLoading, setError, setIsAuthenticated])

  const { user, isAuthenticated, loading, error } = useAuthStore()
  return { user, isAuthenticated, loading, error }
}