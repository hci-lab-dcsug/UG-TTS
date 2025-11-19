import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      section,
      speaker,
      promptNumber,
      modelType,
      audioFileUrl,
      naturalness,
      intelligibility,
      likertResponses,
      userText,
    } = await request.json()

    // Validate required fields
    if (!sessionId || !section) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Insert evaluation result
    await sql`
      INSERT INTO evaluation_results (
        session_id, 
        section, 
        speaker, 
        prompt_number, 
        model_type, 
        audio_file_url, 
        naturalness, 
        intelligibility, 
        likert_responses, 
        user_text,
        submitted_at
      )
      VALUES (
        ${sessionId},
        ${section},
        ${speaker || null},
        ${promptNumber || null},
        ${modelType || null},
        ${audioFileUrl || null},
        ${JSON.stringify(naturalness || {})},
        ${JSON.stringify(intelligibility || {})},
        ${JSON.stringify(likertResponses || {})},
        ${userText || null},
        NOW()
      )
    `

    return NextResponse.json({
      success: true,
      message: "Audio evaluation submitted successfully",
    })
  } catch (error) {
    console.error("Failed to submit audio evaluation:", error)
    return NextResponse.json({ success: false, error: "Failed to submit evaluation" }, { status: 500 })
  }
}
