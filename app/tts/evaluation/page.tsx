// "use client"

// import { useEffect, useState, Suspense } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Separator } from "@/components/ui/separator"
// import { Progress } from "@/components/ui/progress"
// import { Loader2, AlertCircle, CheckCircle, Volume2, ArrowLeft, ArrowRight, Wand2, Save } from "lucide-react"
// import UniversalTextInput from "@/components/universal-text-input"

// const TTS_MODELS_API = "/api/tts/models"
// const TTS_SYNTH_API = "/api/tts/synthesize"
// const SC_API = "/api/spellcheck"

// // Evaluation API endpoints
// const EVAL_START_SESSION_API = "/api/evaluation/start-session"
// const EVAL_SUBMIT_AUDIO_API = "/api/evaluation/submit-audio"
// const EVAL_SUBMIT_DEMOGRAPHICS_API = "/api/evaluation/submit-demographics"
// const EVAL_SUBMIT_SURVEY_API = "/api/evaluation/submit-survey"
// // const EVAL_GET_SESSION_API = "/api/evaluation/get-session"

// type ModelType = "ss" | "ms"

// interface TTSModelInfo {
//   model_id: string
//   model_type: ModelType
//   description: string
//   available_speakers: (string | number)[]
// }

// const EVALUATION_PROMPTS = [
//   { id: 1, text: "Awia apue wɔ wiem ama wiem ahyerɛn pa ara. Ewiem da hɔ fann. Ewiem ahosuo yɛ bibire, ɛnna mununkum mfitaa mfitaa deda mu." },
//   { id: 2, text: "Nneɛma binom tete sɛ obi bɔbeasu, ne bɔbea, n’ahosuo, ne honam ani, sɛ ɔyɛ ɔbaa anaa ɔbarima, n’adwenkyerɛ wɔ amanyɔsɛm ho, n’awoɔ mu nsɛm, ne tebea, ne som ne gyinabea ne deɛ ɛkeka ho no nsi nneɛma a ɔwɔ ho kwan sɛ ne nsa ka no ho kwan." },
//   { id: 3, text: "Aane. Ɛho hia pa ara sɛ womma nna a wɔahyɛ sɛ bɛhunu dɔkota no mu biara mpa ho, ɛsiane sɛ nhwehwɛmu ahodoɔ no nsunsuansoɔ no bɛtumi anya nsunsuansoɔ wɔ wo nyinsɛn hwɛ so." },
// ]

// const SPEAKERS = ["PT", "AN", "IM"]

// interface AudioSample {
//   id: string
//   url: string
//   isLoading: boolean
//   error: string | null
// }

// interface AudioEvaluation {
//   quality: string
//   pleasantness: string
//   naturalness: string
//   continuity: string
//   longListening: string
//   effort: string
//   pronunciation: string
//   speed: string
//   naturalness2: string
//   understanding: string
//   distinguishable: string
//   telephoneUse: string
// }

// interface EvaluationData {
//   gender: string
//   ageRange: string
//   educationLevel: string
//   akanSpeaking: string
//   akanReading: string
//   akanWriting: string
//   akanListening: string
//   akanType: string
//   akanTypeOther: string

//   originalAudioRatings: Record<string, AudioEvaluation>
//   synthesizedAudioRatings: Record<string, AudioEvaluation>

//   userText: string
//   userTextRating: AudioEvaluation

//   appEvaluation: {
//     IN2: string
//     IN3: string
//     IN4: string
//     EF1: string
//     EF2: string
//     EF3: string
//     CR1: string
//     CR2: string
//     CR3: string
//     SA1: string
//     SA2: string
//     SA3: string
//     PU1: string
//     PU2: string
//     PU3: string
//     PE1: string
//     PE2: string
//     PE3: string
//     AT1: string
//     AT2: string
//     AT3: string
//     AT4: string
//     BI1: string
//     BI2: string
//     BI3: string
//     AU1: string
//     AU2: string
//   }
// }

// function TTSEvaluationPageContent() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
  
//   const [sessionId, setSessionId] = useState<string | null>(null)
//   const [currentSection, setCurrentSection] = useState(1)
//   const [currentItemIndex, setCurrentItemIndex] = useState(0)
//   const [models, setModels] = useState<TTSModelInfo[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)
//   const [isRestoring, setIsRestoring] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [saveStatus, setSaveStatus] = useState<string | null>(null)

//   const [synthesizedSamples, setSynthesizedSamples] = useState<Record<string, AudioSample>>({})
//   const [userTextAudio, setUserTextAudio] = useState<AudioSample | null>(null)

//   const [evaluationData, setEvaluationData] = useState<EvaluationData>({
//     gender: "",
//     ageRange: "",
//     educationLevel: "",
//     akanSpeaking: "",
//     akanReading: "",
//     akanWriting: "",
//     akanListening: "",
//     akanType: "",
//     akanTypeOther: "",
//     originalAudioRatings: {},
//     synthesizedAudioRatings: {},
//     userText: "",
//     userTextRating: {
//       quality: "",
//       pleasantness: "",
//       naturalness: "",
//       continuity: "",
//       longListening: "",
//       effort: "",
//       pronunciation: "",
//       speed: "",
//       naturalness2: "",
//       understanding: "",
//       distinguishable: "",
//       telephoneUse: "",
//     },
//     appEvaluation: {
//       IN2: "",
//       IN3: "",
//       IN4: "",
//       EF1: "",
//       EF2: "",
//       EF3: "",
//       CR1: "",
//       CR2: "",
//       CR3: "",
//       SA1: "",
//       SA2: "",
//       SA3: "",
//       PU1: "",
//       PU2: "",
//       PU3: "",
//       PE1: "",
//       PE2: "",
//       PE3: "",
//       AT1: "",
//       AT2: "",
//       AT3: "",
//       AT4: "",
//       BI1: "",
//       BI2: "",
//       BI3: "",
//       AU1: "",
//       AU2: "",
//     },
//   })

//   // Function to update URL with session ID
//   const updateUrlWithSession = (sessionId: string) => {
//     const url = new URL(window.location.href)
//     url.searchParams.set('session', sessionId)
//     router.replace(url.pathname + url.search, { scroll: false })
//   }

//   // Function to restore session data
//   const restoreSessionData = async (sessionId: string) => {
//     setIsRestoring(true)
//     try {
//       const response = await fetch(`${EVAL_GET_SESSION_API}?sessionId=${sessionId}`)
//       const data = await response.json()
      
//       if (data.success && data.sessionData) {
//         const { progress, demographics, survey, audioEvaluations } = data.sessionData
        
//         // Restore progress
//         if (progress) {
//           setCurrentSection(progress.currentSection || 1)
//           setCurrentItemIndex(progress.currentItemIndex || 0)
//         }
        
//         // Restore demographics if available
//         if (demographics) {
//           setEvaluationData(prev => ({
//             ...prev,
//             gender: demographics.gender || "",
//             ageRange: demographics.ageRange || "",
//             educationLevel: demographics.education || "",
//             akanSpeaking: demographics.akan_proficiency?.speaking || "",
//             akanReading: demographics.akan_proficiency?.reading || "",
//             akanWriting: demographics.akan_proficiency?.writing || "",
//             akanListening: demographics.akan_proficiency?.listening || "",
//             akanType: demographics.akan_dialect || "",
//             akanTypeOther: demographics.other_dialect || "",
//           }))
//         }
        
