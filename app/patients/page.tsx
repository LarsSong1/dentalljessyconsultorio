"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Calendar } from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  address: string
  createdAt: string
  totalAppointments: number
}

export default function PatientsPage() {
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastVisits, setLastVisits] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchPatients()
    }
  }, [doctor, isLoading, router])

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients")
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
        await fetchLastVisits(data)
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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


  const fetchLastVisits = async (patients: Patient[]) => {
    const visits: Record<string, string> = {}

    for (const patient of patients) {
      try {
        const response = await fetch(`/api/appointments/${patient.id}`)
        if (response.ok) {
          const appointment = await response.json()
          visits[patient.id] = new Date(appointment.date).toLocaleDateString() // Asegúrate que el campo sea `date`
        } else {
          visits[patient.id] = "No hay visitas"
        }
      } catch (error) {
        visits[patient.id] = "Error"
      }
    }

    setLastVisits(visits)
  }


  // const getLastVisit = async (patientId: any) => {
  //   // Simulamos la última visita
  //   const response = await fetch(`/api/appointments/${patientId}}`)
  //   if (!response.ok) {
  //     return "No hay visitas registradas"
  //   }
  //   const appointments = await response.json()
  //   console.log(appointments)
  // }

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!doctor) {
    return null
  }

  return (
    <LayoutWrapper breadcrumbs={[{ label: "Pacientes" }]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
            <p className="text-muted-foreground">Gestiona la información de tus pacientes</p>
          </div>
          <Button asChild>
            <Link href="/patients/new" className="text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Paciente
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lista de Pacientes</h2>
          </div>
          <p className="text-sm text-muted-foreground">Todos los pacientes registrados en el sistema</p>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Visitas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{calculateAge(patient.birthDate)}</TableCell>
                    <TableCell>{lastVisits[patient.id]}</TableCell>
                    <TableCell>{patient.totalAppointments}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/patients/${patient.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {/* <Button variant="ghost" size="sm" asChild>
                          <Link href={`/patients/${patient.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button> */}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/appointments/new?patientId=${patient.id}`}>
                            <Calendar className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}
