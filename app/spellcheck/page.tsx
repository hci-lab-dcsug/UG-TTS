"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wand2, ArrowLeft, Volume2, AlertCircle, CheckCircle, Copy, RotateCcw, FileText, Loader2 } from "lucide-react"
import UniversalTextInput from "@/components/universal-text-input"

const SC_API = "/api/spellcheck"

interface SpellCheckWord {
  word: string
  correct?: boolean
  suggestions?: string[]
}

interface SpellCheckResponse {
  results: SpellCheckWord[]
}

interface SpellcheckerModel {
  name: string
  language: string
  description: string
  word_count: number
  phonetic_keys: number
  is_active: boolean
}

const SAMPLE_TEXTS = [
  {
    name: "Sample 1",
    text: "Nantwinini bi a n'ahosuo yɛ tuntum, na fitaa deda mu gyina nwura bi mu rewe nsensan.",
  },
  {
    name: "Sample 2",
    text: "Awia apue wɔ wiem ama wiem ahyerɛn pa ara. Ewiem da hɔ fann.",
  },
  {
    name: "Sample 3",
    text: "Ɔbabaa biara a wɔwoo no Memeneda wɔ Akanman mu no de Ama.",
  },
]

export default function SpellCheckPage() {
  const [sentenceText, setSentenceText] = useState("")
  const [wordText, setWordText] = useState("")
  const [models, setModels] = useState<SpellcheckerModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("default")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentenceResult, setSentenceResult] = useState<SpellCheckResponse | null>(null)
  const [wordResult, setWordResult] = useState<{ original: string; corrected: string; suggestions: string[] } | null>(
    null,
  )
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected">("connected")

  const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      })
      if (!response.ok) {
        let message = `HTTP ${response.status}: ${response.statusText}`
        try {
          const data = await response.json()
          if (data?.detail || data?.message) message = data.detail || data.message
        } catch {}
        throw new Error(message)
      }
      return response
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
        throw new Error("Network error - unable to connect to server. Please check if the server is running.")
      }
      throw err
    }
  }

  useEffect(() => {
    const loadModels = async () => {
      try {
        const res = await fetchWithErrorHandling(`${SC_API}/models`)
        const data = await res.json()
        if (Array.isArray(data?.models)) {
          setModels(data.models)
          if (data.models.length > 0) setSelectedModel(data.models[0].name)
          setConnectionStatus("connected")
        } else {
          setConnectionStatus("disconnected")
        }
      } catch (err) {
        console.error(err)
        setConnectionStatus("disconnected")
      }
    }
    loadModels()
  }, [])

  const checkSentence = async () => {
    if (!sentenceText.trim()) {
      setError("Please enter text to check")
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchWithErrorHandling(`${SC_API}/spellcheck`, {
        method: "POST",
        body: JSON.stringify({ text: sentenceText.trim(), model_name: selectedModel }),
      })
      const data: SpellCheckResponse = await response.json()
      setSentenceResult(data)
    } catch (err) {
      console.error("Sentence spell check failed:", err)
      setError(err instanceof Error ? err.message : "Failed to perform spell check")
    } finally {
      setIsLoading(false)
    }
  }

  const getCorrectedText = () => {
    if (!sentenceResult?.results || sentenceResult.results.length === 0) return sentenceText
    let corrected = sentenceText
    sentenceResult.results.forEach((item) => {
      if (item.correct === false && item.suggestions && item.suggestions.length > 0) {
        const pattern = new RegExp(`\\b${item.word}\\b`, "gi")
        corrected = corrected.replace(pattern, item.suggestions[0])
      }
    })
    return corrected
  }

  const checkWord = async () => {
    if (!wordText.trim()) {
      setError("Please enter a word to check")
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchWithErrorHandling(`${SC_API}/suggest`, {
        method: "POST",
        body: JSON.stringify({
          word: wordText.trim(),
          model_name: selectedModel,
          max_suggestions: 5,
        }),
      })
      const data = await response.json()
      const suggestions: string[] = Array.isArray(data?.suggestions) ? data.suggestions : []
      setWordResult({
        original: wordText.trim(),
        corrected: suggestions[0] || wordText.trim(),
        suggestions,
      })
    } catch (err) {
      console.error("Word spell check failed:", err)
      setError(err instanceof Error ? err.message : "Failed to perform spell check")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const handleSampleSelect = (sampleText: string) => {
    setSentenceText(sampleText)
    setSentenceResult(null)
  }

  const resetSentenceForm = () => {
    setSentenceText("")
    setSentenceResult(null)
    setError(null)
  }

  const resetWordForm = () => {
    setWordText("")
    setWordResult(null)
    setError(null)
  }

  const getCorrections = () => {
    if (!sentenceResult?.results) return []
    return sentenceResult.results
      .filter((w) => w.correct === false && (w.suggestions?.length || 0) > 0)
      .map((w) => ({
        original: w.word,
        corrected: w.suggestions![0],
      }))
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
            <h1 className="text-3xl font-bold">Akan Spell Checker</h1>
            <Button variant="outline" onClick={() => (window.location.href = "/tts")}>
              <Volume2 className="h-4 w-4 mr-2" />
              TTS
            </Button>
          </div>
          <p className="text-muted-foreground">Automatically check spelling in Akan text using the latest service</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>Select the spell-checking model to use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="model-select">Correction Model</Label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={connectionStatus !== "connected"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.name} value={m.name}>
                      {m.name}
                    </SelectItem>
                  ))}
                  {models.length === 0 && <SelectItem value="default">default</SelectItem>}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Different models may vary in accuracy and speed</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sentence" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sentence">Sentence Correction</TabsTrigger>
            <TabsTrigger value="word">Word Correction</TabsTrigger>
          </TabsList>

          <TabsContent value="sentence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sentence Spell Check
                </CardTitle>
                <CardDescription>Check and correct spelling errors in complete sentences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sample-texts">Sample Texts</Label>
                  <Select onValueChange={handleSampleSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sample text..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPLE_TEXTS.map((sample, index) => (
                        <SelectItem key={index} value={sample.text}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {sample.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">Choose a sample to test the spell checker</p>
                </div>

                <div>
                  <Label htmlFor="sentence-input">Text to Check</Label>
                  <UniversalTextInput
                    value={sentenceText}
                    onChange={setSentenceText}
                    placeholder="Enter Akan text to check for spelling errors..."
                    rows={4}
                    apiBase={SC_API}
                    enableSpellCheck={true}
                    enableKeyboard={true}
                    type="textarea"
                    id="sentence-input"
                    spellcheckModelName={selectedModel}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={checkSentence} disabled={isLoading || !sentenceText.trim()} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Check Spelling
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSentenceForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {sentenceResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Original Text</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm">{sentenceText}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(sentenceText)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Corrected Text (suggested)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm">{getCorrectedText()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(getCorrectedText())}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                (window.location.href = `/tts?text=${encodeURIComponent(getCorrectedText())}`)
                              }
                            >
                              <Volume2 className="h-4 w-4 mr-2" />
                              Synthesize
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {(() => {
                      const corrections = getCorrections()
                      return corrections.length > 0 ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Corrections Suggested</CardTitle>
                            <CardDescription>
                              {corrections.length} suggestion(s) using {selectedModel}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {corrections.map((c, index) => (
                                <Badge key={index} variant="secondary" className="text-sm">
                                  <span className="text-red-600">{c.original}</span>
                                  <span className="mx-1">→</span>
                                  <span className="text-green-600">{c.corrected}</span>
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>No spelling errors found! The text appears to be correct.</AlertDescription>
                        </Alert>
                      )
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="word" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Word Spell Check
                </CardTitle>
                <CardDescription>Check and correct spelling for individual words</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="word-input">Word to Check</Label>
                  <UniversalTextInput
                    value={wordText}
                    onChange={setWordText}
                    placeholder="Enter a single Akan word..."
                    apiBase={SC_API}
                    enableSpellCheck={false}
                    enableKeyboard={true}
                    type="input"
                    id="word-input"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={checkWord} disabled={isLoading || !wordText.trim()} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Check Word
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetWordForm}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {wordResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Original Word</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                            <p className="text-lg font-medium">{wordResult.original}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Best Suggestion</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                            <p className="text-lg font-medium">{wordResult.corrected}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {wordResult.suggestions.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">All Suggestions</CardTitle>
                          <CardDescription>
                            {wordResult.suggestions.length} suggestion(s) from {selectedModel}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {wordResult.suggestions.map((suggestion, index) => (
                              <Badge key={index} variant={index === 0 ? "default" : "secondary"} className="text-sm">
                                {suggestion}
                                {index === 0 && " (Best)"}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          The word appears to be spelled correctly! No suggestions available.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
