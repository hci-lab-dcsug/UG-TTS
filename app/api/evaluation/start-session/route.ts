import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { deviceInfo } = await request.json()

    // Generate unique session ID
    const sessionId = crypto.randomUUID()

    // Insert session into database
    await sql`
      INSERT INTO sessions (session_id, device_info, created_at)
      VALUES (${sessionId}, ${deviceInfo || null}, NOW())
    `

    return NextResponse.json({
      success: true,
      sessionId,
    })
  } catch (error) {
    console.error("Failed to start evaluation session:", error)
    return NextResponse.json({ success: false, error: "Failed to start session" }, { status: 500 })
  }
}
