

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




export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()

  try {
    const { id } = await params
    const body = await request.json()

    const updated = await Patient.findOneAndUpdate(
      { id }, // Busca por el campo id de tu esquema, no _id
      body,   // Datos nuevos
      { new: true, runValidators: true } // Retorna el paciente actualizado y valida el schema
    )

    if (!updated) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Paciente actualizado correctamente", patient: updated })
  } catch (error) {
    console.error("Error actualizando paciente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}




export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()

  try {
    const { id } = await params
    const patient = await Patient.findOne({ id })

  

    if (!patient) {
      return NextResponse.json({ error: "Paciente no encontrado" }, { status: 404 })
    }

    console.log(patient)

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error obteniendo paciente:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}