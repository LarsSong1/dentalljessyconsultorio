// import { type NextRequest, NextResponse } from "next/server"
// import fs from "fs"
// import path from "path"
// import { connect } from "http2"
// import { connectDB } from "@/utils/mongoose"

// const dataDir = path.join(process.cwd(), "data")
// const doctorsFile = path.join(dataDir, "doctors.json")

// // Ensure data directory exists
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true })
// }

// // Initialize doctors file if it doesn't exist
// if (!fs.existsSync(doctorsFile)) {
//   fs.writeFileSync(doctorsFile, JSON.stringify([], null, 2))
// }

// export async function POST(request: NextRequest) {
//   connectDB()
//   try {
//     const { email, password } = await request.json()

//     const doctorsData = fs.readFileSync(doctorsFile, "utf8")
//     const doctors = JSON.parse(doctorsData)

//     const doctor = doctors.find((d: any) => d.email === email && d.password === password)

//     if (doctor) {
//       const { password: _, ...doctorWithoutPassword } = doctor
//       return NextResponse.json(doctorWithoutPassword)
//     } else {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
//     }
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }



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

