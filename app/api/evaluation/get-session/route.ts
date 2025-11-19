import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon("")

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    // Get session info
    const sessionResult = await sql`
      SELECT * FROM sessions WHERE session_id = ${sessionId}
    `

    if (sessionResult.length === 0) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 })
    }

    // Get demographics
    const demographicsResult = await sql`
      SELECT * FROM user_demographics WHERE session_id = ${sessionId}
    `

    // Get survey responses
    const surveyResult = await sql`
      SELECT * FROM app_survey_responses WHERE session_id = ${sessionId}
    `

    // Get audio evaluations
    const audioEvaluationsResult = await sql`
      SELECT * FROM evaluation_results WHERE session_id = ${sessionId}
      ORDER BY submitted_at ASC
    `

    // Calculate progress based on submitted evaluations
    let currentSection = 1
    let currentItemIndex = 0

    // Section 1: Original audio evaluations (3 speakers)
    const section1Count = audioEvaluationsResult.filter(evaluation => evaluation.section === "Section 1").length
    if (section1Count < 3) {
      currentSection = 1
      currentItemIndex = section1Count
    } else {
      // Section 2: Synthesized audio evaluations (36 items: 3 speakers × 6 prompts × 2 models)
      const section2Count = audioEvaluationsResult.filter(evaluation => evaluation.section === "Section 2").length
      if (section2Count < 36) {
        currentSection = 2
        currentItemIndex = section2Count
      } else {
        // Section 3: User text evaluation
        const section3Count = audioEvaluationsResult.filter(evaluation => evaluation.section === "Section 3").length
        if (section3Count < 1) {
          currentSection = 3
          currentItemIndex = 0
        } else if (surveyResult.length === 0) {
          // Section 4: Survey responses
          currentSection = 4
          currentItemIndex = 0
        } else if (demographicsResult.length === 0) {
          // Section 5: Demographics
          currentSection = 5
          currentItemIndex = 0
        } else {
          // All sections completed
          currentSection = 6
          currentItemIndex = 0
        }
      }
    }

    const sessionData = {
      progress: {
        currentSection,
        currentItemIndex,
      },
      demographics: demographicsResult[0] || null,
      survey: surveyResult[0] || null,
      audioEvaluations: audioEvaluationsResult,
    }

    return NextResponse.json({
      success: true,
      sessionData,
    })
  } catch (error) {
    console.error("Failed to get session data:", error)
    return NextResponse.json({ success: false, error: "Failed to get session data" }, { status: 500 })
  }
}
