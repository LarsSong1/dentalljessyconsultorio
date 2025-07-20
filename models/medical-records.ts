import mongoose, { Schema, model, models, Document } from "mongoose"

export interface IMedicalRecord extends Document {
  id: string
  appointmentId: string
  patientId: string
  teethTreated: number[]
  description: string
  materials: string
  observations: string
  nextAppointment: string // o Date si prefieres
  cost: number
  date: string // fecha del procedimiento
  time: string // hora del procedimiento
  createdAt: Date
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    appointmentId: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    teethTreated: {
      type: [Number],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    materials: {
      type: String,
      default: "",
    },
    observations: {
      type: String,
      default: "",
    },
    nextAppointment: {
      type: String, // o Date si quieres usar fechas reales
      default: "",
    },
    cost: {
      type: Number,
      default: 0,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // HH:mm
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.MedicalRecord || model<IMedicalRecord>("MedicalRecord", medicalRecordSchema)
