import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TTS Evaluation | DCS-HCI NLP",
  description: "Participate in TTS quality evaluation studies and provide feedback.",
  alternates: {
    canonical: "/tts/evaluation",
  },
}

export default function TTSEvaluationLayout({ children }: { children: React.ReactNode }) {
  return children
}
