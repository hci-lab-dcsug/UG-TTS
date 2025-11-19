"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, SkipBackIcon as Backspace, Space, CornerDownLeft } from "lucide-react"
import React from "react"

interface AkanKeyboardProps {
  onKeyPress: (key: string) => void
  onClose: () => void
  isVisible: boolean
  currentText: string
  cursorPosition: number
}

const AKAN_KEYBOARD_LAYOUT = [
  // Row 1 - Numbers and special characters
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],

  // Row 2 - First letter row with Akan-specific characters
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "ɛ", "ɔ"],

  // Row 3 - Second letter row
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ɛ̃", "ɔ̃"],

  // Row 4 - Third letter row with more Akan characters
  ["z", "x", "c", "v", "b", "n", "m", "ã", "ẽ", "ĩ", "õ", "ũ"],

  // Row 5 - Special Akan characters
  ["ɑ", "ɑ̃", "ɪ", "ɪ̃", "ʊ", "ʊ̃", "ɛ̃", "ɔ̃", "ã", "ẽ", "ĩ", "õ", "ũ"],
]

const SPECIAL_KEYS = [
  { key: "space", label: "Space", icon: Space, width: "flex-[3]" },
  { key: "backspace", label: "Backspace", icon: Backspace, width: "flex-[2]" },
  { key: "enter", label: "Enter", icon: CornerDownLeft, width: "flex-[2]" },
]

