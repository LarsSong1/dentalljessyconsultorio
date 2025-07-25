import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Appointment from "@/models/appointments"

// PATCH /api/appointments/[id]
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()

  try {
    const { status } = await request.json()
    const { id: appointmentId } = await params

    const updated = await Appointment.findOneAndUpdate(
      { id: appointmentId },
      {
        status,
        updatedAt: new Date().toISOString(),
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()

  try {
    const { id: appointmentId } = await params
    const deleted = await Appointment.findOneAndDelete({ id: appointmentId })

    if (!deleted) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/appointments/[id] (última cita por patientId)
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()

  try {
    const { id: patientId } = await params

    const lastAppointment = await Appointment.find({ patientId })
      .sort({ date: -1, time: -1 })
      .limit(1)
      .lean()

    if (!lastAppointment || lastAppointment.length === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(lastAppointment[0])
  } catch (error) {
    console.error("GET latest appointment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}