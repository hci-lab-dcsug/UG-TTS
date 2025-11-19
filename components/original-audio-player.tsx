"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Volume2, Download, AlertCircle, LinkIcon } from "lucide-react"

type ModelType = "ss" | "ms"

interface OriginalAudioPlayerProps {
  // Back-compat props, but unused for remote static samples:
  apiBase?: string
  modelType?: ModelType

  // Required: one of AN, BT, IM, PT (or numeric 0-3 mapping to AN/BT/IM/PT)
  speaker: string | number
  className?: string
}

const GITHUB_BASE = "https://github.com/fiifinketia/nlp-server/raw/refs/heads/master/samples/ugtts"

function normalizeSpeakerCode(s: string | number): "AN" | "BT" | "IM" | "PT" | null {
  if (typeof s === "number") {
    const map = ["AN", "BT", "IM", "PT"] as const
    return map[s] ?? null
  }
  const up = String(s).toUpperCase().trim()
  const code = up.split("_")[0]
  if (code === "AN" || code === "BT" || code === "IM" || code === "PT") return code
  return null
}

export default function OriginalAudioPlayer({ speaker, className = "" }: OriginalAudioPlayerProps) {
  const [error, setError] = useState<string | null>(null)

  const { fileUrl, filename, code } = useMemo(() => {
    const code = normalizeSpeakerCode(speaker)
    const filename = code ? `${code}_TW.wav` : ""
    const fileUrl = code ? `${GITHUB_BASE}/${filename}` : ""
    return { fileUrl, filename, code }
  }, [speaker])

  const handleAudioError = () => {
    if (!code) {
      setError("Unknown speaker code. Use one of AN, BT, IM, PT (or numeric 0–3 mapped to AN/BT/IM/PT).")
    } else {
      setError(
        `Failed to load original speaker sample from ${fileUrl}. Ensure the file exists and is publicly accessible.`,
      )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Original Speaker Sample
        </CardTitle>
        <CardDescription>
          {code ? `Remote sample for speaker ${code} (${filename})` : "Select a valid speaker to preview"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {fileUrl && (
          <div className="space-y-3">
            <audio key={fileUrl} controls className="w-full" onError={handleAudioError}>
              <source src={fileUrl} type="audio/wav" />
              {"Your browser does not support the audio element."}
            </audio>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Note: The download attribute may be ignored for cross-origin URLs,
                  // but most browsers will still navigate and allow saving.
                  const a = document.createElement("a")
                  a.href = fileUrl
                  a.download = filename
                  a.rel = "noopener noreferrer"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <a href={fileUrl} target="_blank" rel="noreferrer">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Open Source URL
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
