"use client"

import type React from "react"

import { useState, useRef, forwardRef, useImperativeHandle, useCallback, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, X } from "lucide-react"
import AkanKeyboard from "./akan-keyboard"
import { useTheme } from "next-themes"

const DEFAULT_SC_API = "/api/spellcheck"
const DEFAULT_SC_MODEL = "akan-twi"

interface SpellCheckResult {
  original: string
  corrected: string
  suggestions: string[]
}

interface WordPosition {
  start: number
  end: number
  word: string
}

interface SuggestionDropdown {
  word: string
  suggestions: string[]
  position: { x: number; y: number }
  wordPosition: WordPosition
}

interface UniversalTextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  apiBase?: string
  onSpellCheckResult?: (result: SpellCheckResult | null) => void
  type?: "textarea" | "input"
  className?: string
  enableSpellCheck?: boolean
  enableKeyboard?: boolean
  id?: string
  name?: string
  spellcheckModelName?: string
}

export interface UniversalTextInputRef {
  focus: () => void
  blur: () => void
  showKeyboard: () => void
  hideKeyboard: () => void
}

const UniversalTextInput = forwardRef<UniversalTextInputRef, UniversalTextInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "Enter text...",
      rows = 4,
      disabled = false,
      apiBase = DEFAULT_SC_API,
      onSpellCheckResult,
      type = "textarea",
      className = "",
      enableSpellCheck = true,
      enableKeyboard = true,
      id,
      name,
      spellcheckModelName = DEFAULT_SC_MODEL,
    },
    ref,
  ) => {
    const [showKeyboard, setShowKeyboard] = useState(false)
    const [isSpellChecking, setIsSpellChecking] = useState(false)
    const [spellCheckResults, setSpellCheckResults] = useState<Record<string, SpellCheckResult>>({})
    const [checkedWords, setCheckedWords] = useState<Set<string>>(new Set())
    const [misspelledWords, setMisspelledWords] = useState<WordPosition[]>([])
    const [suggestionDropdown, setSuggestionDropdown] = useState<SuggestionDropdown | null>(null)
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [cursorPosition, setCursorPosition] = useState(0)
    const [isKeyboardActive, setIsKeyboardActive] = useState(false)
    const spellCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [inputStyles, setInputStyles] = useState<CSSStyleDeclaration | null>(null)
    const { theme, systemTheme } = useTheme()

    const currentTheme = theme === "system" ? systemTheme : theme
    const isDarkMode = currentTheme === "dark"

    const modelForSpellcheck = spellcheckModelName || DEFAULT_SC_MODEL

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      showKeyboard: () => setShowKeyboard(true),
      hideKeyboard: () => setShowKeyboard(false),
    }))

    const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
      try {
        const isGet = !options.method || options.method.toUpperCase() === "GET"
        const response = await fetch(url, {
          ...options,
          headers: {
            ...(isGet ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {}),
          },
        })
        if (!response.ok) {
          let message = `HTTP ${response.status}: ${response.statusText}`
          try {
            const data = await response.json()
            if (data?.detail) {
              if (Array.isArray(data.detail)) {
                message = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ")
              } else if (typeof data.detail === "string") {
                message = data.detail
              } else {
                message = JSON.stringify(data.detail)
              }
            } else if (data?.message) {
              message = data.message
            }
          } catch {
            // ignore JSON parse errors
          }
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

    const getWordPositions = useCallback((text: string): WordPosition[] => {
      const words: WordPosition[] = []
      const regex = /\b[\w\u00C0-\u017F\u0100-\u024F\u1E00-\u1EFF\u0180-\u024F]+\b/g
      let match
      while ((match = regex.exec(text)) !== null) {
        words.push({ start: match.index, end: match.index + match[0].length, word: match[0] })
      }
      return words
    }, [])

    const updateInputStyles = useCallback(() => {
      if (inputRef.current) {
        const computed = window.getComputedStyle(inputRef.current)
        setInputStyles(computed)
      }
    }, [])

    // Updated: use GET with query params to match upstream expectations
    const checkWordSpelling = useCallback(
      async (word: string) => {
        if (
          !enableSpellCheck ||
          !apiBase ||
          !word.trim() ||
          word.length < 2 ||
          /^\d+$/.test(word) ||
          checkedWords.has(word.toLowerCase())
        ) {
          return
        }

        setCheckedWords((prev) => new Set(prev).add(word.toLowerCase()))
        setIsSpellChecking(true)

        try {
          const checkRes = await fetchWithErrorHandling(`${apiBase}/check`, {
            method: "POST",
            body: JSON.stringify({ word: word.trim(), model_name: modelForSpellcheck }),
          })
          const checkData = await checkRes.json()

          if (checkData?.correct === false) {
            const suggestRes = await fetchWithErrorHandling(`${apiBase}/suggest`, {
              method: "POST",
              body: JSON.stringify({
                word: word.trim(),
                model_name: modelForSpellcheck,
                max_suggestions: 5,
              }),
            })
            const suggestData = await suggestRes.json()
            const suggestions: string[] = Array.isArray(suggestData?.suggestions) ? suggestData.suggestions : []
            if (suggestions.length > 0) {
              const result: SpellCheckResult = {
                original: word.trim(),
                corrected: suggestions[0],
                suggestions,
              }
              setSpellCheckResults((prev) => ({ ...prev, [word.toLowerCase()]: result }))
              onSpellCheckResult?.(result)
            }
          } else {
            setSpellCheckResults((prev) => {
              const next = { ...prev }
              delete next[word.toLowerCase()]
              return next
            })
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err)
          console.error("Word spell check failed:", msg)
        } finally {
          setIsSpellChecking(false)
        }
      },
      [enableSpellCheck, apiBase, checkedWords, onSpellCheckResult, modelForSpellcheck],
    )

    const updateMisspelledWords = useCallback(() => {
      if (!enableSpellCheck || !value) {
        setMisspelledWords([])
        return
      }
      const wordPositions = getWordPositions(value)
      const misspelled = wordPositions.filter((pos) => {
        const result = spellCheckResults[pos.word.toLowerCase()]
        return result && result.suggestions.length > 0
      })
      setMisspelledWords(misspelled)
    }, [enableSpellCheck, value, spellCheckResults, getWordPositions])

    const performSpellCheck = useCallback(() => {
      if (!enableSpellCheck || !apiBase || !value.trim()) return
      if (spellCheckTimeoutRef.current) clearTimeout(spellCheckTimeoutRef.current)
      spellCheckTimeoutRef.current = setTimeout(() => {
        const words = getWordPositions(value)
        words.forEach((wp) => {
          if (wp.word.length > 1 && !checkedWords.has(wp.word.toLowerCase())) {
            checkWordSpelling(wp.word)
          }
        })
      }, 800)
    }, [enableSpellCheck, apiBase, value, getWordPositions, checkedWords, checkWordSpelling])

    const handleTextChange = useCallback(
      (newValue: string) => {
        onChange(newValue)
        setSuggestionDropdown(null)
        performSpellCheck()
      },
      [onChange, performSpellCheck],
    )

    const handleKeyboardKeyPress = useCallback(
      (key: string) => {
        if (!inputRef.current) return
        const input = inputRef.current
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
        const currentValue = value

        setIsKeyboardActive(true)
        setSuggestionDropdown(null)

        if (key === "CLEAR_ALL") {
          onChange("")
          setCheckedWords(new Set())
          setSpellCheckResults({})
          setTimeout(() => {
            input.setSelectionRange(0, 0)
            input.focus()
            setIsKeyboardActive(false)
          }, 0)
        } else if (key === "BACKSPACE") {
          if (start > 0) {
            const newValue = currentValue.slice(0, start - 1) + currentValue.slice(end)
            handleTextChange(newValue)
            const newCursorPos = start - 1
            setTimeout(() => {
              input.setSelectionRange(newCursorPos, newCursorPos)
              input.focus()
              setIsKeyboardActive(false)
            }, 0)
          }
        } else {
          const newValue = currentValue.slice(0, start) + key + currentValue.slice(end)
          handleTextChange(newValue)
          const newCursorPos = start + key.length
          setTimeout(() => {
            input.setSelectionRange(newCursorPos, newCursorPos)
            input.focus()
            setIsKeyboardActive(false)
          }, 0)
        }
      },
      [value, onChange, handleTextChange],
    )

    const handleWordClick = useCallback(
      (event: React.MouseEvent, wordPos: WordPosition) => {
        event.preventDefault()
        event.stopPropagation()
        const result = spellCheckResults[wordPos.word.toLowerCase()]
        if (!result || result.suggestions.length === 0) return

        const containerRect = containerRef.current?.getBoundingClientRect()
        const targetRect = (event.target as HTMLElement).getBoundingClientRect()

        if (containerRect) {
          setSuggestionDropdown({
            word: wordPos.word,
            suggestions: result.suggestions,
            position: {
              x: Math.max(0, targetRect.left - containerRect.left),
              y: targetRect.bottom - containerRect.top + 5,
            },
            wordPosition: wordPos,
          })
        }
      },
      [spellCheckResults],
    )

    const applySuggestion = useCallback(
      (suggestion: string, wordPos: WordPosition) => {
        const newValue = value.slice(0, wordPos.start) + suggestion + value.slice(wordPos.end)
        onChange(newValue)
        setSpellCheckResults((prev) => {
          const next = { ...prev }
          delete next[wordPos.word.toLowerCase()]
          return next
        })
        setSuggestionDropdown(null)
        setTimeout(() => {
          inputRef.current?.focus()
          const newCursorPos = wordPos.start + suggestion.length
          inputRef.current?.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)
      },
      [value, onChange],
    )

    const ignoreWord = useCallback((wordPos: WordPosition) => {
      setSpellCheckResults((prev) => {
        const next = { ...prev }
        delete next[wordPos.word.toLowerCase()]
        return next
      })
      setSuggestionDropdown(null)
    }, [])

    const handleCursorChange = useCallback(() => {
      if (inputRef.current) {
        const newPosition = inputRef.current.selectionStart || 0
        setCursorPosition(newPosition)
      }
    }, [])

    const renderHighlightedText = () => {
      if (!enableSpellCheck || !value || misspelledWords.length === 0) {
        return (
          <div className="whitespace-pre-wrap break-words text-transparent select-none pointer-events-none">
            {value || ""}
          </div>
        )
      }

      const parts: React.ReactNode[] = []
      let lastIndex = 0

      misspelledWords.forEach((wordPos, index) => {
        if (wordPos.start > lastIndex) {
          parts.push(
            <span key={`text-${index}`} className="text-transparent select-none pointer-events-none">
              {value.slice(lastIndex, wordPos.start)}
            </span>,
          )
        }

        parts.push(
          <span
            key={`word-${index}`}
            className="relative cursor-pointer text-transparent underline decoration-red-500 decoration-wavy decoration-2 underline-offset-2 hover:bg-red-50 hover:text-red-500 select-none pointer-events-auto rounded px-0.5"
            onClick={(e) => handleWordClick(e, wordPos)}
            onMouseDown={(e) => e.preventDefault()}
            style={{ textDecorationSkipInk: "none", WebkitTextDecorationSkipInk: "none" }}
            title={`Click to see suggestions for "${wordPos.word}"`}
          >
            {wordPos.word}
          </span>,
        )

        lastIndex = wordPos.end
      })

      if (lastIndex < value.length) {
        parts.push(
          <span key="text-end" className="text-transparent select-none pointer-events-none">
            {value.slice(lastIndex)}
          </span>,
        )
      }

      return <div className="whitespace-pre-wrap break-words">{parts}</div>
    }

    useEffect(() => {
      updateMisspelledWords()
    }, [updateMisspelledWords])

    useEffect(() => {
      updateInputStyles()
      const onResize = () => updateInputStyles()
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }, [updateInputStyles])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setSuggestionDropdown(null)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
      return () => {
        if (spellCheckTimeoutRef.current) clearTimeout(spellCheckTimeoutRef.current)
      }
    }, [])

    useEffect(() => {
      if (value && enableSpellCheck) performSpellCheck()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const inputProps = {
      ref: inputRef as any,
      value,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleTextChange(e.target.value),
      onSelect: handleCursorChange,
      onKeyUp: handleCursorChange,
      onInput: updateInputStyles,
      placeholder,
      disabled,
      className: `${className} ${isKeyboardActive ? "ring-2 ring-primary ring-inset" : ""} ${enableKeyboard ? "pr-12" : ""} ${enableSpellCheck ? "relative z-10" : ""}`,
      id,
      name,
      style: {
        backgroundColor: "transparent",
        color: isDarkMode ? "white" : "black",
        caretColor: isDarkMode ? "white" : "black",
        resize: type === "textarea" ? "vertical" : "none",
      } as React.CSSProperties,
    }

    return (
      <div ref={containerRef} className="space-y-3 relative">
        <div className="relative">
          <div className="relative">
            {type === "textarea" ? <Textarea {...inputProps} rows={rows} /> : <Input {...inputProps} />}
          </div>

          {enableSpellCheck && (
            <div
              ref={overlayRef}
              className="absolute inset-0 z-20 overflow-hidden"
              style={{
                padding: inputStyles
                  ? `${inputStyles.paddingTop} ${inputStyles.paddingRight} ${inputStyles.paddingBottom} ${inputStyles.paddingLeft}`
                  : type === "textarea"
                    ? "12px"
                    : "8px 12px",
                fontSize: inputStyles?.fontSize || "14px",
                lineHeight: inputStyles?.lineHeight || "1.5",
                fontFamily: inputStyles?.fontFamily || "inherit",
                fontWeight: inputStyles?.fontWeight || "inherit",
                letterSpacing: inputStyles?.letterSpacing || "inherit",
                wordSpacing: inputStyles?.wordSpacing || "inherit",
                pointerEvents: "none",
              }}
            >
              {renderHighlightedText()}
            </div>
          )}

          {isSpellChecking && (
            <div className={`absolute ${enableKeyboard ? "right-12" : "right-2"} top-2 flex items-center z-30`}>
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {suggestionDropdown && (
            <div
              className="absolute z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-48 max-w-64"
              style={{
                left: Math.min(suggestionDropdown.position.x, (containerRef.current?.clientWidth || 300) - 200),
                top: suggestionDropdown.position.y,
              }}
            >
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span>Suggestions for "{suggestionDropdown.word}"</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSuggestionDropdown(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              {suggestionDropdown.suggestions.slice(0, 5).map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900 focus:bg-blue-50 dark:focus:bg-blue-900 focus:outline-none transition-colors flex items-center justify-between text-gray-900 dark:text-gray-100"
                  onClick={() => applySuggestion(suggestion, suggestionDropdown.wordPosition)}
                >
                  <span>{suggestion}</span>
                  {index === 0 && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      Best
                    </Badge>
                  )}
                </button>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-700">
                <button
                  className="w-full text-left px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => ignoreWord(suggestionDropdown.wordPosition)}
                >
                  Ignore word
                </button>
              </div>
            </div>
          )}
        </div>

        {enableSpellCheck && process.env.NODE_ENV === "development" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="text-xs space-y-1">
                <div>
                  <strong>Debug Info:</strong>
                </div>
                <div>Spellcheck API Base: {apiBase || "Not set"}</div>
                <div>Checked Words: {Array.from(checkedWords).join(", ") || "None"}</div>
                <div>Misspelled Words: {misspelledWords.map((w) => w.word).join(", ") || "None"}</div>
                <div>Spell Check Results: {Object.keys(spellCheckResults).join(", ") || "None"}</div>
                <div>Is Spell Checking: {isSpellChecking ? "Yes" : "No"}</div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {enableSpellCheck && misspelledWords.length > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {misspelledWords.length} spelling issue{misspelledWords.length !== 1 ? "s" : ""} found. Click on
                  underlined words to see suggestions.
                </p>
                <div className={`flex flex-wrap gap-2 ${showKeyboard ? "max-w-[300px]" : ""}`}>
                  {misspelledWords
                    .slice(0, 3)
                    .map((wordPos, index) => {
                      const result = spellCheckResults[wordPos.word.toLowerCase()]
                      if (!result) return null
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {result.original}
                          </Badge>
                          <span className="text-xs text-muted-foreground">→</span>
                          <div className="flex gap-1">
                            {result.suggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                              <Button
                                key={suggestionIndex}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs bg-transparent hover:bg-blue-50"
                                onClick={() => applySuggestion(suggestion, wordPos)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )
                    })
                    .filter(Boolean)}
                  {misspelledWords.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{misspelledWords.length - 3} more...</span>
                  )}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {enableSpellCheck &&
          value.trim() &&
          misspelledWords.length === 0 &&
          checkedWords.size > 0 &&
          !isSpellChecking && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">Great! No spelling issues found in your text.</AlertDescription>
            </Alert>
          )}

        {enableKeyboard && (
          <AkanKeyboard
            isVisible={showKeyboard}
            onKeyPress={handleKeyboardKeyPress}
            onClose={() => setShowKeyboard(false)}
            currentText={value}
            cursorPosition={cursorPosition}
          />
        )}
      </div>
    )
  },
)

UniversalTextInput.displayName = "UniversalTextInput"
export default UniversalTextInput
