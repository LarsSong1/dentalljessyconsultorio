// "use client"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// interface DentalChartProps {
//   selectedTeeth: number[]
//   onTeethChange: (teeth: number[]) => void
// }

// export function DentalChart({ selectedTeeth, onTeethChange }: DentalChartProps) {
//   // Numeración dental internacional (FDI)
//   const upperRight = [18, 17, 16, 15, 14, 13, 12, 11]
//   const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28]
//   const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38]
//   const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48]

//   const toggleTooth = (toothNumber: number) => {
//     if (selectedTeeth.includes(toothNumber)) {
//       onTeethChange(selectedTeeth.filter((t) => t !== toothNumber))
//     } else {
//       onTeethChange([...selectedTeeth, toothNumber])
//     }
//   }

//   const clearSelection = () => {
//     onTeethChange([])
//   }

//   const ToothButton = ({ number, position }: { number: number; position?: string }) => (
//     <div className="flex flex-col items-center space-y-1">
//       <Button
//         type="button"
//         variant={selectedTeeth.includes(number) ? "default" : "outline"}
//         size="sm"
//         className={`w-10 h-10 p-0 text-xs rounded-full ${
//           selectedTeeth.includes(number) ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-100 border-2"
//         }`}
//         onClick={() => toggleTooth(number)}
//       >
//         {number}
//       </Button>
//       <span className="text-xs text-gray-500">{position}</span>
//     </div>
//   )

//   return (
//     <div className="space-y-8 p-6 bg-white rounded-lg border">
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-semibold text-gray-800">Seleccionar Piezas Dentales</h3>
//         <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
//           Limpiar Selección
//         </Button>
//       </div>

//       {/* Diagrama Dental */}
//       <div className="space-y-8">
//         {/* Arcada Superior */}
//         <div className="space-y-4">
//           <div className="text-center">
//             <h4 className="text-lg font-medium text-gray-700">Arcada Superior</h4>
//           </div>
//           <div className="flex justify-center">
//             <div className="grid grid-cols-8 gap-3">
//               {/* Cuadrante Superior Derecho */}
//               {upperRight.map((tooth, index) => (
//                 <ToothButton
//                   key={tooth}
//                   number={tooth}
//                   position={index < 3 ? "Molar" : index < 5 ? "Premolar" : index < 6 ? "Canino" : "Incisivo"}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <div className="grid grid-cols-8 gap-3">
//               {/* Cuadrante Superior Izquierdo */}
//               {upperLeft.map((tooth, index) => (
//                 <ToothButton
//                   key={tooth}
//                   number={tooth}
//                   position={index < 2 ? "Incisivo" : index < 3 ? "Canino" : index < 5 ? "Premolar" : "Molar"}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Línea divisoria */}
//         <div className="border-t-2 border-gray-300 mx-8"></div>

//         {/* Arcada Inferior */}
//         <div className="space-y-4">
//           <div className="flex justify-center">
//             <div className="grid grid-cols-8 gap-3">
//               {/* Cuadrante Inferior Izquierdo */}
//               {lowerLeft.map((tooth, index) => (
//                 <ToothButton
//                   key={tooth}
//                   number={tooth}
//                   position={index < 2 ? "Incisivo" : index < 3 ? "Canino" : index < 5 ? "Premolar" : "Molar"}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="flex justify-center">
//             <div className="grid grid-cols-8 gap-3">
//               {/* Cuadrante Inferior Derecho */}
//               {lowerRight.map((tooth, index) => (
//                 <ToothButton
//                   key={tooth}
//                   number={tooth}
//                   position={index < 2 ? "Incisivo" : index < 3 ? "Canino" : index < 5 ? "Premolar" : "Molar"}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="text-center">
//             <h4 className="text-lg font-medium text-gray-700">Arcada Inferior</h4>
//           </div>
//         </div>
//       </div>

//       {/* Piezas seleccionadas */}
//       {selectedTeeth.length > 0 && (
//         <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm font-medium text-blue-800">Piezas Seleccionadas ({selectedTeeth.length}):</p>
//           <div className="flex flex-wrap gap-2">
//             {selectedTeeth
//               .sort((a, b) => a - b)
//               .map((tooth) => (
//                 <Badge key={tooth} variant="secondary" className="bg-blue-100 text-blue-800">
//                   Pieza {tooth}
//                   <button
//                     type="button"
//                     onClick={() => toggleTooth(tooth)}
//                     className="ml-2 text-blue-600 hover:text-blue-800"
//                   >
//                     ×
//                   </button>
//                 </Badge>
//               ))}
//           </div>
//         </div>
//       )}

