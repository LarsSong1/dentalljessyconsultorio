import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const appointmentsFile = path.join(dataDir, "appointments.json")
const patientsFile = path.join(dataDir, "patients.json")

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize files if they don't exist
if (!fs.existsSync(appointmentsFile)) {
  fs.writeFileSync(appointmentsFile, JSON.stringify([], null, 2))
}

if (!fs.existsSync(patientsFile)) {
  fs.writeFileSync(patientsFile, JSON.stringify([], null, 2))
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
    const patientsData = fs.readFileSync(patientsFile, "utf8")

    const appointments = JSON.parse(appointmentsData)
    const patients = JSON.parse(patientsData)

    // Filter by patient if specified
    let filteredAppointments = appointments
    if (patientId) {
      filteredAppointments = appointments.filter((apt: any) => apt.patientId === patientId)
    }

    // Add patient name to appointments
    const appointmentsWithPatientName = filteredAppointments.map((appointment: any) => {
      const patient = patients.find((p: any) => p.id === appointment.patientId)
      return {
        ...appointment,
        patientName: patient ? patient.name : "Paciente no encontrado",
      }
    })

    // Sort by date and time
    appointmentsWithPatientName.sort((a: any, b: any) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json(appointmentsWithPatientName)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()

    const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
    const appointments = JSON.parse(appointmentsData)

    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    appointments.push(newAppointment)
    fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2))

    return NextResponse.json(newAppointment)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
