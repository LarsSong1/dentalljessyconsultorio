"use client"

import Select from "react-select"

const specialties = [
  { value: "general", label: "Odontología General" },
  { value: "orthodontics", label: "Ortodoncia" },
  { value: "periodontics", label: "Periodoncia" },
  { value: "endodontics", label: "Endodoncia" },
  { value: "oral_surgery", label: "Cirugía Oral y Maxilofacial" },
  { value: "pediatric", label: "Odontopediatría" },
  { value: "prosthodontics", label: "Prostodoncia" },
  { value: "oral_pathology", label: "Patología Oral" },
  { value: "cosmetic", label: "Odontología Estética" },
  { value: "implantology", label: "Implantología" },
  { value: "oral_medicine", label: "Medicina Oral" },
  { value: "public_health", label: "Salud Pública Dental" },
]

interface SpecialtySelectProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function SpecialtySelect({ value, onChange, placeholder = "Selecciona especialidades" }: SpecialtySelectProps) {
  const selectedOptions = specialties.filter((option) => value.includes(option.value))

  return (
    <Select
      instanceId="specialty-select"
      value={selectedOptions}
      onChange={(options) => onChange(options ? options.map((opt) => opt.value) : [])}
      options={specialties}
      placeholder={placeholder}
      className="react-select-container"
      classNamePrefix="react-select"
      isClearable
      isSearchable
      isMulti
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "40px",
          borderColor: "#e2e8f0",
          "&:hover": {
            borderColor: "#cbd5e1",
          },
        }),
      }}
    />
  )
}
