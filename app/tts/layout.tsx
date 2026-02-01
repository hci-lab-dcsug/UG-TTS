import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Text-to-Speech | DCS-HCI NLP",
  description: "Convert text to natural-sounding speech with multi-speaker TTS models.",
  alternates: {
    canonical: "/tts",
  },
}

export default function TTSLayout({ children }: { children: React.ReactNode }) {
  return children
}
