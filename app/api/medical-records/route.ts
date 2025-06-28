import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const medicalRecordsFile = path.join(dataDir, "medical-records.json")

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize file if it doesn't exist
if (!fs.existsSync(medicalRecordsFile)) {
  fs.writeFileSync(medicalRecordsFile, JSON.stringify([], null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const recordData = await request.json()

    const medicalRecordsData = fs.readFileSync(medicalRecordsFile, "utf8")
    const medicalRecords = JSON.parse(medicalRecordsData)

    const newRecord = {
      id: Date.now().toString(),
      ...recordData,
      createdAt: new Date().toISOString(),
    }

    medicalRecords.push(newRecord)
    fs.writeFileSync(medicalRecordsFile, JSON.stringify(medicalRecords, null, 2))

    return NextResponse.json(newRecord)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    const medicalRecordsData = fs.readFileSync(medicalRecordsFile, "utf8")
    const medicalRecords = JSON.parse(medicalRecordsData)

    if (patientId) {
      const patientRecords = medicalRecords.filter((record: any) => record.patientId === patientId)
      return NextResponse.json(patientRecords)
    }

    return NextResponse.json(medicalRecords)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