//       {/* Leyenda */}
//       <div className="text-xs text-gray-500 text-center space-y-1">
//         <p>Sistema de Numeración Dental Internacional (FDI)</p>
//         <p>Haz clic en los dientes para seleccionar las piezas tratadas</p>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface DentalChartProps {
  selectedTeeth: number[]
  onTeethChange: (teeth: number[]) => void
}



export function DentalChart({ selectedTeeth, onTeethChange }: DentalChartProps) {
  const [showDeciduousTeeth, setShowDeciduousTeeth] = useState(false)

  // Numeración dental internacional (FDI) - Dientes Permanentes
  const permanentUpperRight = [18, 17, 16, 15, 14, 13, 12, 11]
  const permanentUpperLeft = [21, 22, 23, 24, 25, 26, 27, 28]
  const permanentLowerLeft = [48, 47, 46, 45, 44, 43, 42, 41]
  const permanentLowerRight = [31, 32, 33, 34, 35, 36, 37, 38]

  // Dientes Deciduos (de leche)
  const deciduousUpperRight = [55, 54, 53, 52, 51]
  const deciduousUpperLeft = [61, 62, 63, 64, 65]
  const deciduousLowerLeft = [85, 84, 83, 82, 81]
  const deciduousLowerRight = [71, 72, 73, 74, 75]

  const toggleTooth = (toothNumber: number) => {
    console.log("Toggling tooth:", toothNumber)
    if (selectedTeeth.includes(toothNumber)) {
      onTeethChange(selectedTeeth.filter((t) => t !== toothNumber))
    } else {
      onTeethChange([...selectedTeeth, toothNumber])
    }
  }

  const clearSelection = () => {
    onTeethChange([])
  }

  const getToothType = (number: number, index: number, isDeciduous: boolean) => {
    if (isDeciduous) {
      if (index < 2) return "Incisivo"
      if (index < 3) return "Canino"
      return "Molar"
    } else {
      const quadrant = Math.floor(number / 10)
      const position = number % 10
      
      if (position <= 2) return "Incisivo"
      if (position === 3) return "Canino"
      if (position <= 5) return "Premolar"
      return "Molar"
    }
  }

  const ToothButton = ({ number, position, isDeciduous = false }: { number: number; position?: string; isDeciduous?: boolean }) => (
    <div className="flex flex-col items-center space-y-1">
      <Button
        type="button"
        variant={selectedTeeth.includes(number) ? "default" : "outline"}
        size="sm"
        className={`w-10 h-10 p-0 text-xs rounded-full ${
          selectedTeeth.includes(number) 
            ? "bg-blue-600 hover:bg-blue-700 text-white" 
            : isDeciduous 
              ? "hover:bg-orange-100 border-2 border-orange-300 text-orange-700" 
              : "hover:bg-gray-100 border-2"
        }`}
        onClick={() => toggleTooth(number)}
      >
        {number}
      </Button>
      <span className={`text-xs ${isDeciduous ? 'text-orange-600' : 'text-gray-500'}`}>
        {position}
      </span>
    </div>
  )

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Seleccionar Piezas Dentales</h3>
        <div className="flex gap-2">
          <Button 
            type="button" 
            size="sm" 
            onClick={() => setShowDeciduousTeeth(!showDeciduousTeeth)}
            className="text-white bg-black"
          >
            {showDeciduousTeeth ? "Ocultar Deciduos" : "Mostrar Deciduos"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={clearSelection}>
            Limpiar Selección
          </Button>
        </div>
      </div>

      {/* Diagrama Dental */}
      <div className="space-y-8">
        {/* Arcada Superior */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-700">Arcada Superior</h4>
          </div>
          
          {/* Dientes Permanentes Superiores */}
          <div className="flex justify-center">
            <div className="flex gap-6">
              {/* Cuadrante Superior Derecho */}
              <div className="grid lg:grid-cols-8 grid-cols-2 gap-3">
                {permanentUpperRight.map((tooth, index) => (
                  <ToothButton
                    key={tooth}
                    number={tooth}
                    position={getToothType(tooth, index, false)}
                  />
                ))}
              </div>
              {/* Cuadrante Superior Izquierdo */}
              <div className="grid lg:grid-cols-8 grid-cols-2 gap-3">
                {permanentUpperLeft.map((tooth, index) => (
                  <ToothButton
                    key={tooth}
                    number={tooth}
                    position={getToothType(tooth, index, false)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Dientes Deciduos Superiores */}
          {showDeciduousTeeth && (
            <div className="flex justify-center">
              <div className="flex gap-6">
                {/* Cuadrante Superior Derecho Deciduo */}
                <div className="grid lg:grid-cols-5 grid-cols-2 gap-3">
                  {deciduousUpperRight.map((tooth, index) => (
                    <ToothButton
                      key={tooth}
                      number={tooth}
                      position={getToothType(tooth, index, true)}
                      isDeciduous={true}
                    />
                  ))}
                </div>
                {/* Cuadrante Superior Izquierdo Deciduo */}
                <div className="grid lg:grid-cols-5 grid-cols-2 gap-3">
                  {deciduousUpperLeft.map((tooth, index) => (
                    <ToothButton
                      key={tooth}
                      number={tooth}
                      position={getToothType(tooth, index, true)}
                      isDeciduous={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Línea divisoria */}
        <div className="border-t-2 border-gray-300 mx-8"></div>

        {/* Arcada Inferior */}
        <div className="space-y-4">
          {/* Dientes Deciduos Inferiores */}
          {showDeciduousTeeth && (
            <div className="flex justify-center">
              <div className="flex gap-6">
                {/* Cuadrante Inferior Izquierdo Deciduo */}
                <div className="grid lg:grid-cols-5 grid-cols-2 gap-3">
                  {deciduousLowerLeft.map((tooth, index) => (
                    <ToothButton
                      key={tooth}
                      number={tooth}
                      position={getToothType(tooth, index, true)}
                      isDeciduous={true}
                    />
                  ))}
                </div>
                {/* Cuadrante Inferior Derecho Deciduo */}
                <div className="grid lg:grid-cols-5 grid-cols-2 gap-3">
                  {deciduousLowerRight.map((tooth, index) => (
                    <ToothButton
                      key={tooth}
                      number={tooth}
                      position={getToothType(tooth, index, true)}
                      isDeciduous={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Dientes Permanentes Inferiores */}
          <div className="flex justify-center">
            <div className="flex gap-6">
              {/* Cuadrante Inferior Izquierdo */}
              <div className="grid lg:grid-cols-8 grid-cols-2 gap-3">
                {permanentLowerLeft.map((tooth, index) => (
                  <ToothButton
                    key={tooth}
                    number={tooth}
                    position={getToothType(tooth, index, false)}
                  />
                ))}
              </div>
              {/* Cuadrante Inferior Derecho */}
              <div className="grid lg:grid-cols-8 grid-cols-2 gap-3">
                {permanentLowerRight.map((tooth, index) => (
                  <ToothButton
                    key={tooth}
                    number={tooth}
                    position={getToothType(tooth, index, false)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-700">Arcada Inferior</h4>
          </div>
        </div>
      </div>

      {/* Piezas seleccionadas */}
      {selectedTeeth.length > 0 && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Piezas Seleccionadas ({selectedTeeth.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selectedTeeth
              .sort((a, b) => a - b)
              .map((tooth) => {
                const isDeciduous = tooth >= 51 && tooth <= 85
                return (
                  <Badge 
                    key={tooth} 
                    variant="secondary" 
                    className={isDeciduous ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}
                  >
                    Pieza {tooth} {isDeciduous && "(Deciduo)"}
                    <button
                      type="button"
                      onClick={() => toggleTooth(tooth)}
                      className={`ml-2 ${isDeciduous ? 'text-orange-600 hover:text-orange-800' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      ×
                    </button>
                  </Badge>
                )
              })}
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>Sistema de Numeración Dental Internacional (FDI)</p>
        <p>Permanentes: 11-18, 21-28, 31-38, 41-48 | Deciduos: 51-55, 61-65, 71-75, 81-85</p>
        <p>Haz clic en los dientes para seleccionar las piezas tratadas</p>
      </div>
    </div>
  )
}