"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DentalChart } from "@/components/dental-chart"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  date: string
  time: string
  reason: string
  status: string
}

interface MedicalRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment
  onSave: () => void
}

export function MedicalRecordDialog({ open, onOpenChange, appointment, onSave }: MedicalRecordDialogProps) {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [description, setDescription] = useState("")
  const [materials, setMaterials] = useState("")
  const [observations, setObservations] = useState("")
  const [nextAppointment, setNextAppointment] = useState("")
  const [cost, setCost] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!description.trim()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.id,
          patientId: appointment.patientId,
          teethTreated: selectedTeeth,
          description,
          materials,
          observations,
          nextAppointment,
          cost: cost ? Number.parseFloat(cost) : 0,
          date: appointment.date,
          time: appointment.time,
        }),
      })

      if (response.ok) {
        onSave()
        // Reset form
        setSelectedTeeth([])
        setDescription("")
        setMaterials("")
        setObservations("")
        setNextAppointment("")
        setCost("")
      }
    } catch (error) {
      console.error("Error saving medical record:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro de Atención - {appointment.patientName}</DialogTitle>
          <DialogDescription>
            Cita del {new Date(appointment.date).toLocaleDateString()} a las {appointment.time}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <DentalChart selectedTeeth={selectedTeeth} onTeethChange={setSelectedTeeth} />

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Tratamiento *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente el procedimiento realizado, materiales utilizados, observaciones, etc."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="materials">Materiales Utilizados</Label>
              <Textarea
                id="materials"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="Lista de materiales utilizados"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Observaciones adicionales"
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextAppointment">Próxima Cita Recomendada</Label>
              <Input
                id="nextAppointment"
                type="date"
                value={nextAppointment}
                onChange={(e) => setNextAppointment(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Costo del Tratamiento</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleSave} disabled={isLoading || !description.trim()} className="text-white">
              {isLoading ? "Guardando..." : "Registrar Atención"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
