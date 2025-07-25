import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Patient from "@/models/patients"
import Appointment from "@/models/appointments"


export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const doctorId = request.headers.get("doctor-id")
    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID requerido" }, { status: 400 })
    }

    // Filtrar solo pacientes de este doctor
    const patients = await Patient.find({ doctor: doctorId }).lean()
    const appointments = await Appointment.find().lean()

    const patientsWithStats = patients.map((patient: any) => {
      const totalAppointments = appointments.filter(
        (apt: any) => apt.patientId === patient.id
      ).length

      return {
        ...patient,
        totalAppointments,
      }
    })

    return NextResponse.json(patientsWithStats)
  } catch (error) {
    console.error("Error al obtener pacientes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const {
      name,
      email,
      phone,
      birthDate,
      address,
      emergencyContact,
      medicalHistory,
      doctorId
    } = await request.json()

    const newPatient = await Patient.create({
      id: Date.now().toString(),
      name,
      email,
      phone,
      birthDate,
      address,
      emergencyContact,
      medicalHistory,
      doctor: doctorId, // 👈 importante
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(newPatient)
  } catch (error) {
    console.error("Error al crear paciente:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
