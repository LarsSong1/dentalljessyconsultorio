"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Doctor {
  id: string
  name: string
  email: string
  specialties: string[]
}

interface AuthContextType {
  doctor: Doctor | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedDoctor = localStorage.getItem("doctor")
    if (savedDoctor) {
      setDoctor(JSON.parse(savedDoctor))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const doctorData = await response.json()
        setDoctor(doctorData)
        localStorage.setItem("doctor", JSON.stringify(doctorData))
        return true
      }
      return false
    } catch (error) {
      console.error("Error en login:", error)
      return false
    }
  }

  const logout = () => {
    setDoctor(null)
    localStorage.removeItem("doctor")
    router.push("/login")
  }

  return <AuthContext.Provider value={{ doctor, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