//         // Restore survey responses if available
//         if (survey) {
//           setEvaluationData(prev => ({
//             ...prev,
//             appEvaluation: {
//               IN2: survey.IN2?.toString() || "",
//               IN3: survey.IN3?.toString() || "",
//               IN4: survey.IN4?.toString() || "",
//               EF1: survey.EF1?.toString() || "",
//               EF2: survey.EF2?.toString() || "",
//               EF3: survey.EF3?.toString() || "",
//               CR1: survey.CR1?.toString() || "",
//               CR2: survey.CR2?.toString() || "",
//               CR3: survey.CR3?.toString() || "",
//               SA1: survey.SA1?.toString() || "",
//               SA2: survey.SA2?.toString() || "",
//               SA3: survey.SA3?.toString() || "",
//               PU1: survey.PU1?.toString() || "",
//               PU2: survey.PU2?.toString() || "",
//               PU3: survey.PU3?.toString() || "",
//               PE1: survey.PE1?.toString() || "",
//               PE2: survey.PE2?.toString() || "",
//               PE3: survey.PE3?.toString() || "",
//               AT1: survey.AT1?.toString() || "",
//               AT2: survey.AT2?.toString() || "",
//               AT3: survey.AT3?.toString() || "",
//               AT4: survey.AT4?.toString() || "",
//               BI1: survey.BI1?.toString() || "",
//               BI2: survey.BI2?.toString() || "",
//               BI3: survey.BI3?.toString() || "",
//               AU1: survey.AU1?.toString() || "",
//               AU2: survey.AU2?.toString() || "",
//             }
//           }))
//         }
        
//         // Restore audio evaluations
//         if (audioEvaluations && audioEvaluations.length > 0) {
//           const originalRatings: Record<string, AudioEvaluation> = {}
//           const synthesizedRatings: Record<string, AudioEvaluation> = {}
//           let userTextData = { userText: "", userTextRating: evaluationData.userTextRating }
          
//           audioEvaluations.forEach((evaluation: any) => {
//             if (evaluation.section === "Section 1" && evaluation.speaker) {
//               originalRatings[evaluation.speaker] = {
//                 quality: evaluation.naturalness?.quality || "",
//                 pleasantness: evaluation.naturalness?.pleasantness || "",
//                 naturalness: evaluation.naturalness?.naturalness || "",
//                 continuity: evaluation.naturalness?.continuity || "",
//                 longListening: evaluation.naturalness?.longListening || "",
//                 effort: evaluation.intelligibility?.effort || "",
//                 pronunciation: evaluation.intelligibility?.pronunciation || "",
//                 speed: evaluation.intelligibility?.speed || "",
//                 naturalness2: evaluation.intelligibility?.naturalness2 || "",
//                 understanding: evaluation.intelligibility?.understanding || "",
//                 distinguishable: evaluation.intelligibility?.distinguishable || "",
//                 telephoneUse: evaluation.intelligibility?.telephoneUse || "",
//               }
//             } else if (evaluation.section === "Section 2" && evaluation.speaker && evaluation.prompt_number && evaluation.model_type) {
//               const promptText = EVALUATION_PROMPTS[evaluation.prompt_number - 1]?.text || ""
//               const key = `${promptText.slice(0, 20)}-${evaluation.model_type}-${evaluation.speaker}`
//               synthesizedRatings[key] = {
//                 quality: evaluation.naturalness?.quality || "",
//                 pleasantness: evaluation.naturalness?.pleasantness || "",
//                 naturalness: evaluation.naturalness?.naturalness || "",
//                 continuity: evaluation.naturalness?.continuity || "",
//                 longListening: evaluation.naturalness?.longListening || "",
//                 effort: evaluation.intelligibility?.effort || "",
//                 pronunciation: evaluation.intelligibility?.pronunciation || "",
//                 speed: evaluation.intelligibility?.speed || "",
//                 naturalness2: evaluation.intelligibility?.naturalness2 || "",
//                 understanding: evaluation.intelligibility?.understanding || "",
//                 distinguishable: evaluation.intelligibility?.distinguishable || "",
//                 telephoneUse: evaluation.intelligibility?.telephoneUse || "",
//               }
//             } else if (evaluation.section === "Section 3" && evaluation.user_text) {
//               userTextData = {
//                 userText: evaluation.user_text || "",
//                 userTextRating: {
//                   quality: evaluation.naturalness?.quality || "",
//                   pleasantness: evaluation.naturalness?.pleasantness || "",
//                   naturalness: evaluation.naturalness?.naturalness || "",
//                   continuity: evaluation.naturalness?.continuity || "",
//                   longListening: evaluation.naturalness?.longListening || "",
//                   effort: evaluation.intelligibility?.effort || "",
//                   pronunciation: evaluation.intelligibility?.pronunciation || "",
//                   speed: evaluation.intelligibility?.speed || "",
//                   naturalness2: evaluation.intelligibility?.naturalness2 || "",
//                   understanding: evaluation.intelligibility?.understanding || "",
//                   distinguishable: evaluation.intelligibility?.distinguishable || "",
//                   telephoneUse: evaluation.intelligibility?.telephoneUse || "",
//                 }
//               }
//             }
//           })
          
//           setEvaluationData(prev => ({
//             ...prev,
//             originalAudioRatings: originalRatings,
//             synthesizedAudioRatings: synthesizedRatings,
//             userText: userTextData.userText,
//             userTextRating: userTextData.userTextRating,
//           }))
//         }
        
//         setSaveStatus("Session restored successfully!")
//         setTimeout(() => setSaveStatus(null), 3000)
//       }
//     } catch (err) {
//       console.error("Failed to restore session:", err)
//       setError("Failed to restore session data")
//     } finally {
//       setIsRestoring(false)
//     }
//   }

//   // Initialize session on component mount
//   useEffect(() => {
//     const initializeSession = async () => {
//       const urlSessionId = searchParams.get('session')
      
//       if (urlSessionId) {
//         // Restore existing session
//         setSessionId(urlSessionId)
//         await restoreSessionData(urlSessionId)
//       } else {
//         // Create new session
//       try {
//         const deviceInfo = {
//           userAgent: navigator.userAgent,
//           language: navigator.language,
//           platform: navigator.platform,
//           timestamp: new Date().toISOString(),
//         }

//         const response = await fetch(EVAL_START_SESSION_API, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ deviceInfo }),
//         })

//         const data = await response.json()
//         if (data.success) {
//           setSessionId(data.sessionId)
//             updateUrlWithSession(data.sessionId)
//             console.log("New session started:", data.sessionId)
//         } else {
//           setError("Failed to start evaluation session")
//         }
//       } catch (err) {
//         console.error("Failed to initialize session:", err)
//         setError("Failed to initialize evaluation session")
//         }
//       }
//     }

//     initializeSession()
//   }, [searchParams])

//   const fetchModels = async () => {
//     try {
//       const res = await fetch(TTS_MODELS_API, { method: "GET" })
//       if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
//       const data = await res.json()
//       if (Array.isArray(data?.models)) {
//         setModels(data.models)
//       } else {
//         setError("No models available")
//       }
//     } catch (err) {
//       console.error("Failed to fetch TTS models:", err)
//       setError(err instanceof Error ? err.message : "Failed to fetch models")
//     }
//   }

