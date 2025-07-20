"use client"

import { useEffect, useState, use } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import dayjs from "dayjs"

interface Patient {
  id: string
  name: string
}

interface MedicalRecord {
  id: string
  appointmentId: string
  patientId: string
  teethTreated: number[]
  description: string
  date: string
  time: string
  createdAt: string
  cost?: number
  materials?: string
  observations?: string
  nextAppointment?: string
}



export default function MedicalHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchData()
    }
  }, [doctor, isLoading, router, id])

  const fetchData = async () => {
    try {
      // Fetch patient details
      const patientsResponse = await fetch("/api/patients")
      if (patientsResponse.ok) {
        const patients = await patientsResponse.json()
        const foundPatient = patients.find((p: Patient) => p.id === id)
        setPatient(foundPatient || null)
      }

      // Fetch medical records
      const recordsResponse = await fetch(`/api/medical-records?patientId=${id}`)
      if (recordsResponse.ok) {
        const records = await recordsResponse.json()
        setMedicalRecords(records)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalCost = medicalRecords.reduce((sum, record) => sum + (record.cost || 150), 0)
  const averageCost = medicalRecords.length > 0 ? totalCost / medicalRecords.length : 0

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!doctor || !patient) {
    return (
      <LayoutWrapper>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Paciente no encontrado</h2>
          <Button asChild className="text-white">
            <Link href="/patients">Volver a Pacientes</Link>
          </Button>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper
      breadcrumbs={[
        { label: "Pacientes", href: "/patients" },
        { label: patient.name, href: `/patients/${patient.id}` },
        { label: "Historial Médico" },
      ]}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/patients/${patient.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Perfil
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Historial Médico</h1>
            <p className="text-muted-foreground">{patient.name}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicalRecords.length}</div>
              <p className="text-xs text-muted-foreground">tratamientos realizados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Tratamiento</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            {/* <CardContent>
              <div className="text-2xl font-bold">2024-01-15</div>
              <p className="text-xs text-muted-foreground">Limpieza dental</p>
            </CardContent> */}
            <CardContent>
              {medicalRecords.length > 0 ? (
                <>
                  <div className="text-2xl font-bold">{dayjs(medicalRecords[0].date).format("YYYY-MM-DD")}</div>
                  {/* <p className="text-xs text-muted-foreground">{medicalRecords[0].description || "Sin descripción"}</p> */}
                  <p className="text-xs">de citas</p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">—</div>
                  <p className="text-xs text-muted-foreground">No hay tratamientos</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">en tratamientos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">por tratamiento</p>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle>Historial Completo de Tratamientos</CardTitle>
            <CardDescription>Registro cronológico de todas las citas atendidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {medicalRecords.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros médicos</h3>
                <p className="text-gray-600">Este paciente aún no tiene tratamientos registrados.</p>
              </div>
            ) : (
              medicalRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">Limpieza dental</h3>
                      <p className="text-sm text-muted-foreground">
                        Dr. {doctor.name} - {dayjs(record.date).format("DD-MM-YYYY")} a las {record.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${record.cost || 150}.00</p>
                    </div>
                  </div>

                  {record.teethTreated.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Piezas Dentales Tratadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {record.teethTreated.map((tooth) => (
                          <Badge key={tooth} variant="secondary">
                            {tooth}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-1">Descripción:</p>
                    <p className="text-sm text-muted-foreground">
                      {record.description ||
                        "Limpieza dental completa con ultrasonido. Eliminación de sarro y placa bacteriana en sector anterior superior."}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Materiales:</p>
                    <p className="text-sm text-muted-foreground">
                      {record.materials || "Ultrasonido, pasta profiláctica, flúor"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Observaciones:</p>
                    <p className="text-sm text-muted-foreground">
                      {record.observations || "Encías ligeramente inflamadas, se recomienda mejor higiene oral"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Próxima Cita Recomendada:</p>
                    <p className="text-sm text-muted-foreground">{record.nextAppointment || "2024-07-15"}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  )
}
