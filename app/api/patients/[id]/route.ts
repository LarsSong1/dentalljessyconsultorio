// import { NextResponse } from "next/server"
// import { connectDB } from "@/utils/mongoose"
// import Patient from "@/models/patients"

// export async function DELETE(_: Request, { params }: { params: { id: string } }) {
//   await connectDB()

//   try {
//     const deleted = await Patient.findOneAndDelete({ id: params.id })

//     if (!deleted) {
//       return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
//     }

//     return NextResponse.json({ message: "Paciente eliminado correctamente" })
//   } catch (error) {
//     console.error("Error eliminando paciente:", error)
//     return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server"
import { connectDB } from "@/utils/mongoose"
import Patient from "@/models/patients"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()

  try {
    const { id } = await params
    const deleted = await Patient.findOneAndDelete({ id })

    if (!deleted) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Paciente eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminando paciente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}