// import { type NextRequest, NextResponse } from "next/server"
// import { neon } from "@neondatabase/serverless"

// const sql = neon(process.env.DATABASE_URL!)

// export async function POST(request: NextRequest) {
//   try {
//     const {
//       sessionId,
//       IN2, IN3, IN4,
//       EF1, EF2, EF3,
//       CR1, CR2, CR3,
//       SA1, SA2, SA3,
//       PU1, PU2, PU3,
//       PE1, PE2, PE3,
//       AT1, AT2, AT3, AT4,
//       BI1, BI2, BI3,
//       AU1, AU2,
//     } = await request.json()

//     // Validate required fields
//     if (!sessionId) {
//       return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
//     }

//     // Validate that all survey responses are provided and are integers
//     const surveyResponses = {
//       IN2, IN3, IN4,
//       EF1, EF2, EF3,
//       CR1, CR2, CR3,
//       SA1, SA2, SA3,
//       PU1, PU2, PU3,
//       PE1, PE2, PE3,
//       AT1, AT2, AT3, AT4,
//       BI1, BI2, BI3,
//       AU1, AU2,
//     }

//     for (const [key, value] of Object.entries(surveyResponses)) {
//       if (value === undefined || value === null || value === "") {
//         return NextResponse.json({ 
//           success: false, 
//           error: `Missing required field: ${key}` 
//         }, { status: 400 })
//       }
      
//       const numValue = parseInt(String(value))
//       if (isNaN(numValue) || numValue < 1 || numValue > 5) {
//         return NextResponse.json({ 
//           success: false, 
//           error: `Invalid value for ${key}: must be an integer between 1 and 5` 
//         }, { status: 400 })
//       }
//     }

//     // Check if survey responses already exist for this session
//     const existing = await sql`
//       SELECT session_id FROM app_survey_responses WHERE session_id = ${sessionId}
//     `

//     if (existing.length > 0) {
//       return NextResponse.json(
//         { success: false, error: "Survey responses already submitted for this session" },
//         { status: 409 },
//       )
//     }

//     // Insert survey responses
//     await sql`
//       INSERT INTO app_survey_responses (
//         session_id,
//         IN2, IN3, IN4,
//         EF1, EF2, EF3,
//         CR1, CR2, CR3,
//         SA1, SA2, SA3,
//         PU1, PU2, PU3,
//         PE1, PE2, PE3,
//         AT1, AT2, AT3, AT4,
//         BI1, BI2, BI3,
//         AU1, AU2,
//         submitted_at
//       )
//       VALUES (
//         ${sessionId},
//         ${parseInt(String(IN2))}, ${parseInt(String(IN3))}, ${parseInt(String(IN4))},
//         ${parseInt(String(EF1))}, ${parseInt(String(EF2))}, ${parseInt(String(EF3))},
//         ${parseInt(String(CR1))}, ${parseInt(String(CR2))}, ${parseInt(String(CR3))},
//         ${parseInt(String(SA1))}, ${parseInt(String(SA2))}, ${parseInt(String(SA3))},
//         ${parseInt(String(PU1))}, ${parseInt(String(PU2))}, ${parseInt(String(PU3))},
//         ${parseInt(String(PE1))}, ${parseInt(String(PE2))}, ${parseInt(String(PE3))},
//         ${parseInt(String(AT1))}, ${parseInt(String(AT2))}, ${parseInt(String(AT3))}, ${parseInt(String(AT4))},
//         ${parseInt(String(BI1))}, ${parseInt(String(BI2))}, ${parseInt(String(BI3))},
//         ${parseInt(String(AU1))}, ${parseInt(String(AU2))},
//         NOW()
//       )
//     `

//     return NextResponse.json({
//       success: true,
//       message: "Survey responses submitted successfully",
//     })
//   } catch (error) {
//     console.error("Failed to submit survey responses:", error)
//     return NextResponse.json({ success: false, error: "Failed to submit survey responses" }, { status: 500 })
//   }
// }
