// import { type NextRequest, NextResponse } from "next/server"
// import fs from "fs"
// import path from "path"

// const dataDir = path.join(process.cwd(), "data")
// const appointmentsFile = path.join(dataDir, "appointments.json")

// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const { status } = await request.json()
//     const appointmentId = params.id

//     const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
//     const appointments = JSON.parse(appointmentsData)

//     const appointmentIndex = appointments.findIndex((apt: any) => apt.id === appointmentId)

//     if (appointmentIndex === -1) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
//     }

//     appointments[appointmentIndex].status = status
//     appointments[appointmentIndex].updatedAt = new Date().toISOString()

//     fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2))

//     return NextResponse.json(appointments[appointmentIndex])
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const appointmentId = params.id

//     const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
//     const appointments = JSON.parse(appointmentsData)

//     const appointmentIndex = appointments.findIndex((apt: any) => apt.id === appointmentId)

//     if (appointmentIndex === -1) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
//     }

//     // Remove the appointment from the array
//     appointments.splice(appointmentIndex, 1)

//     fs.writeFileSync(appointmentsFile, JSON.stringify(appointments, null, 2))

//     return NextResponse.json({ message: "Appointment deleted successfully" })
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const patientId = params.id

//     const appointmentsData = fs.readFileSync(appointmentsFile, "utf8")
//     const appointments = JSON.parse(appointmentsData)



//     const patientAppointments = appointments
//       .filter((apt: any) => apt.patientId === patientId)
//       .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

//     if (!patientAppointments) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
//     }

//     const appointment = patientAppointments[0]
    
//     return NextResponse.json(appointment)
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }




// import { type NextRequest, NextResponse } from "next/server"
// import { connectDB } from "@/utils/mongoose"
// import Appointment from "@/models/appointments"

// // PATCH /api/appointments/[id]
// export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
//   await connectDB()

//   try {
//     const { status } = await request.json()
//     const appointmentId = params.id

//     const updated = await Appointment.findOneAndUpdate(
//       { id: appointmentId },
//       {
//         status,
//         updatedAt: new Date().toISOString(),
//       },
//       { new: true }
//     )

//     if (!updated) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
//     }

//     return NextResponse.json(updated)
//   } catch (error) {
//     console.error("PATCH error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // DELETE /api/appointments/[id]
// export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
//   await connectDB()

//   try {
//     const appointmentId = params.id
//     const deleted = await Appointment.findOneAndDelete({ id: appointmentId })

//     if (!deleted) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
//     }

//     return NextResponse.json({ message: "Appointment deleted successfully" })
//   } catch (error) {
//     console.error("DELETE error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// // GET /api/appointments/[id] (última cita por patientId)
// export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
//   await connectDB()

//   try {
//     const patientId = params.id

//     const lastAppointment = await Appointment.find({ patientId })
//       .sort({ date: -1, time: -1 })
//       .limit(1)
//       .lean()

//     if (!lastAppointment || lastAppointment.length === 0) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
//     }

//     return NextResponse.json(lastAppointment[0])
//   } catch (error) {
//     console.error("GET latest appointment error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



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