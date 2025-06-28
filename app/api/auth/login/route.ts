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
    const { email, password } = await request.json()

    const doctorsData = fs.readFileSync(doctorsFile, "utf8")
    const doctors = JSON.parse(doctorsData)

    const doctor = doctors.find((d: any) => d.email === email && d.password === password)

    if (doctor) {
      const { password: _, ...doctorWithoutPassword } = doctor
      return NextResponse.json(doctorWithoutPassword)
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
