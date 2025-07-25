import { NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Patient from "@/models/patients"
import Appointment from "@/models/appointments"
import MedicalRecord from "@/models/medical-records"

export async function GET(request: Request) {
  try {
    await connectDB()

    const doctorId = request.headers.get("doctor-id")

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor no autenticado" }, { status: 401 })
    }

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Guayaquil" })

    // 1. Obtener pacientes del doctor
    const patients = await Patient.find({ doctor: doctorId }).lean()
    const patientIds = patients.map((p) => p.id)

    // 2. Contar solo citas y registros de esos pacientes
    const [totalAppointments, todayAppointments, pendingAppointments, totalMedicalRecords] = await Promise.all([
      Appointment.countDocuments({ patientId: { $in: patientIds } }),
      Appointment.countDocuments({ patientId: { $in: patientIds }, date: today }),
      Appointment.countDocuments({ patientId: { $in: patientIds }, status: "scheduled" }),
      MedicalRecord.countDocuments({ patientId: { $in: patientIds } }),
    ])

    const stats = {
      totalPatients: patients.length,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      totalMedicalRecords,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