//   useEffect(() => {
//     fetchModels()
//   }, [])

//   // Submit individual audio evaluation
//   const submitAudioEvaluation = async (
//     section: string,
//     speaker?: string,
//     promptNumber?: number,
//     modelType?: string,
//     audioFileUrl?: string,
//     naturalness?: Partial<AudioEvaluation>,
//     intelligibility?: Partial<AudioEvaluation>,
//     likertResponses?: Record<string, string>,
//     userText?: string,
//   ) => {
//     if (!sessionId) {
//       setError("No session ID available")
//       return false
//     }

//     setIsSaving(true)
//     setSaveStatus("Saving evaluation...")

//     try {
//       const response = await fetch(EVAL_SUBMIT_AUDIO_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sessionId,
//           section,
//           speaker,
//           promptNumber,
//           modelType,
//           audioFileUrl,
//           naturalness,
//           intelligibility,
//           likertResponses,
//           userText,
//         }),
//       })

//       const data = await response.json()
//       if (data.success) {
//         setSaveStatus("Evaluation saved successfully!")
//         setTimeout(() => setSaveStatus(null), 3000)
//         return true
//       } else {
//         setError(`Failed to save evaluation: ${data.error}`)
//         return false
//       }
//     } catch (err) {
//       console.error("Failed to submit audio evaluation:", err)
//       setError("Failed to save evaluation")
//       return false
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   // Submit demographics
//   const submitDemographics = async () => {
//     if (!sessionId) {
//       setError("No session ID available")
//       return false
//     }

//     setIsSaving(true)
//     setSaveStatus("Saving demographics...")

//     try {
//       const akanProficiency = {
//         speaking: evaluationData.akanSpeaking,
//         reading: evaluationData.akanReading,
//         writing: evaluationData.akanWriting,
//         listening: evaluationData.akanListening,
//       }

//       const response = await fetch(EVAL_SUBMIT_DEMOGRAPHICS_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sessionId,
//           gender: evaluationData.gender,
//           ageRange: evaluationData.ageRange,
//           education: evaluationData.educationLevel,
//           akanProficiency,
//           akanDialect: evaluationData.akanType,
//           otherDialect: evaluationData.akanTypeOther,
//         }),
//       })

//       const data = await response.json()
//       if (data.success) {
//         setSaveStatus("Demographics saved successfully!")
//         setTimeout(() => setSaveStatus(null), 3000)
//         return true
//       } else {
//         setError(`Failed to save demographics: ${data.error}`)
//         return false
//       }
//     } catch (err) {
//       console.error("Failed to submit demographics:", err)
//       setError("Failed to save demographics")
//       return false
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   // Submit survey responses
//   const submitSurveyResponses = async () => {
//     if (!sessionId) {
//       setError("No session ID available")
//       return false
//     }

//     setIsSaving(true)
//     setSaveStatus("Saving survey responses...")

//     try {
//       const response = await fetch(EVAL_SUBMIT_SURVEY_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sessionId,
//           ...evaluationData.appEvaluation,
//         }),
//       })

//       const data = await response.json()
//       if (data.success) {
//         setSaveStatus("Survey responses saved successfully!")
//         setTimeout(() => setSaveStatus(null), 3000)
//         return true
//       } else {
//         setError(`Failed to save survey responses: ${data.error}`)
//         return false
//       }
//     } catch (err) {
//       console.error("Failed to submit survey responses:", err)
//       setError("Failed to save survey responses")
//       return false
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   // Generate all possible evaluation items for section 2
//   const generateSection2Items = () => {
//     const items: Array<{
//       speaker: string
//       promptId: number
//       promptText: string
//       modelType: ModelType
//       modelLabel: string
//     }> = []

//     SPEAKERS.forEach((speaker) => {
//       EVALUATION_PROMPTS.forEach((prompt) => {
//         items.push({
//           speaker,
//           promptId: prompt.id,
//           promptText: prompt.text,
//           modelType: "ss",
//           modelLabel: "Single-speaker",
//         })
//         items.push({
//           speaker,
//           promptId: prompt.id,
//           promptText: prompt.text,
//           modelType: "ms",
//           modelLabel: "Multi-speaker",
//         })
//       })
//     })

//     return items
//   }

//   const section2Items = generateSection2Items()

//   const synthesizeAudio = async (text: string, modelType: ModelType, speaker?: string) => {
//     const key = `${text.slice(0, 20)}-${modelType}-${speaker || "default"}`
//     if (synthesizedSamples[key]?.url) return synthesizedSamples[key]

//     setSynthesizedSamples((prev) => ({
//       ...prev,
//       [key]: { id: key, url: "", isLoading: true, error: null },
//     }))

//     try {
//       const res = await fetch(TTS_SYNTH_API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text,
//           model_type: modelType,
//           speaker: modelType === "ss" ? speaker : speaker,
//         }),
//       })

//       const contentType = res.headers.get("content-type") || ""
//       if (!res.ok || !contentType.includes("audio")) {
//         const data = await res.text()
//         throw new Error(data || "Failed to synthesize")
//       }

//       const blob = await res.blob()
//       const url = URL.createObjectURL(blob)

//       const sample = { id: key, url, isLoading: false, error: null }
//       setSynthesizedSamples((prev) => ({ ...prev, [key]: sample }))
//       return sample
//     } catch (err) {
//       const sample = {
//         id: key,
//         url: "",
//         isLoading: false,
//         error: err instanceof Error ? err.message : "Failed to synthesize",
//       }
//       setSynthesizedSamples((prev) => ({ ...prev, [key]: sample }))
//       return sample
//     }
//   }

//   const renderAudioPlayer = (audioUrl: string, label: string) => {
//     return (
//       <div className="space-y-2">
//         <Label className="text-sm font-medium">{label}</Label>
//         <div className="border rounded-lg p-4 bg-muted/30">
//           <audio key={audioUrl} controls className="w-full" src={audioUrl}>
//             Your browser does not support the audio element.
//           </audio>
//         </div>
//       </div>
//     )
//   }

