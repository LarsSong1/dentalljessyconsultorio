import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Doctor from "@/models/doctors"
import bcrypt from "bcrypt"

export async function POST(request: NextRequest) {
  await connectDB()

  try {
    const { name, email, password, specialties } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Verificar si el correo ya existe
    const existingDoctor = await Doctor.findOne({ email })
    if (existingDoctor) {
      return NextResponse.json({ message: "El email ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newDoctor = await Doctor.create({
      id: Date.now().toString(), // opcional si prefieres no usar _id
      name,
      email,
      password: hashedPassword,
      specialties: specialties || [],
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: "Doctor registrado exitosamente", doctor: newDoctor })
  } catch (error) {
    console.error("Error al registrar doctor:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
