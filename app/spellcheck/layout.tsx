import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Spell Check | DCS-HCI NLP",
  description: "Check and correct spelling errors in Akan text before synthesis.",
  alternates: {
    canonical: "/spellcheck",
  },
}

export default function SpellcheckLayout({ children }: { children: React.ReactNode }) {
  return children
}
