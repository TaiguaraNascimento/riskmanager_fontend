"use client"

import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ColumnHeaderProps {
  title: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  onAddNew: () => void
}

export default function ColumnHeader({ title, isCollapsed, onToggleCollapse, onAddNew }: ColumnHeaderProps) {
  return (
    <div className="p-2 border-b flex items-center justify-between sticky top-0 bg-white z-10">
      {!isCollapsed ? (
        <>
          <div className="font-medium truncate">{title}</div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onAddNew}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Adicionar</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1" onClick={onToggleCollapse}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Recolher</span>
            </Button>
          </div>
        </>
      ) : (
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 mx-auto" onClick={onToggleCollapse}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Expandir</span>
        </Button>
      )}
    </div>
  )
}
