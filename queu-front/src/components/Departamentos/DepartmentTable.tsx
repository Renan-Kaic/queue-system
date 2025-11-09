import { Departamento } from "@/types/departmento"
import { DepartmentTableHeader } from "./DepartmentTableHeader"
import { DepartmentTableRow } from "./DepartmentTableRow"


interface DepartmentTableProps {
  departments: Departamento[]
}

export function DepartmentTable({ departments }: DepartmentTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='table'>
        <DepartmentTableHeader />
        <tbody>
          {departments.map((department) => (
            <DepartmentTableRow key={department.id} department={department} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
