import mongoose, { Schema, model, models, Document } from "mongoose"

export interface IPatient extends Document {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string // formato YYYY-MM-DD
  address: string
  emergencyContact: string
  medicalHistory: string[]
  createdAt: Date
  doctor: mongoose.Schema.Types.ObjectId
}

const patientSchema = new Schema<IPatient>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    medicalHistory: {
      type: [String],
      default: [],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.Patient || model<IPatient>("Patient", patientSchema)
