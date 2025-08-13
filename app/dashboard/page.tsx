"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, Clock, User, CalendarDays, Activity } from "lucide-react"
import Link from "next/link"

interface Stats {
  totalPatients: number
  totalAppointments: number
  todayAppointments: number
  pendingAppointments: number
  totalMedicalRecords: number
}

interface TodayAppointment {
  id: string
  patientName: string
  time: string
  reason: string
  status: string
}

export default function DashboardPage() {
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    totalMedicalRecords: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchDashboardData()
    }
  }, [doctor, isLoading, router])

  const fetchDashboardData = async () => {
    if (!doctor) {
      setLoading(false)
      return
    }
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/stats", {
        headers: { "doctor-id": doctor.id }
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch today's appointments
      const appointmentsResponse = await fetch("/api/appointments", {
        headers: { "doctor-id": doctor.id }
      })
      if (appointmentsResponse.ok) {
        const appointments = await appointmentsResponse.json()
        const today = new Date().toLocaleDateString("en-CA", {
          timeZone: "America/Guayaquil"
        })
        // const todayAppts = appointments
        //   .filter((apt: any) => apt.date === today)
        //   .sort((a: any, b: any) => a.time.localeCompare(b.time))
        //   .slice(0, 4) // Show only first 4 appointments
        const todayAppts = appointments
          .filter((apt: any) =>
            apt.date === today &&
            apt.status !== "completed" &&
            apt.status !== "postponed"
          )
          .sort((a: any, b: any) => a.time.localeCompare(b.time))
          .slice(0, 4)
        setTodayAppointments(todayAppts)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!doctor) {
    return null
  }

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido al sistema de gestión dental</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">Registrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">Completadas y por hacer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registros Médicos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMedicalRecords}</div>
              <p className="text-xs text-muted-foreground">Totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">En tu plataforma</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Citas de Hoy</CardTitle>
              <p className="text-sm text-muted-foreground">Agenda del día actual</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">No hay citas programadas para hoy</p>
                </div>
              ) : (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">{appointment.patientName}</p>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{appointment.time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <p className="text-sm text-muted-foreground">Accesos directos a funciones principales</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/dashboard/patients/new" className="">
                  <User className="mr-3 h-4 w-4" />
                  Nuevo Paciente
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/dashboard/appointments/new" className="">
                  <CalendarDays className="mr-3 h-4 w-4" />
                  Agendar Cita
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/dashboard/medical-records" className="">
                  <Activity className="mr-3 h-4 w-4" />
                  Ver Registros
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-12">
                <Link href="/dashboard/patients" className="">
                  <Users className="mr-3 h-4 w-4" />
                  Ver Pacientes
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
