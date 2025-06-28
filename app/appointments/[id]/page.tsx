"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { MedicalRecordDialog } from "@/components/medical-record-dialog"
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

interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  reason: string
  status: "scheduled" | "completed" | "postponed" | "cancelled"
  notes?: string
  createdAt: string
}

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
}

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMedicalRecord, setShowMedicalRecord] = useState(false)

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchAppointmentData()
    }
  }, [doctor, isLoading, router, params.id])

  const fetchAppointmentData = async () => {
    try {
      // Fetch appointment details
      const appointmentsResponse = await fetch("/api/appointments")
      if (appointmentsResponse.ok) {
        const appointments = await appointmentsResponse.json()
        const foundAppointment = appointments.find((a: Appointment) => a.id === params.id)
        setAppointment(foundAppointment || null)

        if (foundAppointment) {
          // Fetch patient details
          const patientsResponse = await fetch("/api/patients")
          if (patientsResponse.ok) {
            const patients = await patientsResponse.json()
            const foundPatient = patients.find((p: Patient) => p.id === foundAppointment.patientId)
            setPatient(foundPatient || null)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching appointment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateAppointmentStatus = async (status: "completed" | "postponed") => {
    if (!appointment) return

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        if (status === "completed") {
          setShowMedicalRecord(true)
        } else {
          toast({
            title: "Cita pospuesta",
            description: "La cita ha sido marcada como pospuesta",
          })
          setAppointment({ ...appointment, status })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la cita",
        variant: "destructive",
      })
    }
  }

  const deleteAppointment = async () => {
    if (!appointment) return

    try {
      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Cita eliminada",
          description: "La cita ha sido eliminada exitosamente",
        })
        router.push("/appointments")
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
        return <Badge variant="secondary">Programada</Badge>
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

  const calculateAge = (birthDate: string) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return null
  }

  if (!appointment || !patient) {
    return (
      <LayoutWrapper>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cita no encontrada</h2>
          <Button asChild>
            <Link href="/appointments">Volver a Citas</Link>
          </Button>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper breadcrumbs={[{ label: "Citas", href: "/appointments" }, { label: "Detalles de la Cita" }]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detalles de la Cita</h1>
            <p className="text-muted-foreground">Información completa de la cita médica</p>
          </div>
          <div className="flex space-x-2">
            {appointment.status === "scheduled" && (
              <>
                <Button variant="outline" onClick={() => updateAppointmentStatus("postponed")}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Posponer
                </Button>
                <Button onClick={() => updateAppointmentStatus("completed")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marcar como Atendida
                </Button>
              </>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
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
                  <AlertDialogAction onClick={deleteAppointment} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Información de la Cita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Duración</p>
                    <p>30 min</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Tratamiento</p>
                    <p className="text-lg">{appointment.reason}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Estado</p>
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>

                {appointment.notes && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Notas</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Patient Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Paciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div>
                  <p className="font-semibold text-lg">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{calculateAge(patient.birthDate)} años</p>
                </div> */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/patients/${patient.id}`}>Ver Perfil Completo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {appointment && (
        <MedicalRecordDialog
          open={showMedicalRecord}
          onOpenChange={setShowMedicalRecord}
          appointment={appointment}
          onSave={() => {
            setShowMedicalRecord(false)
            setAppointment({ ...appointment, status: "completed" })
            toast({
              title: "Registro médico guardado",
              description: "El historial médico ha sido actualizado",
            })
          }}
        />
      )}
    </LayoutWrapper>
  )
}
