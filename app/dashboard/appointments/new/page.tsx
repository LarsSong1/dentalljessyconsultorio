"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

interface Patient {
  id: string
  name: string
  email: string
}

const treatmentTypes = [
  "Consulta",
  "Limpieza Dental",
  "Obturación",
  "Extracción",
  "Endodoncia",
  "Corona",
  "Ortodoncia",
  "Implante",
  "Blanqueamiento",
  "Cirugía Oral",
]

export default function NewAppointmentPage() {
  const { doctor, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    patientId: searchParams.get("patientId") || "",
    date: "",
    time: "",
    reason: "",
    duration: "30",
    notes: "",
  })
  

  useEffect(() => {
    if (!isLoading) {
      if (!doctor) {
        router.push("/login")
        return
      }
      fetchPatients()
    }
  }, [doctor, isLoading, router])

  const fetchPatients = async () => {
    if (!doctor) {
      setLoadingPatients(false)
      return
    }
    try {
      setLoadingPatients(true)
      setError(null)
      console.log("Fetching patients...")

      const response = await fetch("/api/patients", {
        headers: {
          "doctor-id": doctor.id
        }
      })
      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Patients data:", data)
        setPatients(data)

        if (data.length === 0) {
          setError("No hay pacientes registrados en el sistema")
        }
      } else {
        console.error("Error response:", response.statusText)
        setError("Error al cargar los pacientes")
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      setError("Error de conexión al cargar pacientes")
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)


    if (!doctor) {
      toast({
        title: "Error",
        description: "No se ha detectado un doctor autenticado",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: formData.patientId,
          date: formData.date,
          time: formData.time,
          reason: formData.reason,
          duration: formData.duration,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        toast({
          title: "Cita agendada",
          description: "La cita ha sido agendada exitosamente",
        })
        router.push("/dashboard/appointments")
      } else {
        throw new Error("Error al agendar cita")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agendar la cita",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!doctor) {
    return null
  }

  return (
 
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/appointments">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nueva Cita</h1>
            <p className="text-muted-foreground">Programa una nueva cita médica</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información de la Cita</CardTitle>
            <CardDescription>Completa los datos para agendar la cita</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Paciente *</Label>
                  {loadingPatients ? (
                    <div className="h-10 bg-gray-100 rounded animate-pulse flex items-center px-3">
                      <span className="text-gray-500">Cargando pacientes...</span>
                    </div>
                  ) : error ? (
                    <div className="space-y-2">
                      <div className="h-10 border border-red-200 rounded flex items-center px-3 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{error}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="button" variant="outline" size="sm" onClick={fetchPatients}>
                          Reintentar
                        </Button>
                        <Button type="button" variant="outline" size="sm" asChild>
                          <Link href="/dashboard/patients/new">
                            <Users className="h-4 w-4 mr-1" />
                            Crear Paciente
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Select
                      value={formData.patientId}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, patientId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.length === 0 ? (
                          <SelectItem value="" disabled>
                            No hay pacientes registrados
                          </SelectItem>
                        ) : (
                          patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} - {patient.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {patients.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {patients.length} paciente{patients.length !== 1 ? "s" : ""} disponible
                      {patients.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Tipo de Tratamiento *</Label>
                  <Select
                    value={formData.reason}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tratamiento" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentTypes.map((treatment) => (
                        <SelectItem key={treatment} value={treatment}>
                          {treatment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                      <SelectItem value="90">90 min</SelectItem>
                      <SelectItem value="120">120 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Notas adicionales sobre la cita"
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.patientId || !formData.reason || loadingPatients}
                  className="text-white"
                >
                  {isSubmitting ? "Agendando..." : "Agendar Cita"}
                </Button>
                <Button asChild type="button" variant="outline">
                  <Link href="/dashboard/appointments">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
   
  )
}
