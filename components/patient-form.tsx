"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export interface PatientFormData {
  name: string
  email: string
  phone: string
  birthDate: string
  address: string
  emergencyContact: string
  medicalHistory: string
}

export function PatientForm({
  initialData,
  mode = "create",
  patientId,
}: {
  initialData: PatientFormData
  mode?: "create" | "edit"
  patientId?: string
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(
        mode === "create" ? "/api/patients" : `/api/patients/${patientId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            medicalHistory: formData.medicalHistory
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== ""),
          }),
        }
      )

      if (response.ok) {
        toast({
          title: mode === "create" ? "Paciente registrado" : "Paciente actualizado",
          description:
            mode === "create"
              ? "El paciente ha sido registrado exitosamente"
              : "Los datos del paciente se han actualizado",
        })
        router.push("/dashboard/patients")
      } else {
        throw new Error("Error al guardar paciente")
      }
    } catch {
      toast({
        title: "Error",
        description: "No se pudo guardar el paciente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Información del Paciente</CardTitle>
        <CardDescription>
          {mode === "create" ? "Completa todos los campos requeridos" : "Edita la información del paciente"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Nombre y teléfono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Historial Médico Previo</Label>
            <p className="text-xs">Separa con , cada alergia</p>
            <Textarea
              id="medicalHistory"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Alergias, medicamentos, condiciones médicas previas..."
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={isLoading} className="text-white">
              {isLoading
                ? mode === "create"
                  ? "Registrando..."
                  : "Actualizando..."
                : mode === "create"
                  ? "Registrar Paciente"
                  : "Guardar Cambios"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/patients">Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
