import mongoose, { Schema, model, models, Document } from "mongoose"


export interface IDoctor extends Document {
  id: string
  name: string
  email: string
  password: string
  specialties: string[]
  createdAt: Date
}

const doctorSchema = new Schema<IDoctor>(
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
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    specialties: {
      type: [String],
      default: ["general"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

export default models.Doctor || model<IDoctor>("Doctor", doctorSchema)
