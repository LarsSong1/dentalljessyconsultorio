const fs = require("fs")
const path = require("path")

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Sample doctors
const doctors = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "doctor@example.com",
    password: "123456",
    specialties: ["general", "orthodontics"],
    createdAt: new Date().toISOString(),
  },
]

// Sample patients
const patients = [
  {
    id: "1",
    name: "María García",
    email: "maria@email.com",
    phone: "+1234567890",
    birthDate: "1990-05-15",
    address: "Calle Principal 123, Ciudad",
    emergencyContact: "Juan García - +1234567899",
    medicalHistory: "Alergia a la penicilina",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Carlos López",
    email: "carlos@email.com",
    phone: "+1234567891",
    birthDate: "1985-08-22",
    address: "Avenida Central 456, Ciudad",
    emergencyContact: "Ana López - +1234567892",
    medicalHistory: "Sin alergias conocidas",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@email.com",
    phone: "+1234567893",
    birthDate: "1992-12-10",
    address: "Plaza Mayor 789, Ciudad",
    emergencyContact: "Pedro Martínez - +1234567894",
    medicalHistory: "Diabetes tipo 2",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Luis Rodríguez",
    email: "luis@email.com",
    phone: "+1234567895",
    birthDate: "1988-03-18",
    address: "Calle Secundaria 321, Ciudad",
    emergencyContact: "Carmen Rodríguez - +1234567896",
    medicalHistory: "Hipertensión",
    createdAt: new Date().toISOString(),
  },
]

// Sample appointments
const appointments = [
  {
    id: "1",
    patientId: "1",
    date: "2024-01-25",
    time: "09:00",
    reason: "Limpieza dental",
    duration: "30",
    status: "scheduled",
    notes: "Control rutinario",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    patientId: "2",
    date: "2024-01-25",
    time: "10:30",
    reason: "Endodoncia",
    duration: "90",
    status: "scheduled",
    notes: "Tratamiento de conducto",
    createdAt: new Date().toISOString(),
  },
]

// Sample medical records
const medicalRecords = [
  {
    id: "1",
    appointmentId: "1",
    patientId: "1",
    teethTreated: [11, 12, 13],
    description: "Limpieza dental completa con ultrasonido",
    materials: "Ultrasonido, pasta profiláctica, flúor",
    observations: "Encías ligeramente inflamadas",
    nextAppointment: "2024-07-15",
    cost: 150,
    date: "2024-01-15",
    time: "09:00",
    createdAt: new Date().toISOString(),
  },
]

// Write files
try {
  fs.writeFileSync(path.join(dataDir, "doctors.json"), JSON.stringify(doctors, null, 2))
  fs.writeFileSync(path.join(dataDir, "patients.json"), JSON.stringify(patients, null, 2))
  fs.writeFileSync(path.join(dataDir, "appointments.json"), JSON.stringify(appointments, null, 2))
  fs.writeFileSync(path.join(dataDir, "medical-records.json"), JSON.stringify(medicalRecords, null, 2))

  console.log("✅ Datos de ejemplo creados exitosamente!")
  console.log("📧 Email: doctor@example.com")
  console.log("🔑 Password: 123456")
  console.log("👥 Pacientes creados: 4")
  console.log("📅 Citas creadas: 2")
  console.log("📋 Registros médicos: 1")
} catch (error) {
  console.error("❌ Error creando datos:", error)
}
