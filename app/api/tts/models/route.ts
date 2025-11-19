const TTS_BASE = "https://hcidcsug--ugtts-vits-twi-akan-api.modal.run"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS })
}

export async function GET() {
  try {
    const upstream = await fetch(`${TTS_BASE}/`, { method: "GET" })
    const text = await upstream.text()
    const contentType = upstream.headers.get("content-type") || "application/json"
    return new Response(text, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
        ...CORS_HEADERS,
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ message: err instanceof Error ? err.message : "Failed to fetch models" }), {
      status: 500,
      headers: {
        "content-type": "application/json",
        ...CORS_HEADERS,
      },
    })
  }
}