//   const renderEvaluationQuestions = (
//     ratingKey: string,
//     ratings: Partial<AudioEvaluation>,
//     onUpdate: (field: keyof AudioEvaluation, value: string) => void,
//   ) => {
//     return (
//       <div className="space-y-6">
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Naturalness</h3>
//           <div className="space-y-4">
//             <div>
//               <Label className="text-sm font-medium">How do you rate the quality of the audio you just heard?</Label>
//               <RadioGroup
//                 value={ratings.quality || ""}
//                 onValueChange={(v) => onUpdate("quality", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Excellent", "Good", "Fair", "Poor", "Very Poor"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-quality-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-quality-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">How would you describe the pleasantness of the voice?</Label>
//               <RadioGroup
//                 value={ratings.pleasantness || ""}
//                 onValueChange={(v) => onUpdate("pleasantness", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Very Pleasant", "Pleasant", "Neutral", "Unpleasant", "Very Unpleasant"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-pleasantness-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-pleasantness-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">How would you rate the naturalness of the audio?</Label>
//               <RadioGroup
//                 value={ratings.naturalness || ""}
//                 onValueChange={(v) => onUpdate("naturalness", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Very Natural", "Natural", "Neutral", "Unnatural", "Very Unnatural"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-naturalness-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-naturalness-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">How would you describe the continuity or flow of the audio?</Label>
//               <RadioGroup
//                 value={ratings.continuity || ""}
//                 onValueChange={(v) => onUpdate("continuity", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Very Smooth", "Smooth", "Neutral", "Discontinuous", "Very Discontinuous"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-continuity-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-continuity-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">
//                 Would it be easy or difficult to listen to this voice for long periods of time?
//               </Label>
//               <RadioGroup
//                 value={ratings.longListening || ""}
//                 onValueChange={(v) => onUpdate("longListening", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Very Easy", "Easy", "Neutral", "Difficult", "Very Difficult"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-longListening-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-longListening-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         <div>
//           <h3 className="text-lg font-semibold mb-4">Intelligibility</h3>
//           <div className="space-y-4">
//             <div>
//               <Label className="text-sm font-medium">
//                 How would you describe the effort you were required to make in order to understand the message?
//               </Label>
//               <RadioGroup
//                 value={ratings.effort || ""}
//                 onValueChange={(v) => onUpdate("effort", v)}
//                 className="mt-2 space-y-2"
//               >
//                 {[
//                   "Complete relaxation possible; no effort required",
//                   "Attention necessary; no appreciable effort required",
//                   "Appreciable effort required",
//                   "Moderate effort required",
//                   "Considerable effort required",
//                   "No meaning understood with any feasible effort",
//                 ].map((o) => (
//                   <div key={o} className="flex items-start gap-2">
//                     <RadioGroupItem id={`${ratingKey}-effort-${o}`} value={o} className="mt-1" />
//                     <Label htmlFor={`${ratingKey}-effort-${o}`} className="text-sm leading-relaxed">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">Did you notice anomalies in pronunciation?</Label>
//               <RadioGroup
//                 value={ratings.pronunciation || ""}
//                 onValueChange={(v) => onUpdate("pronunciation", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["No", "Yes, but not annoying", "Yes, slightly annoying", "Yes, annoying", "Yes, very annoying"].map(
//                   (o) => (
//                     <div key={o} className="flex items-center gap-2">
//                       <RadioGroupItem id={`${ratingKey}-pronunciation-${o}`} value={o} />
//                       <Label htmlFor={`${ratingKey}-pronunciation-${o}`} className="text-sm">
//                         {o}
//                       </Label>
//                     </div>
//                   ),
//                 )}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">The average speed of delivery was:</Label>
//               <RadioGroup
//                 value={ratings.speed || ""}
//                 onValueChange={(v) => onUpdate("speed", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {[
//                   "Just Right",
//                   "Slightly Fast or Slightly Slow",
//                   "Fairly Fast or Fairly Slow",
//                   "Very Fast or Very Slow",
//                   "Extremely Fast or Extremely Slow",
//                 ].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-speed-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-speed-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">How would you rate the naturalness of the audio?</Label>
//               <RadioGroup
//                 value={ratings.naturalness2 || ""}
//                 onValueChange={(v) => onUpdate("naturalness2", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Very Natural", "Natural", "Neutral", "Unnatural", "Very Unnatural"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-naturalness2-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-naturalness2-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">Did you find certain words hard to understand?</Label>
//               <RadioGroup
//                 value={ratings.understanding || ""}
//                 onValueChange={(v) => onUpdate("understanding", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Never", "Rarely", "Occasionally", "Often", "All of the time"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-understanding-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-understanding-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">Were the sounds in the audio distinguishable?</Label>
//               <RadioGroup
//                 value={ratings.distinguishable || ""}
//                 onValueChange={(v) => onUpdate("distinguishable", v)}
//                 className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2"
//               >
//                 {["Very Clear", "Clear", "Neutral", "Less Clear", "Much Less Clear"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-distinguishable-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-distinguishable-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-sm font-medium">
//                 Do you think that this voice can be used for an interactive telephone or wireless hand-held information
//                 service system?
//               </Label>
//               <RadioGroup
//                 value={ratings.telephoneUse || ""}
//                 onValueChange={(v) => onUpdate("telephoneUse", v)}
//                 className="mt-2 flex gap-4"
//               >
//                 {["Yes", "No"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem id={`${ratingKey}-telephoneUse-${o}`} value={o} />
//                     <Label htmlFor={`${ratingKey}-telephoneUse-${o}`} className="text-sm">
//                       {o}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const renderSection1 = () => {
//     const speaker = SPEAKERS[currentItemIndex]
//     const originalAudioUrl =(speaker_1: string) => `https://github.com/fiifinketia/nlp-server/raw/refs/heads/master/samples/ugtts/${speaker_1}_TW.wav`
//     const ratings = evaluationData.originalAudioRatings[speaker] || {}

//     return (
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Section 1: Original Audio Evaluation</h2>
//           <p className="text-muted-foreground">
//             Speaker {currentItemIndex + 1} of {SPEAKERS.length}: {speaker}
//           </p>
//           <Progress value={((currentItemIndex + 1) / SPEAKERS.length) * 100} className="w-full mt-2" />
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Play Original Audio — Speaker {speaker}</CardTitle>
//             <CardDescription>
//               Listen to the original audio sample and evaluate it using the criteria below
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {renderAudioPlayer(originalAudioUrl(speaker), `Original Audio - Speaker ${speaker}`)}

//             {renderEvaluationQuestions(`original-${speaker}`, ratings, (field, value) => {
//               setEvaluationData((prev) => ({
//                 ...prev,
//                 originalAudioRatings: {
//                   ...prev.originalAudioRatings,
//                   [speaker]: { ...ratings, [field]: value },
//                 },
//               }))
//             })}

//             {/* Save button for current evaluation */}
//             <Button
//               onClick={async () => {
//                 const naturalness = {
//                   quality: ratings.quality,
//                   pleasantness: ratings.pleasantness,
//                   naturalness: ratings.naturalness,
//                   continuity: ratings.continuity,
//                   longListening: ratings.longListening,
//                 }
//                 const intelligibility = {
//                   effort: ratings.effort,
//                   pronunciation: ratings.pronunciation,
//                   speed: ratings.speed,
//                   naturalness2: ratings.naturalness2,
//                   understanding: ratings.understanding,
//                   distinguishable: ratings.distinguishable,
//                   telephoneUse: ratings.telephoneUse,
//                 }

