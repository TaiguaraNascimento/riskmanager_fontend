"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Calendar,
  Check,
  Clock,
  FileText,
  MessageSquare,
  ThumbsUp,
  User,
  X,
  Info,
  Users,
  FileInput,
  Monitor,
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Paperclip,
  MessageCircle,
} from "lucide-react"
import ConfirmationModal from "./confirmation-modal"

interface ProcessEvaluationModalProps {
  onClose: () => void
  processName: string
}

interface EvaluationData {
  basic: {
    objective: string
    description: string
    relevance: string
  }
  stakeholders: {
    selected: string[]
  }
  details: {
    suppliers: string
    inputs: string
    process: string
    outputs: string
    customers: string
  }
  systems: {
    selected: string[]
  }
  conclusion: {
    efficiency: string
    status: string
  }
  attachments: any[]
  comments: any[]
}

export default function ProcessEvaluationModal({ onClose, processName }: ProcessEvaluationModalProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [evaluations, setEvaluations] = useState([
    { id: 1, date: "2023-05-10", user: "João Silva" },
    { id: 2, date: "2023-08-15", user: "Maria Oliveira" },
  ])
  const [selectedEvaluation, setSelectedEvaluation] = useState(2)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [showConfirmSave, setShowConfirmSave] = useState(false)
  const [showConfirmNewEvaluation, setShowConfirmNewEvaluation] = useState(false)
  const [newEvaluationType, setNewEvaluationType] = useState<"new" | "copy">("new")

  // Store evaluation data per evaluation ID
  const [evaluationData, setEvaluationData] = useState<Record<number, EvaluationData>>({
    1: {
      basic: { objective: "Objetivo da avaliação 1", description: "Descrição da avaliação 1", relevance: "high" },
      stakeholders: { selected: ["Diretoria Financeira"] },
      details: { suppliers: "", inputs: "", process: "", outputs: "", customers: "" },
      systems: { selected: ["SAP"] },
      conclusion: { efficiency: "", status: "effective" },
      attachments: [],
      comments: [],
    },
    2: {
      basic: { objective: "Objetivo da avaliação 2", description: "Descrição da avaliação 2", relevance: "medium" },
      stakeholders: { selected: ["Diretoria Financeira", "Gerência de RH"] },
      details: { suppliers: "", inputs: "", process: "", outputs: "", customers: "" },
      systems: { selected: ["SAP", "Microsoft 365"] },
      conclusion: { efficiency: "", status: "partially" },
      attachments: [],
      comments: [],
    },
  })

  const currentEvalData = evaluationData[selectedEvaluation] || {
    basic: { objective: "", description: "", relevance: "medium" },
    stakeholders: { selected: [] },
    details: { suppliers: "", inputs: "", process: "", outputs: "", customers: "" },
    systems: { selected: [] },
    conclusion: { efficiency: "", status: "effective" },
    attachments: [],
    comments: [],
  }

  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleClose = () => {
    setShowConfirmClose(true)
  }

  const confirmClose = () => {
    setShowConfirmClose(false)
    onClose()
  }

  const handleSave = () => {
    setShowConfirmSave(true)
  }

  const confirmSave = () => {
    setShowConfirmSave(false)
    onClose()
  }

  const handleAddEvaluation = () => {
    setShowConfirmNewEvaluation(true)
  }

  const confirmAddEvaluation = () => {
    const newId = Math.max(...evaluations.map((e) => e.id)) + 1
    const newEvaluation = {
      id: newId,
      date: new Date().toISOString().split("T")[0],
      user: "Usuário Atual",
    }

    setEvaluations([...evaluations, newEvaluation])

    // Create new evaluation data
    if (newEvaluationType === "copy" && evaluationData[selectedEvaluation]) {
      // Deep copy the current evaluation data
      setEvaluationData({
        ...evaluationData,
        [newId]: JSON.parse(JSON.stringify(evaluationData[selectedEvaluation])),
      })
    } else {
      // Create blank evaluation
      setEvaluationData({
        ...evaluationData,
        [newId]: {
          basic: { objective: "", description: "", relevance: "medium" },
          stakeholders: { selected: [] },
          details: { suppliers: "", inputs: "", process: "", outputs: "", customers: "" },
          systems: { selected: [] },
          conclusion: { efficiency: "", status: "effective" },
          attachments: [],
          comments: [],
        },
      })
    }

    setSelectedEvaluation(newId)
    setShowConfirmNewEvaluation(false)
  }

  // Tab configuration with icons
  const tabs = [
    { value: "basic", label: "Informações Básicas", icon: Info, color: "bg-blue-500" },
    { value: "stakeholders", label: "Stakeholders", icon: Users, color: "bg-green-500" },
    { value: "details", label: "Detalhamento", icon: FileInput, color: "bg-purple-500" },
    { value: "systems", label: "Sistemas", icon: Monitor, color: "bg-yellow-500" },
    { value: "compliance", label: "Compliance", icon: Shield, color: "bg-red-500" },
    { value: "kpis", label: "Indicadores", icon: BarChart3, color: "bg-orange-500" },
    { value: "risks", label: "Riscos", icon: AlertTriangle, color: "bg-pink-500" },
    { value: "conclusion", label: "Conclusão", icon: CheckCircle, color: "bg-teal-500" },
    { value: "attachments", label: "Anexos", icon: Paperclip, color: "bg-indigo-500" },
    { value: "comments", label: "Observações", icon: MessageCircle, color: "bg-gray-500" },
  ]

  return (
    <>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-6xl h-[95vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <div className="text-sm text-muted-foreground">Avaliação de Processo</div>
            <DialogTitle className="text-xl font-semibold">{processName}</DialogTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>ID: PRO-{Math.floor(Math.random() * 10000)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Mapeado em: 15/03/2023</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Por: Carlos Mendes</span>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 flex overflow-hidden">
            {/* Evaluations List */}
            <div className="w-48 border-r p-2 flex flex-col">
              <div className="text-sm font-medium mb-2">Avaliações</div>
              <div className="flex-1 overflow-auto">
                {evaluations.map((evaluation) => (
                  <div
                    key={evaluation.id}
                    className={`p-2 mb-1 rounded cursor-pointer text-xs ${
                      selectedEvaluation === evaluation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedEvaluation(evaluation.id)}
                  >
                    <div className="font-medium">{evaluation.date}</div>
                    <div className="text-muted-foreground">{evaluation.user}</div>
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2" onClick={handleAddEvaluation}>
                Nova Avaliação
              </Button>
            </div>

            {/* Tabs Navigation - Vertical */}
            {/* Evaluation Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-row overflow-hidden">
                {/* Tabs Navigation - Vertical Excel-like */}
                <div className="flex border-r bg-gray-50">
                  <TabsList className="flex flex-col h-full w-auto space-y-0 rounded-none p-0 bg-transparent">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "relative h-32 w-10 rounded-none border-b border-gray-200",
                          "data-[state=active]:bg-white data-[state=active]:border-l-4",
                          "hover:bg-gray-100 transition-colors",
                          "p-0 flex flex-col items-center justify-center gap-1",
                          activeTab === tab.value && `border-l-4 ${tab.color.replace("bg-", "border-")}`,
                        )}
                      >
                        <div className={cn("absolute inset-0 opacity-10", activeTab === tab.value && tab.color)} />
                        <tab.icon className="h-4 w-4 relative z-10" />
                        <span className="text-[10px] font-medium writing-mode-vertical relative z-10 leading-none">
                          {tab.label.split("").map((char, i) => (
                            <span key={i} className="block">
                              {char}
                            </span>
                          ))}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Evaluation Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1">
                    <TabsContent value="basic" className="p-4 m-0 h-full">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="objective">Objetivo do Processo</Label>
                          <Textarea
                            id="objective"
                            placeholder="Descreva o objetivo do processo..."
                            className="h-24"
                            value={currentEvalData.basic.objective}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  basic: { ...currentEvalData.basic, objective: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            placeholder="Descreva o processo em detalhes..."
                            className="h-32"
                            value={currentEvalData.basic.description}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  basic: { ...currentEvalData.basic, description: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Relevância</Label>
                          <RadioGroup
                            value={currentEvalData.basic.relevance}
                            className="flex space-x-4 mt-2"
                            onValueChange={(value) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  basic: { ...currentEvalData.basic, relevance: value },
                                },
                              })
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="high" id="high" />
                              <Label htmlFor="high" className="text-red-500 font-medium">
                                Alta
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="medium" />
                              <Label htmlFor="medium" className="text-yellow-500 font-medium">
                                Média
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="low" id="low" />
                              <Label htmlFor="low" className="text-green-500 font-medium">
                                Baixa
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="stakeholders" className="p-4 m-0 h-full">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="border rounded-md p-2">
                          <div className="font-medium mb-2">Stakeholders Disponíveis</div>
                          <div className="space-y-1">
                            {["Diretoria Financeira", "Gerência de RH", "Equipe de Operações", "Auditoria Interna"].map(
                              (stakeholder) => (
                                <div
                                  key={stakeholder}
                                  className="p-2 bg-muted rounded-md flex items-center justify-between cursor-pointer"
                                  onDoubleClick={() => {
                                    if (!currentEvalData.stakeholders.selected.includes(stakeholder)) {
                                      setEvaluationData({
                                        ...evaluationData,
                                        [selectedEvaluation]: {
                                          ...currentEvalData,
                                          stakeholders: {
                                            selected: [...currentEvalData.stakeholders.selected, stakeholder],
                                          },
                                        },
                                      })
                                    }
                                  }}
                                >
                                  <span>{stakeholder}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      if (!currentEvalData.stakeholders.selected.includes(stakeholder)) {
                                        setEvaluationData({
                                          ...evaluationData,
                                          [selectedEvaluation]: {
                                            ...currentEvalData,
                                            stakeholders: {
                                              selected: [...currentEvalData.stakeholders.selected, stakeholder],
                                            },
                                          },
                                        })
                                      }
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="border rounded-md p-2">
                          <div className="font-medium mb-2">Stakeholders Selecionados</div>
                          <div className="space-y-1">
                            {currentEvalData.stakeholders.selected.map((stakeholder) => (
                              <div
                                key={stakeholder}
                                className="p-2 bg-muted rounded-md flex items-center justify-between"
                              >
                                <span>{stakeholder}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEvaluationData({
                                      ...evaluationData,
                                      [selectedEvaluation]: {
                                        ...currentEvalData,
                                        stakeholders: {
                                          selected: currentEvalData.stakeholders.selected.filter(
                                            (s) => s !== stakeholder,
                                          ),
                                        },
                                      },
                                    })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="p-4 m-0 h-full">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="suppliers">Fornecedores (Suppliers)</Label>
                          <Textarea
                            id="suppliers"
                            placeholder="Quem fornece insumos para o processo..."
                            className="h-20"
                            value={currentEvalData.details.suppliers}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  details: { ...currentEvalData.details, suppliers: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="inputs">Entradas (Inputs)</Label>
                          <Textarea
                            id="inputs"
                            placeholder="O que entra no processo..."
                            className="h-20"
                            value={currentEvalData.details.inputs}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  details: { ...currentEvalData.details, inputs: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="process">Processos (Process)</Label>
                          <Textarea
                            id="process"
                            placeholder="Como o processo funciona..."
                            className="h-20"
                            value={currentEvalData.details.process}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  details: { ...currentEvalData.details, process: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="outputs">Saídas (Outputs)</Label>
                          <Textarea
                            id="outputs"
                            placeholder="O que sai do processo..."
                            className="h-20"
                            value={currentEvalData.details.outputs}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  details: { ...currentEvalData.details, outputs: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor="customers">Clientes (Customers)</Label>
                          <Textarea
                            id="customers"
                            placeholder="Quem recebe as saídas do processo..."
                            className="h-20"
                            value={currentEvalData.details.customers}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  details: { ...currentEvalData.details, customers: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="systems" className="p-4 m-0 h-full">
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="border rounded-md p-2">
                          <div className="font-medium mb-2">Sistemas Disponíveis</div>
                          <Input type="text" placeholder="Pesquisar sistemas..." className="mb-2" />
                          <div className="space-y-1">
                            {["SAP", "Microsoft 365", "Salesforce", "Oracle", "Jira"].map((system) => (
                              <div
                                key={system}
                                className="p-2 bg-muted rounded-md flex items-center justify-between cursor-pointer"
                                onDoubleClick={() => {
                                  if (!currentEvalData.systems.selected.includes(system)) {
                                    setEvaluationData({
                                      ...evaluationData,
                                      [selectedEvaluation]: {
                                        ...currentEvalData,
                                        systems: {
                                          selected: [...currentEvalData.systems.selected, system],
                                        },
                                      },
                                    })
                                  }
                                }}
                              >
                                <span>{system}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    if (!currentEvalData.systems.selected.includes(system)) {
                                      setEvaluationData({
                                        ...evaluationData,
                                        [selectedEvaluation]: {
                                          ...currentEvalData,
                                          systems: {
                                            selected: [...currentEvalData.systems.selected, system],
                                          },
                                        },
                                      })
                                    }
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border rounded-md p-2">
                          <div className="font-medium mb-2">Sistemas Selecionados</div>
                          <div className="space-y-1">
                            {currentEvalData.systems.selected.map((system) => (
                              <div key={system} className="p-2 bg-muted rounded-md flex items-center justify-between">
                                <span>{system}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEvaluationData({
                                      ...evaluationData,
                                      [selectedEvaluation]: {
                                        ...currentEvalData,
                                        systems: {
                                          selected: currentEvalData.systems.selected.filter((s) => s !== system),
                                        },
                                      },
                                    })
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="conclusion" className="p-4 m-0 h-full">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="efficiency">Avaliação de Eficiência</Label>
                          <Textarea
                            id="efficiency"
                            placeholder="Avalie a eficiência do processo..."
                            className="h-32"
                            value={currentEvalData.conclusion.efficiency}
                            onChange={(e) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  conclusion: { ...currentEvalData.conclusion, efficiency: e.target.value },
                                },
                              })
                            }}
                          />
                        </div>
                        <div>
                          <Label>Conclusão</Label>
                          <RadioGroup
                            value={currentEvalData.conclusion.status}
                            className="flex space-x-4 mt-2"
                            onValueChange={(value) => {
                              setEvaluationData({
                                ...evaluationData,
                                [selectedEvaluation]: {
                                  ...currentEvalData,
                                  conclusion: { ...currentEvalData.conclusion, status: value },
                                },
                              })
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="effective" id="effective" />
                              <Label htmlFor="effective" className="text-green-500 font-medium">
                                Efetivo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="partially" id="partially" />
                              <Label htmlFor="partially" className="text-yellow-500 font-medium">
                                Parcialmente Efetivo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="ineffective" id="ineffective" />
                              <Label htmlFor="ineffective" className="text-red-500 font-medium">
                                Não Efetivo
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <Button className="mt-4">Concluir Avaliação</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="attachments" className="p-4 m-0 h-full">
                      <div className="border-2 border-dashed rounded-md p-8 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="h-10 w-10 text-muted-foreground" />
                          <div className="text-lg font-medium">Arraste e solte arquivos aqui</div>
                          <div className="text-sm text-muted-foreground">ou</div>
                          <Button>Selecionar Arquivos</Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="font-medium mb-2">Arquivos Anexados</div>
                        <div className="space-y-2">
                          {currentEvalData.attachments.map((file: any, index: number) => (
                            <div key={index} className="p-2 border rounded-md flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>{file.name}</span>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="comments" className="p-4 m-0 h-full">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="new-comment">Novo Comentário</Label>
                          <Textarea
                            id="new-comment"
                            placeholder="Adicione um comentário..."
                            className="h-24"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button
                            className="mt-2"
                            onClick={() => {
                              if (newComment.trim()) {
                                const newCommentObj = {
                                  id: Date.now(),
                                  user: "Usuário Atual",
                                  date: new Date().toLocaleString("pt-BR"),
                                  text: newComment,
                                  likes: 0,
                                  replies: [],
                                }
                                setEvaluationData({
                                  ...evaluationData,
                                  [selectedEvaluation]: {
                                    ...currentEvalData,
                                    comments: [newCommentObj, ...currentEvalData.comments],
                                  },
                                })
                                setNewComment("")
                              }
                            }}
                          >
                            Comentar
                          </Button>
                        </div>

                        <div className="space-y-4 mt-4">
                          {currentEvalData.comments.map((comment: any) => (
                            <div key={comment.id} className="p-3 border rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">{comment.user}</div>
                                <div className="text-xs text-muted-foreground">{comment.date}</div>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Responder
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedComments = currentEvalData.comments.map((c: any) =>
                                      c.id === comment.id ? { ...c, likes: c.likes + 1 } : c,
                                    )
                                    setEvaluationData({
                                      ...evaluationData,
                                      [selectedEvaluation]: {
                                        ...currentEvalData,
                                        comments: updatedComments,
                                      },
                                    })
                                  }}
                                >
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {comment.likes > 0 && comment.likes}
                                </Button>
                              </div>

                              {replyingTo === comment.id && (
                                <div className="mt-2 pl-4 border-l-2">
                                  <Textarea
                                    placeholder="Escreva sua resposta..."
                                    className="h-16 text-sm"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                  />
                                  <div className="flex gap-2 mt-1">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        if (replyText.trim()) {
                                          const newReply = {
                                            id: Date.now(),
                                            user: "Usuário Atual",
                                            date: new Date().toLocaleString("pt-BR"),
                                            text: replyText,
                                            likes: 0,
                                          }
                                          const updatedComments = currentEvalData.comments.map((c: any) =>
                                            c.id === comment.id ? { ...c, replies: [...c.replies, newReply] } : c,
                                          )
                                          setEvaluationData({
                                            ...evaluationData,
                                            [selectedEvaluation]: {
                                              ...currentEvalData,
                                              comments: updatedComments,
                                            },
                                          })
                                          setReplyingTo(null)
                                          setReplyText("")
                                        }
                                      }}
                                    >
                                      Responder
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setReplyingTo(null)
                                        setReplyText("")
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 space-y-3">
                                  {comment.replies.map((reply: any) => (
                                    <div key={reply.id} className="p-2 bg-muted rounded-md">
                                      <div className="flex items-center justify-between mb-1">
                                        <div className="font-medium text-sm">{reply.user}</div>
                                        <div className="text-xs text-muted-foreground">{reply.date}</div>
                                      </div>
                                      <p className="text-sm">{reply.text}</p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-1"
                                        onClick={() => {
                                          const updatedComments = currentEvalData.comments.map((c: any) => {
                                            if (c.id === comment.id) {
                                              return {
                                                ...c,
                                                replies: c.replies.map((r: any) =>
                                                  r.id === reply.id ? { ...r, likes: r.likes + 1 } : r,
                                                ),
                                              }
                                            }
                                            return c
                                          })
                                          setEvaluationData({
                                            ...evaluationData,
                                            [selectedEvaluation]: {
                                              ...currentEvalData,
                                              comments: updatedComments,
                                            },
                                          })
                                        }}
                                      >
                                        <ThumbsUp className="h-3 w-3 mr-1" />
                                        {reply.likes > 0 && reply.likes}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Other tabs would be implemented similarly */}
                  </ScrollArea>
                </div>
              </Tabs>

              <DialogFooter className="p-4 border-t">
                <div className="flex items-center text-xs text-muted-foreground mr-auto gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Última atualização: Hoje às 14:30</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>Por: Usuário Atual</span>
                  </div>
                </div>
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Salvar</Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modals */}
      <ConfirmationModal
        open={showConfirmClose}
        onClose={() => setShowConfirmClose(false)}
        onConfirm={confirmClose}
        title="Fechar avaliação"
        description="Tem certeza que deseja fechar? Alterações não salvas serão perdidas."
      />

      <ConfirmationModal
        open={showConfirmSave}
        onClose={() => setShowConfirmSave(false)}
        onConfirm={confirmSave}
        title="Salvar alterações"
        description="Tem certeza que deseja salvar as alterações?"
      />

      <ConfirmationModal
        open={showConfirmNewEvaluation}
        onClose={() => setShowConfirmNewEvaluation(false)}
        onConfirm={confirmAddEvaluation}
        title="Nova avaliação"
        description="Deseja criar uma nova avaliação?"
      >
        <div className="flex flex-col gap-2 py-2">
          <div className="flex items-center space-x-2">
            <RadioGroup
              value={newEvaluationType}
              onValueChange={(value) => setNewEvaluationType(value as "new" | "copy")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new-eval" />
                <Label htmlFor="new-eval">Criar avaliação em branco</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="copy" id="copy-eval" />
                <Label htmlFor="copy-eval">Copiar da avaliação anterior</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </ConfirmationModal>
    </>
  )
}
