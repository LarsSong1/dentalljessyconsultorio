import mongoose, { Schema, model, models, Document } from "mongoose"

// En models/appointments.ts (o en un archivo de tipos)
export interface AppointmentData {
  id: string
  patientId: string
  date: string
  time: string
  reason: string
  duration: string
  notes?: string
  status: "scheduled" | "completed" | "postponed" | "cancelled"
  createdAt: string
  updatedAt?: string
}

const appointmentSchema = new Schema<AppointmentData>(
  {
    id: { type: String, required: true, unique: true },
    patientId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
    duration: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "completed", "postponed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

export default models.Appointment || model<AppointmentData>("Appointment", appointmentSchema)
