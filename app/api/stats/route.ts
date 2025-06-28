import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const patientsFile = path.join(dataDir, "patients.json")
const appointmentsFile = path.join(dataDir, "appointments.json")
const medicalRecordsFile = path.join(dataDir, "medical-records.json")

export async function GET() {
  try {
    // Ensure files exist
    if (!fs.existsSync(patientsFile)) {
      fs.writeFileSync(patientsFile, JSON.stringify([], null, 2))
    }
    if (!fs.existsSync(appointmentsFile)) {
      fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2))
    }
    if (!fs.existsSync(medicalRecordsFile)) {
      fs.writeFileSync(medicalRecordsFile, JSON.stringify([], null, 2))
    }

    const patientsData = fs.readFileSync(patientsFile, "utf8")
    const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
    const medicalRecordsData = fs.readFileSync(medicalRecordsFile, "utf8")

    const patients = JSON.parse(patientsData)
    const appointments = JSON.parse(appointmentsData)
    const medicalRecords = JSON.parse(medicalRecordsData)

    const today = new Date().toISOString().split("T")[0]

    const stats = {
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter((apt: any) => apt.date === today).length,
      pendingAppointments: appointments.filter((apt: any) => apt.status === "scheduled").length,
      totalMedicalRecords: medicalRecords.length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
