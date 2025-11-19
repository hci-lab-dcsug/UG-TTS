const TTS_BASE = "https://hcidcsug--ugtts-vits-twi-akan-api.modal.run"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const upstream = await fetch(`${TTS_BASE}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const contentType = upstream.headers.get("content-type") || ""

    if (!upstream.ok) {
      const errText = await upstream.text()
      return new Response(errText, {
        status: upstream.status,
        headers: {
          "content-type": contentType.includes("application/json") ? "application/json" : "text/plain",
          ...CORS_HEADERS,
        },
      })
    }

    // Stream audio back to the client
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "content-type": contentType || "audio/wav",
        "content-disposition": 'attachment; filename="speech.wav"',
        ...CORS_HEADERS,
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: err instanceof Error ? err.message : "Synthesis failed" }), {
      status: 500,
      headers: {
        "content-type": "application/json",
        ...CORS_HEADERS,
      },
    })
  }
}
