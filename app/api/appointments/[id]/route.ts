import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const appointmentsFile = path.join(dataDir, "appointments.json")

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const appointmentId = params.id

    const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
    const appointments = JSON.parse(appointmentsData)

    const appointmentIndex = appointments.findIndex((apt: any) => apt.id === appointmentId)

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    appointments[appointmentIndex].status = status
    appointments[appointmentIndex].updatedAt = new Date().toISOString()

    fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2))

    return NextResponse.json(appointments[appointmentIndex])
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const appointmentId = params.id

    const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
    const appointments = JSON.parse(appointmentsData)

    const appointmentIndex = appointments.findIndex((apt: any) => apt.id === appointmentId)

    if (appointmentIndex === -1) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Remove the appointment from the array
    appointments.splice(appointmentIndex, 1)

    fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2))

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
