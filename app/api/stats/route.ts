// import { NextResponse } from "next/server"
// import fs from "fs"
// import path from "path"

// const dataDir = path.join(process.cwd(), "data")
// const patientsFile = path.join(dataDir, "patients.json")
// const appointmentsFile = path.join(dataDir, "appointments.json")
// const medicalRecordsFile = path.join(dataDir, "medical-records.json")

// export async function GET() {
//   try {
//     // Ensure files exist
//     if (!fs.existsSync(patientsFile)) {
//       fs.writeFileSync(patientsFile, JSON.stringify([], null, 2))
//     }
//     if (!fs.existsSync(appointmentsFile)) {
//       fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2))
//     }
//     if (!fs.existsSync(medicalRecordsFile)) {
//       fs.writeFileSync(medicalRecordsFile, JSON.stringify([], null, 2))
//     }

//     const patientsData = fs.readFileSync(patientsFile, "utf8")
//     const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
//     const medicalRecordsData = fs.readFileSync(medicalRecordsFile, "utf8")

//     const patients = JSON.parse(patientsData)
//     const appointments = JSON.parse(appointmentsData)
//     const medicalRecords = JSON.parse(medicalRecordsData)

//     const today = new Date().toISOString().split("T")[0]

//     const stats = {
//       totalPatients: patients.length,
//       totalAppointments: appointments.length,
//       todayAppointments: appointments.filter((apt: any) => apt.date === today).length,
//       pendingAppointments: appointments.filter((apt: any) => apt.status === "scheduled").length,
//       totalMedicalRecords: medicalRecords.length,
//     }

//     return NextResponse.json(stats)
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



// import { NextResponse } from "next/server"
// import { connectDB } from "@/utils/mongoose"
// import Patient from "@/models/patients"
// import Appointment from "@/models/appointments"
// import MedicalRecord from "@/models/medical-records"

// export async function GET() {
//   try {
//     await connectDB()

//     const today = new Date().toISOString().split("T")[0]

//     // Ejecutar todas las consultas en paralelo
//     const [totalPatients, totalAppointments, todayAppointments, pendingAppointments, totalMedicalRecords] =
//       await Promise.all([
//         Patient.countDocuments(),
//         Appointment.countDocuments(),
//         Appointment.countDocuments({ date: today }),
//         Appointment.countDocuments({ status: "scheduled" }),
//         MedicalRecord.countDocuments(),
//       ])

//     const stats = {
//       totalPatients,
//       totalAppointments,
//       todayAppointments,
//       pendingAppointments,
//       totalMedicalRecords,
//     }

//     return NextResponse.json(stats)
//   } catch (error) {
//     console.error("Error al obtener estadísticas:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


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
