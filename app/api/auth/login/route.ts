import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Doctor from "@/models/doctors"
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
  await connectDB()

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const doctor = await Doctor.findOne({ email })

    if (!doctor) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, doctor.password)

    if (!isMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const { password: _, ...doctorWithoutPassword } = doctor.toObject()

    return NextResponse.json({
      ...doctorWithoutPassword,
      id: doctor._id.toString()
    })

  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

