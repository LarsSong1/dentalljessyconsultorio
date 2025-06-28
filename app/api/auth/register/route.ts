import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const doctorsFile = path.join(dataDir, "doctors.json")

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize doctors file if it doesn't exist
if (!fs.existsSync(doctorsFile)) {
  fs.writeFileSync(doctorsFile, JSON.stringify([], null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, specialties } = await request.json()

    const doctorsData = fs.readFileSync(doctorsFile, "utf8")
    const doctors = JSON.parse(doctorsData)

    // Check if email already exists
    const existingDoctor = doctors.find((d: any) => d.email === email)
    if (existingDoctor) {
      return NextResponse.json({ message: "El email ya está registrado" }, { status: 400 })
    }

    const newDoctor = {
      id: Date.now().toString(),
      name,
      email,
      password,
      specialties: specialties || [],
      createdAt: new Date().toISOString(),
    }

    doctors.push(newDoctor)
    fs.writeFileSync(doctorsFile, JSON.stringify(doctors, null, 2))

    return NextResponse.json({ message: "Doctor registrado exitosamente" })
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