//                 await submitAudioEvaluation(
//                   "Section 1",
//                   speaker,
//                   undefined,
//                   "original",
//                   originalAudioUrl(speaker),
//                   naturalness,
//                   intelligibility,
//                 )
//               }}
//               disabled={isSaving || Object.values(ratings).filter(Boolean).length < 5}
//               className="w-full"
//             >
//               {isSaving ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Evaluation
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderSection2 = () => {
//     const item = section2Items[currentItemIndex]
//     const key = `${item.promptText.slice(0, 20)}-${item.modelType}-${item.speaker}`
//     const sample = synthesizedSamples[key]
//     const ratings = evaluationData.synthesizedAudioRatings[key] || {}

//     const handleGenerate = async () => {
//       setIsLoading(true)
//       await synthesizeAudio(item.promptText, item.modelType, item.speaker)
//       setIsLoading(false)
//     }

//     return (
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Section 2: Synthesized Audio Evaluation</h2>
//           <p className="text-muted-foreground">
//             Item {currentItemIndex + 1} of {section2Items.length}: Speaker {item.speaker} - {item.modelLabel} Model
//           </p>
//           <Progress value={((currentItemIndex + 1) / section2Items.length) * 100} className="w-full mt-2" />
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>
//               Prompt #{item.promptId}: {item.modelLabel} Model
//             </CardTitle>
//             <CardDescription>Speaker {item.speaker}</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="p-4 bg-muted rounded-lg">
//               <p className="text-sm font-medium mb-2">Text:</p>
//               <p className="text-sm">{item.promptText}</p>
//             </div>

//             {!sample ? (
//               <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
//                 <Wand2 className="h-4 w-4 mr-2" />
//                 Generate Audio
//               </Button>
//             ) : sample.isLoading ? (
//               <div className="flex items-center justify-center p-8">
//                 <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                 <span>Synthesizing audio...</span>
//               </div>
//             ) : sample.error ? (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{sample.error}</AlertDescription>
//               </Alert>
//             ) : (
//               <div className="space-y-6">
//                 {renderAudioPlayer(sample.url, `${item.modelLabel} Model - Speaker ${item.speaker}`)}

//                 {renderEvaluationQuestions(key, ratings, (field, value) => {
//                   setEvaluationData((prev) => ({
//                     ...prev,
//                     synthesizedAudioRatings: {
//                       ...prev.synthesizedAudioRatings,
//                       [key]: { ...ratings, [field]: value },
//                     },
//                   }))
//                 })}

//                 {/* Save button for current evaluation */}
//                 <Button
//                   onClick={async () => {
//                     const naturalness = {
//                       quality: ratings.quality,
//                       pleasantness: ratings.pleasantness,
//                       naturalness: ratings.naturalness,
//                       continuity: ratings.continuity,
//                       longListening: ratings.longListening,
//                     }
//                     const intelligibility = {
//                       effort: ratings.effort,
//                       pronunciation: ratings.pronunciation,
//                       speed: ratings.speed,
//                       naturalness2: ratings.naturalness2,
//                       understanding: ratings.understanding,
//                       distinguishable: ratings.distinguishable,
//                       telephoneUse: ratings.telephoneUse,
//                     }

//                     await submitAudioEvaluation(
//                       "Section 2",
//                       item.speaker,
//                       item.promptId,
//                       item.modelType,
//                       sample.url,
//                       naturalness,
//                       intelligibility,
//                     )
//                   }}
//                   disabled={isSaving || Object.values(ratings).filter(Boolean).length < 5}
//                   className="w-full"
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-4 w-4 mr-2" />
//                       Save Evaluation
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderSection3 = () => {
//     const generateUserTextAudio = async () => {
//       if (!evaluationData.userText.trim()) return
//       setUserTextAudio({ id: "user-text", url: "", isLoading: true, error: null })

//       try {
//         const res = await fetch(TTS_SYNTH_API, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: evaluationData.userText.trim(),
//             model_type: "ms",
//             speaker: "PT",
//           }),
//         })

//         const contentType = res.headers.get("content-type") || ""
//         if (!res.ok || !contentType.includes("audio")) {
//           const data = await res.text()
//           throw new Error(data || "Failed to synthesize")
//         }

//         const blob = await res.blob()
//         const url = URL.createObjectURL(blob)
//         setUserTextAudio({ id: "user-text", url, isLoading: false, error: null })
//       } catch (err) {
//         setUserTextAudio({
//           id: "user-text",
//           url: "",
//           isLoading: false,
//           error: err instanceof Error ? err.message : "Failed to synthesize",
//         })
//       }
//     }

//     return (
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Section 3: User Text Evaluation</h2>
//           <p className="text-muted-foreground">Write your own sentence in Akan and evaluate the result</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Your Akan Sentence</CardTitle>
//             <CardDescription>Please write your own sentence in Akan</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <Label htmlFor="user-text" className="text-base font-medium">
//                 Please write your own sentence in Akan:
//               </Label>
//               <UniversalTextInput
//                 id="user-text"
//                 value={evaluationData.userText}
//                 onChange={(v) => setEvaluationData((prev) => ({ ...prev, userText: v }))}
//                 placeholder="Enter your own Akan text..."
//                 rows={3}
//                 type="textarea"
//                 enableSpellCheck={true}
//                 enableKeyboard={true}
//                 apiBase={SC_API}
//                 className="mt-2"
//               />
//             </div>

//             <Button
//               onClick={generateUserTextAudio}
//               disabled={!evaluationData.userText.trim() || userTextAudio?.isLoading}
//               className="w-full"
//             >
//               {userTextAudio?.isLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Synthesizing...
//                 </>
//               ) : (
//                 <>
//                   <Volume2 className="h-4 w-4 mr-2" />
//                   Play Synthesized Version
//                 </>
//               )}
//             </Button>

//             {userTextAudio?.error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{userTextAudio.error}</AlertDescription>
//               </Alert>
//             )}

//             {userTextAudio?.url && (
//               <div className="space-y-6">
//                 {renderAudioPlayer(userTextAudio.url, "Your Synthesized Text")}

//                 {renderEvaluationQuestions("user-text", evaluationData.userTextRating, (field, value) => {
//                   setEvaluationData((prev) => ({
//                     ...prev,
//                     userTextRating: { ...prev.userTextRating, [field]: value },
//                   }))
//                 })}

//                 {/* Save button for user text evaluation */}
//                 <Button
//                   onClick={async () => {
//                     const naturalness = {
//                       quality: evaluationData.userTextRating.quality,
//                       pleasantness: evaluationData.userTextRating.pleasantness,
//                       naturalness: evaluationData.userTextRating.naturalness,
//                       continuity: evaluationData.userTextRating.continuity,
//                       longListening: evaluationData.userTextRating.longListening,
//                     }
//                     const intelligibility = {
//                       effort: evaluationData.userTextRating.effort,
//                       pronunciation: evaluationData.userTextRating.pronunciation,
//                       speed: evaluationData.userTextRating.speed,
//                       naturalness2: evaluationData.userTextRating.naturalness2,
//                       understanding: evaluationData.userTextRating.understanding,
//                       distinguishable: evaluationData.userTextRating.distinguishable,
//                       telephoneUse: evaluationData.userTextRating.telephoneUse,
//                     }

//                     await submitAudioEvaluation(
//                       "Section 3",
//                       "PT",
//                       undefined,
//                       "ms",
//                       userTextAudio.url,
//                       naturalness,
//                       intelligibility,
//                       undefined,
//                       evaluationData.userText,
//                     )
//                   }}
//                   disabled={isSaving || Object.values(evaluationData.userTextRating).filter(Boolean).length < 5}
//                   className="w-full"
//                 >
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-4 w-4 mr-2" />
//                       Save Evaluation
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderSection4 = () => {
//     const renderLikert = (key: keyof EvaluationData["appEvaluation"], label: string) => (
//       <div className="space-y-2">
//         <Label className="text-sm font-medium">{label}</Label>
//         <RadioGroup
//           value={evaluationData.appEvaluation[key]}
//           onValueChange={(v) =>
//             setEvaluationData((prev) => ({ ...prev, appEvaluation: { ...prev.appEvaluation, [key]: v } }))
//           }
//           className="flex gap-4"
//         >
//           {[1, 2, 3, 4, 5].map((s) => (
//             <div key={s} className="flex items-center gap-2">
//               <RadioGroupItem id={`${String(key)}-${s}`} value={String(s)} />
//               <Label htmlFor={`${String(key)}-${s}`}>{s}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//         <div className="flex justify-between text-xs text-muted-foreground">
//           <span>Strongly Disagree</span>
//           <span>Strongly Agree</span>
//         </div>
//       </div>
//     )

//     return (
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Section 4: Application Experience Survey</h2>
//           <p className="text-muted-foreground">Rate your agreement with the following statements</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Application Experience Survey</CardTitle>
//             <CardDescription>Rate your agreement (1 = Strongly Disagree, 5 = Strongly Agree)</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-8">
//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Intention to Use</h3>
//               {renderLikert("IN2", "I will use the app in the future")}
//               {renderLikert("IN3", "I am not going to use the app from now on")}
//               {renderLikert("IN4", "I am considering using the app in the coming weeks")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Effort</h3>
//               {renderLikert("EF1", "Using the app did not require a lot of effort from me")}
//               {renderLikert("EF2", "Using the app is straightforward for me")}
//               {renderLikert("EF3", "Using the app is stressful")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Credibility</h3>
//               {renderLikert("CR1", "The synthesis provided by the app is accurate")}
//               {renderLikert("CR2", "In my opinion, the provided synthesis is trustworthy")}
//               {renderLikert("CR3", "The provided synthesis is reliable")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Satisfaction</h3>
//               {renderLikert("SA1", "I am satisfied with the synthesized audios provided by the app")}
//               {renderLikert(
//                 "SA2",
//                 "I am satisfied with the overall effectiveness of the app in synthesized audios in my local language",
//               )}
//               {renderLikert(
//                 "SA3",
//                 "I don't think the app will be beneficial for synthesizing audios in my local language",
//               )}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Perceived Usefulness</h3>
//               {renderLikert(
//                 "PU1",
//                 "Using the audios synthesis app improves my ability to synthesize audios in my local language",
//               )}
//               {renderLikert("PU2", "The app improves my ability to synthesize audios in my local language")}
//               {renderLikert("PU3", "I find the audios synthesis app useful to me")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Perceived Ease of Use</h3>
//               {renderLikert("PE1", "Using the app was easy")}
//               {renderLikert("PE2", "Navigating the app was easy")}
//               {renderLikert("PE3", "The app is user friendly")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Attitude Towards Using</h3>
//               {renderLikert("AT1", "The audios synthesis app in my local language is a good idea")}
//               {renderLikert("AT2", "I have a positive feeling towards using the app")}
//               {renderLikert("AT3", "I enjoyed using the audios synthesis app")}
//               {renderLikert("AT4", "I am satisfied with my experience using the app")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Behavioral Intention</h3>
//               {renderLikert("BI1", "I intend to continue using the audios synthesis app")}
//               {renderLikert("BI2", "I will use the app frequently when I need audios synthesis in my local language")}
//               {renderLikert("BI3", "I would recommend the audios synthesis app to others")}
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               <h3 className="font-semibold text-lg">Actual Use</h3>
//               {renderLikert("AU1", "I have used the audios synthesis app")}
//               {renderLikert("AU2", "I have spent a significant amount of time using the app")}
//             </div>

//             {/* Save button for app evaluation */}
//             <Button
//               onClick={submitSurveyResponses}
//               disabled={isSaving || Object.values(evaluationData.appEvaluation).some((v) => v === "")}
//               className="w-full"
//             >
//               {isSaving ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Survey Responses
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderSection5 = () => {
//     return (
//       <div className="space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-2">Section 5: User Demographics</h2>
//           <p className="text-muted-foreground">Please provide some information about yourself</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Personal Information</CardTitle>
//             <CardDescription>This information helps us understand our participants</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <Label className="text-base font-medium">Gender</Label>
//               <RadioGroup
//                 value={evaluationData.gender}
//                 onValueChange={(v) => setEvaluationData((prev) => ({ ...prev, gender: v }))}
//                 className="mt-2 flex gap-4"
//               >
//                 {["Male", "Female"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem value={o} id={`gender-${o}`} />
//                     <Label htmlFor={`gender-${o}`}>{o}</Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-base font-medium">Age Range</Label>
//               <RadioGroup
//                 value={evaluationData.ageRange}
//                 onValueChange={(v) => setEvaluationData((prev) => ({ ...prev, ageRange: v }))}
//                 className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2"
//               >
//                 {["18–25", "26–35", "36–45", "46–60", "60+"].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem value={o} id={`age-${o}`} />
//                     <Label htmlFor={`age-${o}`}>{o}</Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div>
//               <Label className="text-base font-medium">Education Level</Label>
//               <RadioGroup
//                 value={evaluationData.educationLevel}
//                 onValueChange={(v) => setEvaluationData((prev) => ({ ...prev, educationLevel: v }))}
//                 className="mt-2 space-y-2"
//               >
//                 {[
//                   "No formal education",
//                   "Primary education",
//                   "Secondary education",
//                   "Tertiary (college/university)",
//                   "Postgraduate",
//                 ].map((o) => (
//                   <div key={o} className="flex items-center gap-2">
//                     <RadioGroupItem value={o} id={`education-${o}`} />
//                     <Label htmlFor={`education-${o}`}>{o}</Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <Separator />

//             <div className="space-y-6">
//               <div>
//                 <h3 className="font-semibold text-lg mb-2">Akan Language Proficiency</h3>
//                 <p className="text-sm text-muted-foreground mb-4">
//                   Please rate the following on a scale from 1 (Not at all) to 5 (Very fluent):
//                 </p>
//               </div>

//               {(["akanSpeaking", "akanReading", "akanWriting", "akanListening"] as const).map((field, idx) => {
//                 const labels = [
//                   "How well can you speak Akan?",
//                   "How well can you read Akan?",
//                   "How well can you write Akan?",
//                   "How well can you Listening / Understanding Akan?",
//                 ]
//                 return (
//                   <div key={field}>
//                     <Label className="text-base font-medium">{labels[idx]}</Label>
//                     <RadioGroup
//                       value={(evaluationData as any)[field]}
//                       onValueChange={(v) => setEvaluationData((prev) => ({ ...prev, [field]: v }))}
//                       className="flex gap-4 mt-2"
//                     >
//                       {[1, 2, 3, 4, 5].map((score) => (
//                         <div key={score} className="flex items-center gap-2">
//                           <RadioGroupItem value={String(score)} id={`${field}-${score}`} />
//                           <Label htmlFor={`${field}-${score}`}>{score}</Label>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                     <div className="flex justify-between text-xs text-muted-foreground mt-1">
//                       <span>Not at all</span>
//                       <span>Very fluent</span>
//                     </div>
//                   </div>
//                 )
//               })}

//               <div>
//                 <Label className="text-base font-medium">Which type of Akan do you speak most often?</Label>
//                 <RadioGroup
//                   value={evaluationData.akanType}
//                   onValueChange={(v) => setEvaluationData((prev) => ({ ...prev, akanType: v }))}
//                   className="mt-2 space-y-2"
//                 >
//                   {["Asante Twi", "Akuapem Twi", "Fante", "Other"].map((o) => (
//                     <div key={o} className="flex items-center gap-2">
//                       <RadioGroupItem value={o} id={`akan-type-${o}`} />
//                       <Label htmlFor={`akan-type-${o}`}>{o}</Label>
//                     </div>
//                   ))}
//                 </RadioGroup>
//                 {evaluationData.akanType === "Other" && (
//                   <Input
//                     placeholder="Please specify..."
//                     value={evaluationData.akanTypeOther}
//                     onChange={(e) => setEvaluationData((prev) => ({ ...prev, akanTypeOther: e.target.value }))}
//                     className="mt-2"
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Save demographics button */}
//             <Button
//               onClick={submitDemographics}
//               disabled={
//                 isSaving ||
//                 !evaluationData.gender ||
//                 !evaluationData.ageRange ||
//                 !evaluationData.educationLevel ||
//                 !evaluationData.akanSpeaking ||
//                 !evaluationData.akanReading ||
//                 !evaluationData.akanWriting ||
//                 !evaluationData.akanListening ||
//                 !evaluationData.akanType ||
//                 (evaluationData.akanType === "Other" && !evaluationData.akanTypeOther)
//               }
//               className="w-full"
//             >
//               {isSaving ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-4 w-4 mr-2" />
//                   Save Demographics
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderSubmitSection = () => {
//     return (
//       <div className="space-y-6">
//         <div className="text-center">
//           <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Evaluation Complete!</h2>
//           <p className="text-muted-foreground">Thank you for your participation in this TTS evaluation study.</p>
//           {sessionId && (
//             <p className="text-sm text-muted-foreground mt-2">
//               Session ID: <code className="bg-muted px-2 py-1 rounded">{sessionId}</code>
//             </p>
//           )}
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Evaluation Summary</CardTitle>
//             <CardDescription>Your responses have been saved to the database</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2 text-sm">
//               <p>✅ Session created and tracked</p>
//               <p>✅ Audio evaluations submitted individually</p>
//               <p>✅ Demographics saved separately</p>
//               <p>✅ All data linked by session ID</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const getCurrentSectionData = () => {
//     switch (currentSection) {
//       case 1:
//         return {
//           totalItems: SPEAKERS.length,
//           currentIndex: currentItemIndex,
//           canProceed: () => {
//             const speaker = SPEAKERS[currentItemIndex]
//             const ratings = evaluationData.originalAudioRatings[speaker]
//             return ratings && Object.values(ratings).every(value => value !== "")
//           },
//         }
//       case 2:
//         return {
//           totalItems: section2Items.length,
//           currentIndex: currentItemIndex,
//           canProceed: () => {
//             const item = section2Items[currentItemIndex]
//             const key = `${item.promptText.slice(0, 20)}-${item.modelType}-${item.speaker}`
//             const ratings = evaluationData.synthesizedAudioRatings[key]
//             const sample = synthesizedSamples[key]
//             return sample?.url && ratings && Object.values(ratings).every(value => value !== "")
//           },
//         }
//       case 3:
//         return {
//           totalItems: 1,
//           currentIndex: 0,
//           canProceed: () => {
//             return (
//               evaluationData.userText.trim().length > 0 &&
//               userTextAudio?.url &&
//               Object.values(evaluationData.userTextRating).every(value => value !== "")
//             )
//           },
//         }
//       case 4:
//         return {
//           totalItems: 1,
//           currentIndex: 0,
//           canProceed: () => Object.values(evaluationData.appEvaluation).every((v) => v !== ""),
//         }
//       case 5:
//         return {
//           totalItems: 1,
//           currentIndex: 0,
//           canProceed: () => {
//             return (
//               evaluationData.gender &&
//               evaluationData.ageRange &&
//               evaluationData.educationLevel &&
//               evaluationData.akanSpeaking &&
//               evaluationData.akanReading &&
//               evaluationData.akanWriting &&
//               evaluationData.akanListening &&
//               evaluationData.akanType &&
//               (evaluationData.akanType !== "Other" || evaluationData.akanTypeOther)
//             )
//           },
//         }
//       default:
//         return { totalItems: 1, currentIndex: 0, canProceed: () => true }
//     }
//   }

//   // Auto-save current evaluation before proceeding
//   const autoSaveCurrentEvaluation = async () => {
//     if (!sessionId) return false

//     try {
//       switch (currentSection) {
//         case 1: {
//           const speaker = SPEAKERS[currentItemIndex]
//           const ratings = evaluationData.originalAudioRatings[speaker]
//           if (ratings && Object.values(ratings).every(value => value !== "")) {
//             const naturalness = {
//               quality: ratings.quality,
//               pleasantness: ratings.pleasantness,
//               naturalness: ratings.naturalness,
//               continuity: ratings.continuity,
//               longListening: ratings.longListening,
//             }
//             const intelligibility = {
//               effort: ratings.effort,
//               pronunciation: ratings.pronunciation,
//               speed: ratings.speed,
//               naturalness2: ratings.naturalness2,
//               understanding: ratings.understanding,
//               distinguishable: ratings.distinguishable,
//               telephoneUse: ratings.telephoneUse,
//             }
//             return await submitAudioEvaluation(
//               "Section 1",
//               speaker,
//               undefined,
//               "original",
//               `https://github.com/fiifinketia/nlp-server/raw/refs/heads/master/samples/ugtts/${speaker}_TW.wav`,
//               naturalness,
//               intelligibility,
//             )
//           }
//           break
//         }
//         case 2: {
//           const item = section2Items[currentItemIndex]
//           const key = `${item.promptText.slice(0, 20)}-${item.modelType}-${item.speaker}`
//           const ratings = evaluationData.synthesizedAudioRatings[key]
//           const sample = synthesizedSamples[key]
//           if (sample?.url && ratings && Object.values(ratings).every(value => value !== "")) {
//             const naturalness = {
//               quality: ratings.quality,
//               pleasantness: ratings.pleasantness,
//               naturalness: ratings.naturalness,
//               continuity: ratings.continuity,
//               longListening: ratings.longListening,
//             }
//             const intelligibility = {
//               effort: ratings.effort,
//               pronunciation: ratings.pronunciation,
//               speed: ratings.speed,
//               naturalness2: ratings.naturalness2,
//               understanding: ratings.understanding,
//               distinguishable: ratings.distinguishable,
//               telephoneUse: ratings.telephoneUse,
//             }
//             return await submitAudioEvaluation(
//               "Section 2",
//               item.speaker,
//               item.promptId,
//               item.modelType,
//               sample.url,
//               naturalness,
//               intelligibility,
//             )
//           }
//           break
//         }
//         case 3: {
//           if (evaluationData.userText.trim().length > 0 && userTextAudio?.url && 
//               Object.values(evaluationData.userTextRating).every(value => value !== "")) {
//             const naturalness = {
//               quality: evaluationData.userTextRating.quality,
//               pleasantness: evaluationData.userTextRating.pleasantness,
//               naturalness: evaluationData.userTextRating.naturalness,
//               continuity: evaluationData.userTextRating.continuity,
//               longListening: evaluationData.userTextRating.longListening,
//             }
//             const intelligibility = {
//               effort: evaluationData.userTextRating.effort,
//               pronunciation: evaluationData.userTextRating.pronunciation,
//               speed: evaluationData.userTextRating.speed,
//               naturalness2: evaluationData.userTextRating.naturalness2,
//               understanding: evaluationData.userTextRating.understanding,
//               distinguishable: evaluationData.userTextRating.distinguishable,
//               telephoneUse: evaluationData.userTextRating.telephoneUse,
//             }
//             return await submitAudioEvaluation(
//               "Section 3",
//               "PT",
//               undefined,
//               "ms",
//               userTextAudio.url,
//               naturalness,
//               intelligibility,
//               undefined,
//               evaluationData.userText,
//             )
//           }
//           break
//         }
//         case 4: {
//           if (Object.values(evaluationData.appEvaluation).every((v) => v !== "")) {
//             return await submitSurveyResponses()
//           }
//           break
//         }
//         case 5: {
//           if (evaluationData.gender && evaluationData.ageRange && evaluationData.educationLevel &&
//               evaluationData.akanSpeaking && evaluationData.akanReading && evaluationData.akanWriting &&
//               evaluationData.akanListening && evaluationData.akanType &&
//               (evaluationData.akanType !== "Other" || evaluationData.akanTypeOther)) {
//             return await submitDemographics()
//           }
//           break
//         }
//       }
//       return true
//     } catch (err) {
//       console.error("Auto-save failed:", err)
//       return false
//     }
//   }

//   // Check if all items in current section are complete
//   const checkAllItemsInSectionComplete = () => {
//     switch (currentSection) {
//       case 1:
//         // Check if ALL speakers have been evaluated
//         return SPEAKERS.every(speaker => {
//           const ratings = evaluationData.originalAudioRatings[speaker]
//           return ratings && Object.values(ratings).filter(Boolean).length >= 5
//         })
//       case 2:
//         // Check if ALL section 2 items have been evaluated
//         return section2Items.every(item => {
//           const key = `${item.promptText.slice(0, 20)}-${item.modelType}-${item.speaker}`
//           const ratings = evaluationData.synthesizedAudioRatings[key]
//           const sample = synthesizedSamples[key]
//           return sample?.url && ratings && Object.values(ratings).filter(Boolean).length >= 5
//         })
//       case 3:
//         return (
//           evaluationData.userText.trim().length > 0 &&
//           userTextAudio?.url &&
//           Object.values(evaluationData.userTextRating).filter(Boolean).length >= 5
//         )
//       case 4:
//         return Object.values(evaluationData.appEvaluation).every((v) => v !== "")
//       case 5:
//         return (
//           evaluationData.gender &&
//           evaluationData.ageRange &&
//           evaluationData.educationLevel &&
//           evaluationData.akanSpeaking &&
//           evaluationData.akanReading &&
//           evaluationData.akanWriting &&
//           evaluationData.akanListening &&
//           evaluationData.akanType &&
//           (evaluationData.akanType !== "Other" || evaluationData.akanTypeOther)
//         )
//       default:
//         return true
//     }
//   }

//   const handleNext = async () => {
//     const sectionData = getCurrentSectionData()
    
//     // Auto-save current evaluation before proceeding
//     const saveSuccess = await autoSaveCurrentEvaluation()
    
//     if (!saveSuccess) {
//       setError("Failed to save current evaluation. Please try again.")
//       return
//     }

//     if (currentItemIndex < sectionData.totalItems - 1) {
//       setCurrentItemIndex(currentItemIndex + 1)
//     } else {
//       if (currentSection < 5) {
//         setCurrentSection(currentSection + 1)
//         setCurrentItemIndex(0)
//       } else {
//         setCurrentSection(6) // Submit section
//       }
//     }
//   }

//   const handlePrevious = () => {
//     if (currentItemIndex > 0) {
//       setCurrentItemIndex(currentItemIndex - 1)
//     } else if (currentSection > 1) {
//       setCurrentSection(currentSection - 1)
//       const prevSectionData = getCurrentSectionData()
//       setCurrentItemIndex(prevSectionData.totalItems - 1)
//     }
//   }

//   const renderCurrentSection = () => {
//     switch (currentSection) {
//       case 1:
//         return renderSection1()
//       case 2:
//         return renderSection2()
//       case 3:
//         return renderSection3()
//       case 4:
//         return renderSection4()
//       case 5:
//         return renderSection5()
//       case 6:
//         return renderSubmitSection()
//       default:
//         return null
//     }
//   }

//   const sectionData = getCurrentSectionData()

//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           <div className="flex items-center justify-center gap-4">
//             <Button variant="outline" onClick={() => (window.location.href = "/tts")}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               TTS Interface
//             </Button>
//             <h1 className="text-3xl font-bold">TTS Evaluation Study</h1>
//           </div>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             This evaluation consists of 5 sections. Please complete each item thoroughly before proceeding to the next.
//           </p>
//           {sessionId && (
//             <p className="text-xs text-muted-foreground">
//               Session: <code className="bg-muted px-1 py-0.5 rounded text-xs">{sessionId.slice(0, 8)}...</code>
//             </p>
//           )}
//         </div>

//         {/* Progress Indicator */}
//         {currentSection <= 5 && (
//           <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
//             <span>Section {currentSection} of 5</span>
//             <div className="flex space-x-1">
//               {[1, 2, 3, 4, 5].map((s) => (
//                 <div
//                   key={s}
//                   className={`w-2 h-2 rounded-full ${
//                     s === currentSection ? "bg-primary" : s < currentSection ? "bg-primary/50" : "bg-muted"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Save Status */}
//         {saveStatus && (
//           <Alert>
//             <CheckCircle className="h-4 w-4" />
//             <AlertDescription>{saveStatus}</AlertDescription>
//           </Alert>
//         )}

//         {/* Error Display */}
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* Session Restoration Loading */}
//         {isRestoring && (
//           <Alert>
//             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//             <AlertDescription>Restoring your session...</AlertDescription>
//           </Alert>
//         )}

//         {/* Main Content */}
//         {!isRestoring && renderCurrentSection()}

//         {/* Navigation */}
//         {currentSection <= 5 && !isRestoring && (
//           <div className="flex justify-between">
//             <Button
//               variant="outline"
//               onClick={handlePrevious}
//               disabled={currentSection === 1 && currentItemIndex === 0}
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Previous
//             </Button>
//             <Button onClick={handleNext} disabled={!sectionData.canProceed()}>
//               {currentSection === 5 ? "Complete" : "Next"}
//               <ArrowRight className="h-4 w-4 ml-2" />
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function TTSEvaluationPage() {
//   return (
//     <Suspense fallback={
//       <div className="container mx-auto p-4 max-w-4xl">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center space-y-4">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//             <p className="text-muted-foreground">Loading evaluation...</p>
//           </div>
//         </div>
//       </div>
//     }>
//       <TTSEvaluationPageContent />
//     </Suspense>
//   )
// }
