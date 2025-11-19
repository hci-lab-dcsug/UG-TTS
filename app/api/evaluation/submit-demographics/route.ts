// import { type NextRequest, NextResponse } from "next/server"
// import { neon } from "@neondatabase/serverless"

// const sql = neon(process.env.DATABASE_URL!)

// export async function POST(request: NextRequest) {
//   try {
//     const { sessionId, gender, ageRange, education, akanProficiency, akanDialect, otherDialect } = await request.json()

//     // Validate required fields
//     if (!sessionId) {
//       return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
//     }

//     // Check if demographics already exist for this session
//     const existing = await sql`
//       SELECT session_id FROM user_demographics WHERE session_id = ${sessionId}
//     `

//     if (existing.length > 0) {
//       return NextResponse.json(
//         { success: false, error: "Demographics already submitted for this session" },
//         { status: 409 },
//       )
//     }

//     // Insert demographics
//     await sql`
//       INSERT INTO user_demographics (
//         session_id,
//         gender,
//         age_range,
//         education,
//         akan_proficiency,
//         akan_dialect,
//         other_dialect,
//         submitted_at
//       )
//       VALUES (
//         ${sessionId},
//         ${gender || null},
//         ${ageRange || null},
//         ${education || null},
//         ${JSON.stringify(akanProficiency || {})},
//         ${akanDialect || null},
//         ${otherDialect || null},
//         NOW()
//       )
//     `

//     return NextResponse.json({
//       success: true,
//       message: "Demographics submitted successfully",
//     })
//   } catch (error) {
//     console.error("Failed to submit demographics:", error)
//     return NextResponse.json({ success: false, error: "Failed to submit demographics" }, { status: 500 })
//   }
// }
