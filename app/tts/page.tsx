"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Loader2, AlertCircle, CheckCircle, XCircle, User, Volume2, ArrowLeft, BarChart3 } from "lucide-react"

import UniversalTextInput from "@/components/universal-text-input"
import OriginalAudioPlayer from "@/components/original-audio-player"
import { TEST_PROMPTS } from "@/lib/test-prompts"

const TTS_MODELS_API = "/api/tts/models"
const TTS_SYNTH_API = "/api/tts/synthesize"
const SC_API = "/api/spellcheck"

type ModelType = "ss" | "ms"
type LanguageType = "akan-twi" | "ewe"

interface TTSModelInfo {
  model_id: string
  model_type: ModelType
  description: string
  available_speakers: (string | number)[]
}

function coerceToString(v: unknown): string {
  if (typeof v === "string") return v
  if (v == null) return ""
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>
    if (typeof obj.text === "string") return obj.text
    if (typeof obj.value === "string") return obj.value
  }
  try {
    return String(v)
  } catch {
    return ""
  }
}

export default function TTSPage() {
  const [models, setModels] = useState<TTSModelInfo[]>([])
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<TTSModelInfo | null>(null)
  const [text, setText] = useState<string>("")
  const [speaker, setSpeaker] = useState<string | number>("")
  const [language, setLanguage] = useState<LanguageType>("akan-twi")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")

  const fetchModels = async () => {
    try {
      const res = await fetch(TTS_MODELS_API, { method: "GET" })
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const data = await res.json()
      if (Array.isArray(data?.models)) {
        setModels(data.models)
        setSelectedModelId(data.models[0]?.model_id || "")
        setSelectedModel(data.models[0] || null)
        setConnectionStatus("connected")
        const defaultSpeaker = data.models[0]?.available_speakers?.[0]
        if (typeof defaultSpeaker !== "undefined") setSpeaker(defaultSpeaker)
      } else {
        setConnectionStatus("disconnected")
        setError("No models available")
      }
    } catch (err) {
      console.error("Failed to fetch models:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch models")
      setConnectionStatus("disconnected")
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const synthesizeSpeech = async (overrideText?: unknown) => {
    const effectiveText = coerceToString(overrideText ?? text).trim()
    if (!selectedModel || !effectiveText) {
      setError("Please select a model and enter text")
      return
    }
    if (selectedModel.model_type === "ss" && (speaker === "" || speaker === undefined || speaker === null)) {
      setError("Please select a speaker for the single-speaker model")
      return
    }

    setIsLoading(true)
    setError(null)
    setAudioUrl(null)

    try {
      // Use external Ewe TTS API if language is Ewe
      if (language === "ewe") {
        const res = await fetch("https://ewetts-665982348005.africa-south1.run.app/synthesize_file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: effectiveText,
            model: "best_model.pth"
          }),
        })

        if (!res.ok) {
          const textErr = await res.text()
          throw new Error(textErr || `HTTP ${res.status}: ${res.statusText}`)
        }

        const audioBlob = await res.blob()
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
      } else {
        // Use existing Akan-Twi TTS API
        const res = await fetch(TTS_SYNTH_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: effectiveText,
            model_type: selectedModel.model_type,
            speaker: speaker
          }),
        })

        const contentType = res.headers.get("content-type") || ""
        if (!res.ok) {
          const textErr = await res.text()
          throw new Error(textErr || `HTTP ${res.status}: ${res.statusText}`)
        }

        if (contentType.includes("audio")) {
          const audioBlob = await res.blob()
          const url = URL.createObjectURL(audioBlob)
          setAudioUrl(url)
        } else {
          const errText = await res.text()
          throw new Error(errText || "Unexpected TTS response")
        }
      }
    } catch (err) {
      console.error("Synthesis failed:", err)
      setError(err instanceof Error ? err.message : "Failed to synthesize speech")
    } finally {
      setIsLoading(false)
    }
  }

  const getHealthIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const quickSetPrompt = (id: string) => {
    const p = TEST_PROMPTS.find((pp) => pp.id === id)
    if (!p) return
    setText(p.text)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <h1 className="text-3xl font-bold">Text-to-Speech Interface</h1>
            <Button variant="outline" onClick={() => (window.location.href = "/tts/evaluation")}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Evaluation
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {getHealthIcon()}
              <span>Status: {connectionStatus}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
              <CardDescription>Choose a TTS model for synthesis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div>
                <Label htmlFor="language-select">Language</Label>
                <Select
                  value={language}
                  onValueChange={(val) => setLanguage(val as LanguageType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="akan-twi">Akan-Twi</SelectItem>
                    <SelectItem value="ewe">Ewe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model-select">Available Models</Label>
                <Select
                  value={selectedModelId}
                  onValueChange={(id) => {
                    setSelectedModelId(id)
                    const m = models.find((mm) => mm.model_id === id) || null
                    setSelectedModel(m)
                    const defaultSpeaker = m?.available_speakers?.[0]
                    if (typeof defaultSpeaker !== "undefined") setSpeaker(defaultSpeaker)
                    else setSpeaker("")
                  }}
                  disabled={connectionStatus !== "connected" || language === "ewe"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m.model_id} value={m.model_id}>
                        <div className="flex flex-col">
                          <span>{m.model_id}</span>
                          <span className="text-xs text-muted-foreground">
                            Type: {m.model_type.toUpperCase()} • Speakers: {m.available_speakers?.length || 0}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {language === "ewe" && (
                  <p className="text-xs text-muted-foreground mt-1">Model selection disabled for Ewe language</p>
                )}
              </div>

              {/* Speaker Selection */}
              {selectedModel && selectedModel.available_speakers?.length > 0 && language !== "ewe" && (
                <div className="space-y-2">
                  <Label htmlFor="speaker-select" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Voice Selection
                  </Label>
                  <Select value={String(speaker)} onValueChange={(v) => setSpeaker(isNaN(Number(v)) ? v : Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedModel.available_speakers.map((spk, idx) => (
                        <SelectItem key={`${spk}-${idx}`} value={String(spk)}>
                          <div className="flex items-center gap-2">
                            <Volume2 className="h-4 w-4" />
                            <span>{String(spk)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Select the voice that will speak your text</p>
                </div>
              )}

              {/* Model Info */}
              {selectedModel && language !== "ewe" && (
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium">Model Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Model ID:</strong> {selectedModel.model_id}
                    </p>
                    <p>
                      <strong>Type:</strong> {selectedModel.model_type.toUpperCase()}
                    </p>
                    {selectedModel.description && (
                      <p>
                        <strong>Description:</strong> {selectedModel.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">Speakers: {selectedModel.available_speakers?.length || 0}</Badge>
                    </div>
                  </div>
                </div>
              )}

              {language === "ewe" && (
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium">Model Information</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Model:</strong> best_model.pth
                    </p>
                    <p>
                      <strong>Language:</strong> Ewe
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">External API</Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Text Input + Quick Prompts */}
          <Card>
            <CardHeader>
              <CardTitle>Text Input</CardTitle>
              <CardDescription>Enter the text you want to convert to speech</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">Text to Synthesize</Label>
                <UniversalTextInput
                  id="text-input"
                  value={text}
                  onChange={(val) => setText(coerceToString(val))}
                  placeholder="Enter your text here..."
                  rows={6}
                  type="textarea"
                  enableSpellCheck={true}
                  enableKeyboard={true}
                  apiBase={SC_API}
                  className="mt-2"
                  spellcheckModelName="akan-twi"
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Prompts</Label>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => quickSetPrompt("very-short")}>
                    Very short
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => quickSetPrompt("short")}>
                    Short
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => quickSetPrompt("normal")}>
                    Normal
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => quickSetPrompt("long")}>
                    Long
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => quickSetPrompt("extremely-long")}>
                    Extremely long
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => synthesizeSpeech()}
                  disabled={
                    (language === "akan-twi" && !selectedModel) || !coerceToString(text).trim() || isLoading || (language === "akan-twi" && connectionStatus !== "connected")
                  }
                  className="flex items-center gap-2"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                  {isLoading ? "Synthesizing..." : "Generate Speech"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audio Output */}
        {audioUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Speaker sample (if available) */}
            {selectedModel && selectedModel.available_speakers?.length > 0 && speaker !== "" && language !== "ewe" && (
              <OriginalAudioPlayer
                speaker={speaker}
                apiBase="/api/tts/synthesize"
                className="h-fit"
                modelType={selectedModel.model_type}
              />
            )}

            {/* Generated audio */}
            <Card className={(speaker && language !== "ewe") ? "" : "lg:col-span-2"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Generated Audio
                </CardTitle>
                <CardDescription>Your synthesized speech</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>

                <Button
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement("a")
                    a.href = audioUrl
                    a.download = `tts_${language}_${selectedModel?.model_id || "model"}_${Date.now()}.wav`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                  }}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Audio
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}