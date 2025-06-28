import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const patientsFile = path.join(dataDir, "patients.json")
const appointmentsFile = path.join(dataDir, "appointments.json")

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize files if they don't exist
if (!fs.existsSync(patientsFile)) {
  fs.writeFileSync(patientsFile, JSON.stringify([], null, 2))
}

if (!fs.existsSync(appointmentsFile)) {
  fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2))
}

export async function GET() {
  try {
    const patientsData = fs.readFileSync(patientsFile, "utf8")
    const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")

    const patients = JSON.parse(patientsData)
    const appointments = JSON.parse(appointmentsData)

    // Add appointment count to each patient
    const patientsWithStats = patients.map((patient: any) => ({
      ...patient,
      totalAppointments: appointments.filter((apt: any) => apt.patientId === patient.id).length,
    }))

    return NextResponse.json(patientsWithStats)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const patientData = await request.json()

    const patientsData = fs.readFileSync(patientsFile, "utf8")
    const patients = JSON.parse(patientsData)

    const newPatient = {
      id: Date.now().toString(),
      ...patientData,
      createdAt: new Date().toISOString(),
    }

    patients.push(newPatient)
    fs.writeFileSync(patientsFile, JSON.stringify(patients, null, 2))

    return NextResponse.json(newPatient)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
