"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Trash2, Calendar, Clock, Users, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import dayjs from "dayjs"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  reason: string
  status: "scheduled" | "completed" | "postponed" | "cancelled"
  createdAt: string
}

interface AppointmentStats {
  today: number
  thisWeek: number
  confirmed: number
  pending: number
}

export default function AppointmentsPage() {
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AppointmentStats>({
    today: 0,
    thisWeek: 0,
    confirmed: 0,
    pending: 0,
  })

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchAppointments()
    }
  }, [doctor, isLoading, router])

  const fetchAppointments = async () => {
    if (!doctor) {
      toast({
        title: "Error",
        description: "No se ha detectado un doctor autenticado",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/appointments", {
        headers: {
          "doctor-id": doctor.id,
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (appointments: Appointment[]) => {
    const today = new Date().toISOString().split("T")[0]
    const oneWeekFromNow = new Date()
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)

    const todayCount = appointments.filter((apt) => apt.date === today).length
    const thisWeekCount = appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return aptDate >= new Date() && aptDate <= oneWeekFromNow
    }).length
    const confirmedCount = appointments.filter((apt) => apt.status === "completed").length
    const pendingCount = appointments.filter((apt) => apt.status === "scheduled").length

    setStats({
      today: todayCount,
      thisWeek: thisWeekCount,
      confirmed: confirmedCount,
      pending: pendingCount,
    })
  }

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Cita eliminada",
          description: "La cita ha sido eliminada exitosamente",
        })
        fetchAppointments()
      } else {
        throw new Error("Error al eliminar la cita")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cita",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary">Pendiente</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>
      case "postponed":
        return <Badge variant="outline">Pospuesta</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDuration = (reason: string) => {
    // Simulate duration based on treatment type
    const durations: { [key: string]: string } = {
      "Limpieza dental": "30 min",
      Endodoncia: "90 min",
      Ortodoncia: "45 min",
      Extracción: "60 min",
      Consulta: "30 min",
      Obturación: "45 min",
    }
    return durations[reason] || "30 min"
  }


  console.log("Appointments:", appointments)
  const filteredAppointments = appointments.filter(
  (appointment) =>
    (appointment.patientName?.toLowerCase?.() || "").includes(searchTerm.toLowerCase()) ||
    (appointment.reason?.toLowerCase?.() || "").includes(searchTerm.toLowerCase())
)



  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!doctor) {
    return null
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between lg:flex-row flex-col lg:items-center items-start">
          <div className="">
            <h1 className="text-3xl font-bold tracking-tight">Citas Médicas</h1>
            <p className="text-muted-foreground">Gestiona las citas de tus pacientes</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/appointments/new" className="text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cita
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">citas programadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">citas programadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmed}</div>
              <p className="text-xs text-muted-foreground">de {appointments.length} citas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">por confirmar</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lista de Citas</h2>
          </div>
          <p className="text-sm text-muted-foreground">Todas las citas programadas en el sistema</p>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar citas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas programadas</h3>
                <p className="text-gray-600 mb-4">Comienza agendando tu primera cita</p>
                <Button asChild className="text-white">
                  <Link href="/dashboard/appointments/new">Agendar Primera Cita</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border overflow-x-scroll">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tratamiento</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patientName}</TableCell>
                      <TableCell>{dayjs(appointment.date).format("DD/MM/YYYY")}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.reason}</TableCell>
                      <TableCell>{getDuration(appointment.reason)}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/appointments/${appointment.id}`}>Ver Detalles</Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar cita?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. La cita será eliminada permanentemente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteAppointment(appointment.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
  )
}
