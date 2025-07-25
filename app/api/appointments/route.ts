

import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Appointment from "@/models/appointments"
import Patient from "@/models/patients"


export async function GET(request: NextRequest) {
  await connectDB()

  try {
    const doctorId = request.headers.get("doctor-id")
    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID requerido" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    // Obtener pacientes del doctor autenticado
    const doctorPatients = await Patient.find({ doctor: doctorId }).lean()
    const doctorPatientIds = doctorPatients.map(p => p.id)

    // Si se solicita un paciente específico, verificar si pertenece al doctor
    if (patientId && !doctorPatientIds.includes(patientId)) {
      return NextResponse.json([], { status: 200 }) // Retorna vacío si el doctor no creó ese paciente
    }

    const filter: any = {}
    if (patientId) {
      filter.patientId = patientId
    } else {
      filter.patientId = { $in: doctorPatientIds }
    }

    const appointments = await Appointment.find(filter).lean()

    const appointmentsWithPatientName = appointments.map((appointment) => {
      const patient = doctorPatients.find((p) => p.id === appointment.patientId)
      return {
        ...appointment,
        patientName: patient?.name || "Paciente no encontrado",
      }
    })

    return NextResponse.json(appointmentsWithPatientName)
  } catch (error) {
    console.error("Error al obtener citas:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



// Crear nueva cita
export async function POST(request: NextRequest) {
  await connectDB()

  try { // Para depurar el cuerpo de la solicitud
    const {
      patientId,
      date,
      time,
      reason,
      duration,
      notes,// 👈 importante: que se llame doctor, no doctorId
    } = await request.json()

    const newAppointment = await Appointment.create({
      id: Date.now().toString(), // opcional si prefieres no usar _id
      patientId,
      date,
      time,
      reason,
      duration,
      notes,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    })

    

    return NextResponse.json(newAppointment)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

