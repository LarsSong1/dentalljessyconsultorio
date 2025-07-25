"use client"

import { useEffect, useState, use } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, User, Calendar, Edit, Heart } from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  address: string
  emergencyContact: string
  medicalHistory: []
  totalAppointments: number
}

interface Appointment {
  id: string
  date: string
  time: string
  reason: string
  status: string
}




export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const {id} = use(params)
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchPatientData()
    }
  }, [doctor, isLoading, router, id])

  const fetchPatientData = async () => {
    if (!doctor) {
      setLoading(false)
      return
    }
    try {
      // Fetch patient details
      const patientsResponse = await fetch("/api/patients", {
        headers: { "doctor-id": doctor.id }
      })
      if (patientsResponse.ok) {
        const patients = await patientsResponse.json()
        const foundPatient = patients.find((p: Patient) => p.id === id)
        setPatient(foundPatient || null)
      }

      // Fetch upcoming appointments
      const appointmentsResponse = await fetch(`/api/appointments?patientId=${id}`, {
        headers: { "doctor-id": doctor.id 
          
        }})
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData.slice(0, 3)) // Show only next 3 appointments
      }
    } catch (error) {
      console.error("Error fetching patient data:", error)
    } finally {
      setLoading(false)
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
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!doctor || !patient) {
    return (
      <LayoutWrapper>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Paciente no encontrado</h2>
          <Button asChild>
            <Link href="/patients">Volver a Pacientes</Link>
          </Button>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper breadcrumbs={[{ label: "Pacientes", href: "/patients" }, { label: patient.name }]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            <p className="text-muted-foreground">Perfil del paciente</p>
          </div>
          <div className="flex space-x-2">
            {/* <Button variant="outline" asChild>
              <Link href={`/patients/${patient.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button> */}
            <Button asChild>
              <Link href={`/appointments/new?patientId=${patient.id}`} className="text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Nueva Cita
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.email}</span>
                    </div>
                  </div> */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                </div>



                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.address}</span>
                  </div>
                </div>

                {patient.emergencyContact && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Contacto de Emergencia</p>
                    <p>{patient.emergencyContact}</p>
                  </div>
                )}

                {patient.medicalHistory && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Alergias</p>
                    <div className="flex w-full gap-2">
                      {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0 ? (
                        patient.medicalHistory.map((data) => (
                          <Badge key={data} className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            {data}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay alergias registradas</p>
                      )}

                    </div>
                    {/* <Badge variant="destructive">Penicilina</Badge> */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics and Upcoming Appointments */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Visitas</p>
                  <p className="text-3xl font-bold">{patient.totalAppointments}</p>
                </div>
                {/* <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Visita</p>
                  <p className="text-lg">2024-01-15</p>
                </div> */}
                {/* <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
                </div> */}
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/patients/${patient.id}/medical-history`}>Ver Historial Completo</Link>
                </Button>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Próximas Citas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Control</p>
                    <p className="text-sm text-muted-foreground">2024-01-25 - 10:00</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
