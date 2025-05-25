"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Check, Clock, FileText, MessageSquare, ThumbsUp, User, X } from "lucide-react"
import ConfirmationModal from "./confirmation-modal"

interface ControlEvaluationModalProps {
  onClose: () => void
  controlName: string
  processName: string
}

export default function ControlEvaluationModal({ onClose, controlName, processName }: ControlEvaluationModalProps) {
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
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Maria Oliveira",
      date: "15/08/2023 10:30",
      text: "Este controle precisa ser revisado para incluir as novas diretrizes regulatórias.",
      likes: 2,
      replies: [],
    },
    {
      id: 2,
      user: "João Silva",
      date: "10/05/2023 14:45",
      text: "Controle avaliado e considerado efetivo para mitigar os riscos identificados.",
      likes: 0,
      replies: [
        {
          id: 3,
          user: "Ana Costa",
          date: "11/05/2023 09:15",
          text: "Concordo com a avaliação. Os controles estão bem desenhados.",
          likes: 1,
        },
      ],
    },
  ])
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
    setSelectedEvaluation(newId)
    setShowConfirmNewEvaluation(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const newCommentObj = {
      id: Math.max(...comments.map((c) => c.id), 0) + 1,
      user: "Usuário Atual",
      date: new Date().toLocaleString("pt-BR"),
      text: newComment,
      likes: 0,
      replies: [],
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim()) return

    const newReply = {
      id: Math.max(...comments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)]), 0) + 1,
      user: "Usuário Atual",
      date: new Date().toLocaleString("pt-BR"),
      text: replyText,
      likes: 0,
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply],
        }
      }
      return comment
    })

    setComments(updatedComments)
    setReplyingTo(null)
    setReplyText("")
  }

  const handleLike = (commentId: number, isReply = false, parentId?: number) => {
    if (isReply && parentId) {
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map((reply) => {
              if (reply.id === commentId) {
                return { ...reply, likes: reply.likes + 1 }
              }
              return reply
            }),
          }
        }
        return comment
      })
      setComments(updatedComments)
    } else {
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      })
      setComments(updatedComments)
    }
  }

  // Define tab colors
  const tabColors = {
    basic: "bg-blue-50 hover:bg-blue-100 data-[state=active]:bg-blue-200",
    design: "bg-green-50 hover:bg-green-100 data-[state=active]:bg-green-200",
    responsible: "bg-purple-50 hover:bg-purple-100 data-[state=active]:bg-purple-200",
    conclusion: "bg-teal-50 hover:bg-teal-100 data-[state=active]:bg-teal-200",
    attachments: "bg-indigo-50 hover:bg-indigo-100 data-[state=active]:bg-indigo-200",
    comments: "bg-gray-50 hover:bg-gray-100 data-[state=active]:bg-gray-200",
  }

  return (
    <>
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl h-[95vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <div className="text-sm text-muted-foreground">Avaliação de Atividade de Controle (ToD)</div>
            <DialogTitle className="text-xl font-semibold">{controlName}</DialogTitle>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>ID: CTR-{Math.floor(Math.random() * 10000)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Mapeado em: 15/03/2023</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Por: Carlos Mendes</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>Processo: {processName}</span>
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

            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-row overflow-hidden">
                {/* Tabs Navigation - Vertical */}
                <div className="w-48 border-r">
                  <TabsList className="flex flex-col h-full w-full space-y-1 rounded-none p-2">
                    <TabsTrigger value="basic" className={`justify-start ${tabColors.basic}`}>
                      Informações Básicas
                    </TabsTrigger>
                    <TabsTrigger value="design" className={`justify-start ${tabColors.design}`}>
                      Desenho do Controle
                    </TabsTrigger>
                    <TabsTrigger value="responsible" className={`justify-start ${tabColors.responsible}`}>
                      Responsáveis
                    </TabsTrigger>
                    <TabsTrigger value="conclusion" className={`justify-start ${tabColors.conclusion}`}>
                      Conclusão
                    </TabsTrigger>
                    <TabsTrigger value="attachments" className={`justify-start ${tabColors.attachments}`}>
                      Anexos
                    </TabsTrigger>
                    <TabsTrigger value="comments" className={`justify-start ${tabColors.comments}`}>
                      Observações
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Evaluation Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1">
                    <TabsContent value="basic" className={`p-4 m-0 h-full ${tabColors.basic}`}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="objective">Objetivo do Controle</Label>
                          <Textarea id="objective" placeholder="Descreva o objetivo do controle..." className="h-24" />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            placeholder="Descreva o controle em detalhes..."
                            className="h-32"
                          />
                        </div>
                        <div>
                          <Label>Criticidade</Label>
                          <RadioGroup defaultValue="medium" className="flex space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="high" id="criticality-high" />
                              <Label htmlFor="criticality-high" className="text-red-500 font-medium">
                                Alta
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="criticality-medium" />
                              <Label htmlFor="criticality-medium" className="text-yellow-500 font-medium">
                                Média
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="low" id="criticality-low" />
                              <Label htmlFor="criticality-low" className="text-green-500 font-medium">
                                Baixa
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label>Tipo de Controle</Label>
                          <RadioGroup defaultValue="semi" className="flex space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="auto" id="type-auto" />
                              <Label htmlFor="type-auto" className="text-blue-500 font-medium">
                                Automático
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="semi" id="type-semi" />
                              <Label htmlFor="type-semi" className="text-purple-500 font-medium">
                                Semiautomático
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="manual" id="type-manual" />
                              <Label htmlFor="type-manual" className="text-orange-500 font-medium">
                                Manual
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label>Frequência</Label>
                          <RadioGroup defaultValue="monthly" className="grid grid-cols-3 gap-2 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="event" id="freq-event" />
                              <Label htmlFor="freq-event">Por evento</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="daily" id="freq-daily" />
                              <Label htmlFor="freq-daily">Diário</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weekly" id="freq-weekly" />
                              <Label htmlFor="freq-weekly">Semanal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="biweekly" id="freq-biweekly" />
                              <Label htmlFor="freq-biweekly">Quinzenal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="monthly" id="freq-monthly" />
                              <Label htmlFor="freq-monthly">Mensal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="quarterly" id="freq-quarterly" />
                              <Label htmlFor="freq-quarterly">Trimestral</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="semiannual" id="freq-semiannual" />
                              <Label htmlFor="freq-semiannual">Semestral</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="annual" id="freq-annual" />
                              <Label htmlFor="freq-annual">Anual</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="none" id="freq-none" />
                              <Label htmlFor="freq-none">Sem periodicidade</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label>Abordagem</Label>
                          <RadioGroup defaultValue="preventive" className="flex space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="preventive" id="approach-preventive" />
                              <Label htmlFor="approach-preventive" className="text-green-500 font-medium">
                                Preventivo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="detective" id="approach-detective" />
                              <Label htmlFor="approach-detective" className="text-blue-500 font-medium">
                                Detectivo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="corrective" id="approach-corrective" />
                              <Label htmlFor="approach-corrective" className="text-red-500 font-medium">
                                Corretivo
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="design" className={`p-4 m-0 h-full ${tabColors.design}`}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q1-yes" />
                                <Label htmlFor="q1-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q1-no" />
                                <Label htmlFor="q1-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Controle documentado?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q2-yes" />
                                <Label htmlFor="q2-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q2-no" />
                                <Label htmlFor="q2-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Timing adequado: atua no ponto certo do processo?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q3-yes" />
                                <Label htmlFor="q3-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q3-no" />
                                <Label htmlFor="q3-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Tem responsável claro?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q4-yes" />
                                <Label htmlFor="q4-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q4-no" />
                                <Label htmlFor="q4-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Está formalizado e documentado?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q5-yes" />
                                <Label htmlFor="q5-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q5-no" />
                                <Label htmlFor="q5-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Gera evidência rastreável?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q6-yes" />
                                <Label htmlFor="q6-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q6-no" />
                                <Label htmlFor="q6-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Possui frequência definida?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q7-yes" />
                                <Label htmlFor="q7-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q7-no" />
                                <Label htmlFor="q7-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>É proporcional ao risco que mitiga?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q8-yes" />
                                <Label htmlFor="q8-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q8-no" />
                                <Label htmlFor="q8-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Controle faz sentido técnico e lógico?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q9-yes" />
                                <Label htmlFor="q9-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q9-no" />
                                <Label htmlFor="q9-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Há lacunas, excessos ou duplicidade?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q10-yes" />
                                <Label htmlFor="q10-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q10-no" />
                                <Label htmlFor="q10-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Está alinhado a políticas, normas e procedimentos aplicáveis?</Label>
                            </div>
                          </div>

                          <div className="p-3 border rounded-md flex items-start space-x-2">
                            <RadioGroup defaultValue="yes" className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q11-yes" />
                                <Label htmlFor="q11-yes">Sim</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q11-no" />
                                <Label htmlFor="q11-no">Não</Label>
                              </div>
                            </RadioGroup>
                            <div className="flex-1">
                              <Label>Controle é proporcionalmente suficiente para mitigar os riscos?</Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="responsible" className={`p-4 m-0 h-full ${tabColors.responsible}`}>
                      <div className="grid grid-cols-2 gap-4 h-full">
                        <div className="border rounded-md p-2">
                          <div className="font-medium mb-2">Responsáveis Disponíveis</div>
                          <div className="space-y-1">
                            <div
                              className="p-2 bg-muted rounded-md flex items-center justify-between cursor-pointer"
                              onDoubleClick={() => {
                                // Add to selected responsibles
                              }}
                            >
                              <span>Ana Silva (Financeiro)</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // Add to selected responsibles
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                            <div
                              className="p-2 bg-muted rounded-md flex items-center justify-between cursor-pointer"
                              onDoubleClick={() => {
                                // Add to selected responsibles
                              }}
                            >
                              <span>Carlos Santos (RH)</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // Add to selected responsibles
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                            <div
                              className="p-2 bg-muted rounded-md flex items-center justify-between cursor-pointer"
                              onDoubleClick={() => {
                                // Add to selected responsibles
                              }}
                            >
                              <span>Mariana Costa (Operações)</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // Add to selected responsibles
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-md p-2">
                          <div className="font-medium mb-2">Responsáveis Selecionados</div>
                          <div className="space-y-1">
                            <div className="p-2 bg-muted rounded-md flex items-center justify-between">
                              <span>Ana Silva (Financeiro)</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => {
                                  // Remove from selected responsibles
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="conclusion" className={`p-4 m-0 h-full ${tabColors.conclusion}`}>
                      <div className="space-y-4">
                        <div>
                          <Label>Conclusão do ToD</Label>
                          <RadioGroup defaultValue="effective" className="flex space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="effective" id="conclusion-effective" />
                              <Label htmlFor="conclusion-effective" className="text-green-500 font-medium">
                                Efetivo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="partially" id="conclusion-partially" />
                              <Label htmlFor="conclusion-partially" className="text-yellow-500 font-medium">
                                Parcialmente Efetivo
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="ineffective" id="conclusion-ineffective" />
                              <Label htmlFor="conclusion-ineffective" className="text-red-500 font-medium">
                                Inefetivo
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label htmlFor="conclusion-notes">Observações da Conclusão</Label>
                          <Textarea
                            id="conclusion-notes"
                            placeholder="Observações sobre a conclusão da avaliação..."
                            className="h-32"
                          />
                        </div>
                        <Button className="mt-4">Concluir Avaliação</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="attachments" className={`p-4 m-0 h-full ${tabColors.attachments}`}>
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
                          <div className="p-2 border rounded-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>documento-suporte.pdf</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="comments" className={`p-4 m-0 h-full ${tabColors.comments}`}>
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
                          <Button className="mt-2" onClick={handleAddComment}>
                            Comentar
                          </Button>
                        </div>

                        <div className="space-y-4 mt-4">
                          {comments.map((comment) => (
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
                                <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
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
                                    <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                                      Responder
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                                      Cancelar
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {comment.replies.length > 0 && (
                                <div className="mt-3 pl-4 border-l-2 space-y-3">
                                  {comment.replies.map((reply) => (
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
                                        onClick={() => handleLike(reply.id, true, comment.id)}
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
