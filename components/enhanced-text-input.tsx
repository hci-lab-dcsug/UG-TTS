"use client"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Keyboard, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import AkanKeyboard from "./akan-keyboard"

const SPELLCHECK_BASE = "https://hcidcsug--ugsc-akan-api.modal.run"

interface SpellCheckResult {
  original: string
  corrected: string
  suggestions: string[]
}

interface EnhancedTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  apiBase?: string
  onSpellCheckResult?: (result: SpellCheckResult | null) => void
  spellcheckModelName?: string
}

export default function EnhancedTextInput({
  value,
  onChange,
  placeholder = "Enter text...",
  rows = 4,
  disabled = false,
  apiBase = SPELLCHECK_BASE,
  onSpellCheckResult,
  spellcheckModelName = "default",
}: EnhancedTextInputProps) {
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isSpellChecking, setIsSpellChecking] = useState(false)
  const [spellCheckResults, setSpellCheckResults] = useState<Record<string, SpellCheckResult>>({})
  const [lastCheckedWord, setLastCheckedWord] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isKeyboardActive, setIsKeyboardActive] = useState(false)

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
        throw new Error("Network error - unable to connect to server.")
      }
      throw err
    }
  }

  // Spell check for a single word using /check + /suggest
  const checkWordSpelling = async (word: string) => {
    if (!word.trim() || word === lastCheckedWord || spellCheckResults[word]) return
    setLastCheckedWord(word)
    setIsSpellChecking(true)
    try {
      const checkRes = await fetchWithErrorHandling(`${apiBase}/check`, {
        method: "POST",
        body: JSON.stringify({ word: word.trim(), model_name: spellcheckModelName }),
      })
      const checkData = await checkRes.json()
      if (checkData?.correct === false) {
        const suggestRes = await fetchWithErrorHandling(`${apiBase}/suggest`, {
          method: "POST",
          body: JSON.stringify({ word: word.trim(), model_name: spellcheckModelName, max_suggestions: 5 }),
        })
        const suggestData = await suggestRes.json()
        const suggestions: string[] = Array.isArray(suggestData?.suggestions) ? suggestData.suggestions : []
        if (suggestions.length > 0) {
          const result: SpellCheckResult = { original: word.trim(), corrected: suggestions[0], suggestions }
          setSpellCheckResults((prev) => ({ ...prev, [word]: result }))
          onSpellCheckResult?.(result)
        }
      } else {
        setSpellCheckResults((prev) => {
          const next = { ...prev }
          delete next[word]
          return next
        })
      }
    } catch (err) {
      console.error("Word spell check failed:", err)
    } finally {
      setIsSpellChecking(false)
    }
  }

  const handleTextChange = (newValue: string) => {
    onChange(newValue)
    if (newValue.length > value.length && newValue.endsWith(" ")) {
      const words = newValue.trim().split(/\s+/)
      const lastWord = words[words.length - 1]
      if (lastWord && lastWord.length > 1) {
        checkWordSpelling(lastWord)
      }
    }
  }

  const handleKeyboardKeyPress = (key: string) => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentValue = value
    setIsKeyboardActive(true)

    if (key === "CLEAR_ALL") {
      onChange("")
      setCursorPosition(0)
      setTimeout(() => {
        textarea.setSelectionRange(0, 0)
        textarea.focus()
        setIsKeyboardActive(false)
      }, 0)
    } else if (key === "BACKSPACE") {
      if (start > 0) {
        const newValue = currentValue.slice(0, start - 1) + currentValue.slice(end)
        onChange(newValue)
        const newCursorPos = start - 1
        setCursorPosition(newCursorPos)
        setTimeout(() => {
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
          setIsKeyboardActive(false)
        }, 0)
      }
    } else {
      const newValue = currentValue.slice(0, start) + key + currentValue.slice(end)
      handleTextChange(newValue)
      const newCursorPos = start + key.length
      setCursorPosition(newCursorPos)
      setTimeout(() => {
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
        setIsKeyboardActive(false)
      }, 0)

      if (key === " ") {
        const words = newValue.slice(0, start).trim().split(/\s+/)
        const lastWord = words[words.length - 1]
        if (lastWord && lastWord.length > 1) {
          checkWordSpelling(lastWord)
        }
      }
    }
  }

  const applySuggestion = (original: string, suggestion: string) => {
    const regex = new RegExp(`\\b${original}\\b`, "gi")
    const newValue = value.replace(regex, suggestion)
    onChange(newValue)
    setSpellCheckResults((prev) => {
      const next = { ...prev }
      delete next[original]
      return next
    })
  }

  const getMisspelledWords = () => {
    const words = value.toLowerCase().split(/\s+/)
    return Object.keys(spellCheckResults).filter(
      (word) => words.includes(word.toLowerCase()) && spellCheckResults[word].suggestions.length > 0,
    )
  }

  const handleCursorChange = () => {
    if (textareaRef.current) {
      const newPosition = textareaRef.current.selectionStart
      setCursorPosition(newPosition)
    }
  }

  const misspelledWords = getMisspelledWords()

  return (
    <div className="space-y-3">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          onFocus={() => setShowKeyboard(false)}
          onSelect={handleCursorChange}
          onKeyUp={handleCursorChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`pr-12 ${isKeyboardActive ? "ring-2 ring-primary ring-inset" : ""}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`absolute right-2 top-2 h-8 w-8 p-0 ${showKeyboard ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "hover:bg-accent"} transition-colors`}
          onClick={() => {
            setShowKeyboard(!showKeyboard)
            textareaRef.current?.focus()
          }}
          disabled={disabled}
        >
          <Keyboard className="h-4 w-4" />
        </Button>

        {isSpellChecking && (
          <div className="absolute right-12 top-2 flex items-center">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {misspelledWords.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-sm font-medium">Spelling suggestions found:</p>
              <div className={`flex flex-wrap gap-2 ${showKeyboard ? "max-w-[300px]" : ""}`}>
                {misspelledWords.map((word) => {
                  const result = spellCheckResults[word]
                  return (
                    <div key={word} className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        {result.original}
                      </Badge>
                      <span className="text-xs text-muted-foreground">→</span>
                      <div className="flex gap-1">
                        {result.suggestions.slice(0, 3).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs bg-transparent"
                            onClick={() => applySuggestion(result.original, suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {value.trim() && misspelledWords.length === 0 && Object.keys(spellCheckResults).length > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">Text appears to be spelled correctly!</AlertDescription>
        </Alert>
      )}

      <AkanKeyboard
        isVisible={showKeyboard}
        onKeyPress={handleKeyboardKeyPress}
        onClose={() => setShowKeyboard(false)}
        currentText={value}
        cursorPosition={cursorPosition}
      />
    </div>
  )
}