export default function AkanKeyboard({
  onKeyPress,
  onClose,
  isVisible,
  currentText,
  cursorPosition,
}: AkanKeyboardProps) {
  const [isShiftPressed, setIsShiftPressed] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
      // Adjust keyboard height for mobile
      if (window.innerWidth < 768) {
        setKeyboardHeight(Math.min(280, window.innerHeight * 0.5))
      } else {
        setKeyboardHeight(320)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Add resize handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return // Disable resize on mobile
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || isMobile) return

    const newHeight = window.innerHeight - e.clientY - 20
    setKeyboardHeight(Math.max(250, Math.min(600, newHeight)))
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  // Add event listeners
  React.useEffect(() => {
    if (isResizing && !isMobile) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, isMobile])

  if (!isVisible) return null

  const handleKeyPress = (key: string) => {
    if (key === "space") {
      onKeyPress(" ")
    } else if (key === "backspace") {
      onKeyPress("BACKSPACE")
    } else if (key === "enter") {
      onKeyPress("\n")
    } else if (key === "shift") {
      setIsShiftPressed(!isShiftPressed)
    } else if (key === "CLEAR_ALL") {
      onKeyPress("CLEAR_ALL")
    } else {
      onKeyPress(isShiftPressed ? key.toUpperCase() : key)
      if (isShiftPressed) {
        setIsShiftPressed(false)
      }
    }
  }

  const getCurrentWord = () => {
    if (!currentText || cursorPosition === 0) return ""

    const textBeforeCursor = currentText.slice(0, cursorPosition)
    const words = textBeforeCursor.split(/\s+/)
    return words[words.length - 1] || ""
  }

  const currentWord = getCurrentWord()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-2 sm:p-4">
      <Card
        className="w-full max-w-5xl animate-in slide-in-from-bottom duration-300"
        style={{ height: Math.min(keyboardHeight, window.innerHeight * 0.6) }}
      >
        {/* Resize Handle - Hidden on mobile */}
        {!isMobile && (
          <div
            className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize bg-muted/50 hover:bg-muted flex items-center justify-center group"
            onMouseDown={handleMouseDown}
          >
            <div className="w-8 h-0.5 bg-muted-foreground/30 rounded-full group-hover:bg-muted-foreground/50 transition-colors" />
          </div>
        )}

        <CardContent className="p-2 sm:p-3 pt-4 sm:pt-6 h-full overflow-y-auto">
          {/* Header with Text Preview and Close Button */}
          <div className="mb-2 sm:mb-3 flex gap-2">
            <div className="flex-[10]">
              <div className="min-h-[32px] sm:min-h-[40px] max-h-16 sm:max-h-24 overflow-y-auto bg-background rounded border text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words">
                {currentText.length > 0 ? (
                  <>
                    {currentText.slice(0, cursorPosition)}
                    <span className="bg-primary text-primary-foreground px-0.5 animate-pulse rounded-sm">|</span>
                    {currentText.slice(cursorPosition)}
                  </>
                ) : (
                  <span className="text-muted-foreground italic">Start typing to see preview...</span>
                )}
              </div>
            </div>
            <div className="flex-[2] flex justify-end">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Word Suggestions */}
          {currentWord.length > 0 && (
            <div className="mb-2 pt-1 border-t">
              <Label className="text-[0.6rem] sm:text-[0.7rem] text-muted-foreground mb-1 block">
                Current: "{currentWord}"
              </Label>
              <div className="flex flex-wrap gap-1">
                {currentWord.toLowerCase().startsWith("a") && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 sm:h-6 px-1 sm:px-2 text-[0.6rem] sm:text-xs"
                      onClick={() => {
                        const completion = "akan"
                        const completionPart = completion.slice(currentWord.length)
                        if (completionPart) onKeyPress(completionPart)
                      }}
                    >
                      akan
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 sm:h-6 px-1 sm:px-2 text-[0.6rem] sm:text-xs"
                      onClick={() => {
                        const completion = "ama"
                        const completionPart = completion.slice(currentWord.length)
                        if (completionPart) onKeyPress(completionPart)
                      }}
                    >
                      ama
                    </Button>
                  </>
                )}
                {currentWord.toLowerCase().startsWith("n") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 sm:h-6 px-1 sm:px-2 text-[0.6rem] sm:text-xs"
                    onClick={() => {
                      const completion = "nantwinini"
                      const completionPart = completion.slice(currentWord.length)
                      if (completionPart) onKeyPress(completionPart)
                    }}
                  >
                    nantwinini
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Keyboard Layout */}
          <div className="space-y-1">
            {AKAN_KEYBOARD_LAYOUT.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-0.5 justify-center flex-wrap sm:flex-nowrap">
                {row.map((key, keyIndex) => (
                  <Button
                    key={keyIndex}
                    variant="outline"
                    size="sm"
                    className="min-w-[24px] sm:min-w-[28px] md:min-w-[32px] h-6 sm:h-7 md:h-8 text-[0.6rem] sm:text-xs md:text-sm font-medium hover:bg-primary hover:text-primary-foreground bg-transparent flex-shrink-0"
                    onClick={() => handleKeyPress(key)}
                  >
                    {isShiftPressed ? key.toUpperCase() : key}
                  </Button>
                ))}
              </div>
            ))}

            {/* Special Keys Row */}
            <div className="flex gap-1 justify-center mt-2 flex-wrap sm:flex-nowrap">
              <Button
                variant={isShiftPressed ? "default" : "outline"}
                size="sm"
                className="flex-1 min-w-[50px] sm:min-w-[60px] h-6 sm:h-7 md:h-8 text-[0.6rem] sm:text-xs md:text-sm"
                onClick={() => handleKeyPress("shift")}
              >
                Shift
              </Button>

              {SPECIAL_KEYS.map((specialKey) => (
                <Button
                  key={specialKey.key}
                  variant="outline"
                  size="sm"
                  className={`h-6 sm:h-7 md:h-8 ${specialKey.width} flex items-center justify-center gap-1 text-[0.6rem] sm:text-xs md:text-sm min-w-[50px] sm:min-w-[60px]`}
                  onClick={() => handleKeyPress(specialKey.key)}
                >
                  {specialKey.icon && <specialKey.icon className="h-3 w-3 sm:h-4 sm:w-4" />}
                  <span className="hidden xs:inline">{specialKey.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
