"use client"

import { useAuth } from "@/components/auth-provider"
import { PatientForm } from "@/components/patient-form"
import { use, useEffect, useState } from "react"

type Patient = {
  name: string
  email: string
  phone: string
  birthDate: string
  address: string
  emergencyContact: string
  medicalHistory: string[]
}

async function getPatient(patientId: string): Promise<Patient> {
  const res = await fetch(`/api/patients/${patientId}`)
  if (!res.ok) throw new Error("Error al obtener paciente")
  return res.json()
}

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { doctor, isLoading } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loadingPatient, setLoadingPatient] = useState(true)

  useEffect(() => {
    if (doctor) {
      setLoadingPatient(true)
      getPatient(id)
        .then((data) => setPatient(data))
        .finally(() => setLoadingPatient(false))
    }
  }, [doctor, id])

  if (isLoading || loadingPatient) {
    return <p>Cargando...</p>
  }

  if (!patient) {
    return <p>No se encontró el paciente.</p>
  }

  return (
    <PatientForm
      initialData={{
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        birthDate: patient.birthDate || "",
        address: patient.address || "",
        emergencyContact: patient.emergencyContact || "",
        medicalHistory: (patient.medicalHistory || []).join(", "),
      }}
      mode="edit"
      patientId={id}
    />
  )
}
