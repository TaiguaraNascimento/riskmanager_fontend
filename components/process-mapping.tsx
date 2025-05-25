"use client"

import type React from "react"

import { useState } from "react"
import { Plus, MoreVertical, Archive, X, Edit, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import ColumnHeader from "@/components/column-header"
import ProcessEvaluationModal from "@/components/process-evaluation-modal"
import ControlEvaluationModal from "@/components/control-evaluation-modal"

// Sample data structure
const initialData = {
  companies: [
    { id: 1, name: "Empresa A", color: "bg-red-100" },
    { id: 2, name: "Empresa B", color: "bg-blue-100" },
    { id: 3, name: "Empresa C", color: "bg-green-100" },
  ],
  businessUnits: [
    { id: 1, companyId: 1, name: "Unidade 1" },
    { id: 2, companyId: 1, name: "Unidade 2" },
    { id: 3, companyId: 2, name: "Unidade 3" },
  ],
  departments: [
    { id: 1, businessUnitId: 1, name: "RH" },
    { id: 2, businessUnitId: 1, name: "Financeiro" },
    { id: 3, businessUnitId: 2, name: "Operações" },
    { id: 4, businessUnitId: 3, name: "Contabilidade" },
  ],
  processes: [
    { id: 1, departmentId: 1, name: "Contratações" },
    { id: 2, departmentId: 1, name: "Desligamentos" },
    { id: 3, departmentId: 2, name: "Folha de Pagamento" },
    { id: 4, departmentId: 4, name: "Fechamento Contábil" },
  ],
  controls: [
    { id: 1, processId: 1, name: "Verificação de Documentos" },
    { id: 2, processId: 1, name: "Entrevista de Contratação" },
    { id: 3, processId: 3, name: "Conferência de Horas Extras" },
    { id: 4, processId: 4, name: "Validação de Lançamentos" },
  ],
}

export default function ProcessMapping() {
  const [data, setData] = useState(initialData)
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null)
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<number | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)
  const [selectedProcess, setSelectedProcess] = useState<number | null>(null)
  const [selectedControl, setSelectedControl] = useState<number | null>(null)
  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({
    companies: false,
    businessUnits: false,
    departments: false,
    processes: false,
    controls: false,
  })
  const [showProcessModal, setShowProcessModal] = useState(false)
  const [showControlModal, setShowControlModal] = useState(false)
  const [showCanceled, setShowCanceled] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [showAddNew, setShowAddNew] = useState<Record<string, boolean>>({
    companies: false,
    businessUnits: false,
    departments: false,
    processes: false,
    controls: false,
  })
  const [newItemText, setNewItemText] = useState<Record<string, string>>({
    companies: "",
    businessUnits: "",
    departments: "",
    processes: "",
    controls: "",
  })

  // Filter data based on selections
  const filteredBusinessUnits = data.businessUnits.filter((unit) => unit.companyId === selectedCompany)

  const filteredDepartments = data.departments.filter((dept) => dept.businessUnitId === selectedBusinessUnit)

  const filteredProcesses = data.processes.filter((process) => process.departmentId === selectedDepartment)

  const filteredControls = data.controls.filter((control) => control.processId === selectedProcess)

  // Toggle column collapse
  const toggleColumnCollapse = (column: string) => {
    setCollapsedColumns({
      ...collapsedColumns,
      [column]: !collapsedColumns[column],
    })
  }

  // Add new item
  const handleAddItem = (column: string) => {
    if (!newItemText[column].trim()) return

    const newId = Math.max(...data[column as keyof typeof data].map((item: any) => item.id)) + 1

    switch (column) {
      case "companies":
        setData({
          ...data,
          companies: [
            ...data.companies,
            {
              id: newId,
              name: newItemText.companies,
              color: `bg-${["red", "blue", "green", "yellow", "purple", "pink"][Math.floor(Math.random() * 6)]}-100`,
            },
          ],
        })
        break
      case "businessUnits":
        if (!selectedCompany) return
        setData({
          ...data,
          businessUnits: [
            ...data.businessUnits,
            { id: newId, companyId: selectedCompany, name: newItemText.businessUnits },
          ],
        })
        break
      case "departments":
        if (!selectedBusinessUnit) return
        setData({
          ...data,
          departments: [
            ...data.departments,
            { id: newId, businessUnitId: selectedBusinessUnit, name: newItemText.departments },
          ],
        })
        break
      case "processes":
        if (!selectedDepartment) return
        setData({
          ...data,
          processes: [...data.processes, { id: newId, departmentId: selectedDepartment, name: newItemText.processes }],
        })
        break
      case "controls":
        if (!selectedProcess) return
        setData({
          ...data,
          controls: [...data.controls, { id: newId, processId: selectedProcess, name: newItemText.controls }],
        })
        break
    }

    setNewItemText({
      ...newItemText,
      [column]: "",
    })
  }

  // Toggle add new item input
  const toggleAddNew = (column: string) => {
    setShowAddNew({
      ...showAddNew,
      [column]: !showAddNew[column],
    })
    // Clear the input when closing
    if (showAddNew[column]) {
      setNewItemText({
        ...newItemText,
        [column]: "",
      })
    }
  }

  // Add double-click handler for processes and controls
  const handleDoubleClick = (column: string, id: number) => {
    if (column === "processes") {
      setSelectedProcess(id)
      setShowProcessModal(true)
    } else if (column === "controls") {
      setSelectedControl(id)
      setShowControlModal(true)
    }
  }

  // Handle item selection
  const handleSelect = (column: string, id: number) => {
    switch (column) {
      case "companies":
        setSelectedCompany(id)
        setSelectedBusinessUnit(null)
        setSelectedDepartment(null)
        setSelectedProcess(null)
        setSelectedControl(null)
        break
      case "businessUnits":
        setSelectedBusinessUnit(id)
        setSelectedDepartment(null)
        setSelectedProcess(null)
        setSelectedControl(null)
        break
      case "departments":
        setSelectedDepartment(id)
        setSelectedProcess(null)
        setSelectedControl(null)
        break
      case "processes":
        setSelectedProcess(id)
        setSelectedControl(null)
        break
      case "controls":
        setSelectedControl(id)
        break
    }
  }

  // Get company color for an item
  const getItemColor = (column: string, id: number) => {
    switch (column) {
      case "companies":
        return data.companies.find((company) => company.id === id)?.color || ""
      case "businessUnits": {
        const unit = data.businessUnits.find((unit) => unit.id === id)
        if (!unit) return ""
        return data.companies.find((company) => company.id === unit.companyId)?.color || ""
      }
      case "departments": {
        const dept = data.departments.find((dept) => dept.id === id)
        if (!dept) return ""
        const unit = data.businessUnits.find((unit) => unit.id === dept.businessUnitId)
        if (!unit) return ""
        return data.companies.find((company) => company.id === unit.companyId)?.color || ""
      }
      case "processes": {
        const process = data.processes.find((process) => process.id === id)
        if (!process) return ""
        const dept = data.departments.find((dept) => dept.id === process.departmentId)
        if (!dept) return ""
        const unit = data.businessUnits.find((unit) => unit.id === dept.businessUnitId)
        if (!unit) return ""
        return data.companies.find((company) => company.id === unit.companyId)?.color || ""
      }
      case "controls": {
        const control = data.controls.find((control) => control.id === id)
        if (!control) return ""
        const process = data.processes.find((process) => process.id === control.processId)
        if (!process) return ""
        const dept = data.departments.find((dept) => dept.id === process.departmentId)
        if (!dept) return ""
        const unit = data.businessUnits.find((unit) => unit.id === dept.businessUnitId)
        if (!unit) return ""
        return data.companies.find((company) => company.id === unit.companyId)?.color || ""
      }
      default:
        return ""
    }
  }

  // Reorder controls with drag and drop
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("controlId", id.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault()
    const draggedId = Number.parseInt(e.dataTransfer.getData("controlId"))

    if (draggedId === targetId) return

    const controlsCopy = [...data.controls]
    const draggedIndex = controlsCopy.findIndex((control) => control.id === draggedId)
    const targetIndex = controlsCopy.findIndex((control) => control.id === targetId)

    const [removed] = controlsCopy.splice(draggedIndex, 1)
    controlsCopy.splice(targetIndex, 0, removed)

    setData({
      ...data,
      controls: controlsCopy,
    })
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Mapeamento de processos</h1>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Companies Column */}
            <div
              className={cn(
                "border-r transition-all duration-300 flex flex-col",
                collapsedColumns.companies ? "w-10" : "flex-1",
              )}
            >
              <ColumnHeader
                title="Empresas"
                isCollapsed={collapsedColumns.companies}
                onToggleCollapse={() => toggleColumnCollapse("companies")}
                onAddNew={() => toggleAddNew("companies")}
              />

              {!collapsedColumns.companies ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-2">
                    {showAddNew.companies && (
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          placeholder="Nova empresa..."
                          className="flex-1 p-2 text-sm border rounded-l"
                          value={newItemText.companies}
                          onChange={(e) => setNewItemText({ ...newItemText, companies: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddItem("companies")
                              toggleAddNew("companies")
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-l-none"
                          onClick={() => {
                            handleAddItem("companies")
                            toggleAddNew("companies")
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {data.companies.map((company) => (
                      <div
                        key={company.id}
                        className={cn(
                          "p-2 mb-1 rounded cursor-pointer flex items-center justify-between",
                          company.color,
                          selectedCompany === company.id ? "ring-2 ring-primary" : "",
                        )}
                        onClick={() => handleSelect("companies", company.id)}
                      >
                        <span className="truncate">{company.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <X className="mr-2 h-4 w-4" />
                              <span>Cancelar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Arquivar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Empresa vendida</DropdownMenuItem>
                                <DropdownMenuItem>Empresa incorporada</DropdownMenuItem>
                                <DropdownMenuItem>Empresa encerrada</DropdownMenuItem>
                                <DropdownMenuItem>Empresa fundida</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium">Empresas</div>
                </div>
              )}
            </div>

            {/* Business Units Column */}
            <div
              className={cn(
                "border-r transition-all duration-300 flex flex-col",
                collapsedColumns.businessUnits ? "w-10" : "flex-1",
              )}
            >
              <ColumnHeader
                title="Unidades de Negócios"
                isCollapsed={collapsedColumns.businessUnits}
                onToggleCollapse={() => toggleColumnCollapse("businessUnits")}
                onAddNew={() => toggleAddNew("businessUnits")}
              />

              {!collapsedColumns.businessUnits ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-2">
                    {selectedCompany && showAddNew.businessUnits && (
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          placeholder="Nova unidade..."
                          className="flex-1 p-2 text-sm border rounded-l"
                          value={newItemText.businessUnits}
                          onChange={(e) => setNewItemText({ ...newItemText, businessUnits: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddItem("businessUnits")
                              toggleAddNew("businessUnits")
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-l-none"
                          onClick={() => {
                            handleAddItem("businessUnits")
                            toggleAddNew("businessUnits")
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {filteredBusinessUnits.map((unit) => (
                      <div
                        key={unit.id}
                        className={cn(
                          "p-2 mb-1 rounded cursor-pointer flex items-center justify-between",
                          getItemColor("businessUnits", unit.id),
                          selectedBusinessUnit === unit.id ? "ring-2 ring-primary" : "",
                        )}
                        onClick={() => handleSelect("businessUnits", unit.id)}
                      >
                        <span className="truncate">{unit.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <X className="mr-2 h-4 w-4" />
                                <span>Cancelar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Erro de cadastro</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Arquivar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Unidade de negócios encerrada</DropdownMenuItem>
                                <DropdownMenuItem>Unidade de negócios vendida</DropdownMenuItem>
                                <DropdownMenuItem>Unidade de negócios absorvida</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium">Unidades de Negócios</div>
                </div>
              )}
            </div>

            {/* Departments Column */}
            <div
              className={cn(
                "border-r transition-all duration-300 flex flex-col",
                collapsedColumns.departments ? "w-10" : "flex-1",
              )}
            >
              <ColumnHeader
                title="Departamentos"
                isCollapsed={collapsedColumns.departments}
                onToggleCollapse={() => toggleColumnCollapse("departments")}
                onAddNew={() => toggleAddNew("departments")}
              />

              {!collapsedColumns.departments ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-2">
                    {selectedBusinessUnit && showAddNew.departments && (
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          placeholder="Novo departamento..."
                          className="flex-1 p-2 text-sm border rounded-l"
                          value={newItemText.departments}
                          onChange={(e) => setNewItemText({ ...newItemText, departments: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddItem("departments")
                              toggleAddNew("departments")
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-l-none"
                          onClick={() => {
                            handleAddItem("departments")
                            toggleAddNew("departments")
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {filteredDepartments.map((dept) => (
                      <div
                        key={dept.id}
                        className={cn(
                          "p-2 mb-1 rounded cursor-pointer flex items-center justify-between",
                          getItemColor("departments", dept.id),
                          selectedDepartment === dept.id ? "ring-2 ring-primary" : "",
                        )}
                        onClick={() => handleSelect("departments", dept.id)}
                      >
                        <span className="truncate">{dept.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => alert("Detalhes do departamento")}>
                              <Info className="mr-2 h-4 w-4" />
                              <span>Detalhar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <X className="mr-2 h-4 w-4" />
                                <span>Cancelar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Erro de cadastro</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Arquivar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Departamento fechado</DropdownMenuItem>
                                <DropdownMenuItem>Departamento absorvido por outra área</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium">Departamentos</div>
                </div>
              )}
            </div>

            {/* Processes Column */}
            <div
              className={cn(
                "border-r transition-all duration-300 flex flex-col",
                collapsedColumns.processes ? "w-10" : "flex-1",
              )}
            >
              <ColumnHeader
                title="Processos"
                isCollapsed={collapsedColumns.processes}
                onToggleCollapse={() => toggleColumnCollapse("processes")}
                onAddNew={() => toggleAddNew("processes")}
              />

              {!collapsedColumns.processes ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-2">
                    {selectedDepartment && showAddNew.processes && (
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          placeholder="Novo processo..."
                          className="flex-1 p-2 text-sm border rounded-l"
                          value={newItemText.processes}
                          onChange={(e) => setNewItemText({ ...newItemText, processes: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddItem("processes")
                              toggleAddNew("processes")
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-l-none"
                          onClick={() => {
                            handleAddItem("processes")
                            toggleAddNew("processes")
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {filteredProcesses.map((process) => (
                      <div
                        key={process.id}
                        className={cn(
                          "p-2 mb-1 rounded cursor-pointer flex items-center justify-between",
                          getItemColor("processes", process.id),
                          selectedProcess === process.id ? "ring-2 ring-primary" : "",
                        )}
                        onClick={() => handleSelect("processes", process.id)}
                        onDoubleClick={() => handleDoubleClick("processes", process.id)}
                      >
                        <span className="truncate">{process.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => setShowProcessModal(true)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Avaliar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <X className="mr-2 h-4 w-4" />
                                <span>Cancelar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Registro incorreto</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Arquivar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Processo não é mais realizado</DropdownMenuItem>
                                <DropdownMenuItem>Processo mudou de formato</DropdownMenuItem>
                                <DropdownMenuItem>Negócio descontinuado</DropdownMenuItem>
                                <DropdownMenuItem>Processo foi incorporado a outro processo</DropdownMenuItem>
                                <DropdownMenuItem>Processo foi terceirizado</DropdownMenuItem>
                                <DropdownMenuItem>Mudança regulatória ou legal</DropdownMenuItem>
                                <DropdownMenuItem>Processo tornou-se inefetivo ou irrelevante</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium">Processos</div>
                </div>
              )}
            </div>

            {/* Controls Column */}
            <div
              className={cn("transition-all duration-300 flex flex-col", collapsedColumns.controls ? "w-10" : "flex-1")}
            >
              <ColumnHeader
                title="Atividades de Controle"
                isCollapsed={collapsedColumns.controls}
                onToggleCollapse={() => toggleColumnCollapse("controls")}
                onAddNew={() => toggleAddNew("controls")}
              />

              {!collapsedColumns.controls ? (
                <div className="flex-1 overflow-auto">
                  <div className="p-2">
                    {selectedProcess && showAddNew.controls && (
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          placeholder="Nova atividade de controle..."
                          className="flex-1 p-2 text-sm border rounded-l"
                          value={newItemText.controls}
                          onChange={(e) => setNewItemText({ ...newItemText, controls: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddItem("controls")
                              toggleAddNew("controls")
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-l-none"
                          onClick={() => {
                            handleAddItem("controls")
                            toggleAddNew("controls")
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {filteredControls.map((control) => (
                      <div
                        key={control.id}
                        className={cn(
                          "p-2 mb-1 rounded cursor-pointer flex items-center justify-between",
                          getItemColor("controls", control.id),
                          selectedControl === control.id ? "ring-2 ring-primary" : "",
                        )}
                        onClick={() => handleSelect("controls", control.id)}
                        onDoubleClick={() => handleDoubleClick("controls", control.id)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, control.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, control.id)}
                      >
                        <span className="truncate">{control.name}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => setShowControlModal(true)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Avaliar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <X className="mr-2 h-4 w-4" />
                                <span>Cancelar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Cadastro incorreto</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Arquivar</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Controle não é mais realizado</DropdownMenuItem>
                                <DropdownMenuItem>Controle mudou de formato</DropdownMenuItem>
                                <DropdownMenuItem>Processo deixou de ser realizado</DropdownMenuItem>
                                <DropdownMenuItem>Negócio descontinuado</DropdownMenuItem>
                                <DropdownMenuItem>Controle foi incorporado a outro controle</DropdownMenuItem>
                                <DropdownMenuItem>Controle foi terceirizado</DropdownMenuItem>
                                <DropdownMenuItem>Sistema automatizado passou a garantir o controle</DropdownMenuItem>
                                <DropdownMenuItem>Mudança regulatória ou legal</DropdownMenuItem>
                                <DropdownMenuItem>Controle tornou-se inefetivo ou irrelevante</DropdownMenuItem>
                                <DropdownMenuItem>Substituição por outro controle mais eficaz</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="transform -rotate-90 whitespace-nowrap text-sm font-medium">
                    Atividades de Controle
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-2 border-t flex gap-2">
          <Button
            variant={showCanceled ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCanceled(!showCanceled)}
          >
            Exibir cancelados
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            Exibir arquivados
          </Button>
        </div>
      </div>

      {showProcessModal && (
        <ProcessEvaluationModal
          onClose={() => setShowProcessModal(false)}
          processName={data.processes.find((p) => p.id === selectedProcess)?.name || ""}
        />
      )}

      {showControlModal && (
        <ControlEvaluationModal
          onClose={() => setShowControlModal(false)}
          controlName={data.controls.find((c) => c.id === selectedControl)?.name || ""}
          processName={data.processes.find((p) => p.id === selectedProcess)?.name || ""}
        />
      )}
    </div>
  )
}
