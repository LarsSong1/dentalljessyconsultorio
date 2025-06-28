"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MedicalRecord {
  id: string
  appointmentId: string
  patientId: string
  patientName: string
  teethTreated: number[]
  description: string
  date: string
  time: string
  cost: number
  createdAt: string
}

export default function MedicalRecordsPage() {
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && !doctor) {
      router.push("/login")
      return
    }

    if (doctor) {
      fetchRecords()
    }
  }, [doctor, isLoading, router])

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/medical-records")
      if (response.ok) {
        const data = await response.json()
        // Add patient names to records
        const patientsResponse = await fetch("/api/patients")
        if (patientsResponse.ok) {
          const patients = await patientsResponse.json()
          const recordsWithPatientNames = data.map((record: any) => {
            const patient = patients.find((p: any) => p.id === record.patientId)
            return {
              ...record,
              patientName: patient ? patient.name : "Paciente no encontrado",
            }
          })
          setRecords(recordsWithPatientNames)
        }
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRecords = records.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>
  }

  if (!doctor) {
    return null
  }

  return (
    <LayoutWrapper breadcrumbs={[{ label: "Registros Médicos" }]}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registros Médicos</h1>
            <p className="text-muted-foreground">Historial completo de tratamientos realizados</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar registros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros médicos</h3>
                <p className="text-gray-600">Los registros aparecerán aquí cuando completes las citas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tratamiento</TableHead>
                    <TableHead>Piezas Tratadas</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.patientName}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.description.substring(0, 50)}...</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {record.teethTreated.slice(0, 3).map((tooth) => (
                            <Badge key={tooth} variant="secondary" className="text-xs">
                              {tooth}
                            </Badge>
                          ))}
                          {record.teethTreated.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{record.teethTreated.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${record.cost || 0}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/patients/${record.patientId}/medical-history`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  )
}
