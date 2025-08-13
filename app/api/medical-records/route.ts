


import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import MedicalRecord from "@/models/medical-records"
import Patient from "@/models/patients"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const recordData = await request.json()

    const newRecord = await MedicalRecord.create({
      id: Date.now().toString(),
      ...recordData,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(newRecord)
  } catch (error) {
    console.error("Error creando historial médico:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}




export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const doctorId = request.headers.get("doctor-id")
    const patientId = searchParams.get("patientId")

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID requerido" }, { status: 400 })
    }

    if (patientId) {
      // Buscar si el paciente pertenece al doctor
      const patient = await Patient.findOne({ id: patientId, doctor: doctorId }).lean()

      if (!patient) {
        return NextResponse.json({ error: "Paciente no encontrado o no autorizado" }, { status: 404 })
      }

      const records = await MedicalRecord.find({ patientId }).sort({ createdAt: -1 }).lean()
      return NextResponse.json(records)
    }

    // Si no se pasa patientId, devolver registros de todos los pacientes del doctor
    const doctorPatients = await Patient.find({ doctor: doctorId }).lean()
    const patientIds = doctorPatients.map(p => p.id)

    const records = await MedicalRecord.find({ patientId: { $in: patientIds } }).sort({ date: -1 }).lean()
    return NextResponse.json(records)
  } catch (error) {
    console.error("Error obteniendo historiales médicos:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
